// @ts-ignore
import * as anchor from '@project-serum/anchor';

// @ts-ignore
import * as serumCmn from "@project-serum/common";

import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { BN, web3, Program, Provider } = anchor
const { SystemProgram, Keypair, Transaction } = web3
const utf8 = anchor.utils.bytes.utf8;

const LAUNCHPAD_TAG = "launchpad";
const USER_TAG = "user";
const PROJECT_TAG = "project";
const PROJECT_VAULT_TAG = "project-vault";
const TREASURY_VAULT_TAG = "treasury-vault";
const USER_PROJECT_TOKEN_TAG = "user-project-token";

const stakingProgramId = new PublicKey(STAKE_TIERS_PROGRAM_ID)

const stakingPoolId = new PublicKey(STAKE_TIERS_POOL_ID)


function getNumber (num: number) {
  return new BN(num * 10 ** 9)
}

const defaultAccounts = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
  rent: anchor.web3.SYSVAR_RENT_PUBKEY,
}

import launchpad_idl from '@/utils/crp-launchpad-idl.json'
import { Connection, PublicKey, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY} from '@solana/web3.js';
import { LAUNCHPAD_PROGRAM_ID, STAKE_TIERS_POOL_ID, STAKE_TIERS_PROGRAM_ID } from './ids';
import moment from 'moment';
import { sendTransaction } from './web3';
let LaunchpadProgram:any = null

export function setAnchorProvider(
  connection: Connection,
  wallet: any,
) {

  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions(),
  );
  // Generate the program client from IDL.
  const program = new (anchor as any).Program(launchpad_idl, new PublicKey(LAUNCHPAD_PROGRAM_ID), provider);
  LaunchpadProgram = program
}

export async function getLaunchpadAddress(){
  const [launchpad, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('launchpad')],
    LaunchpadProgram.programId
  );
  return launchpad
}

export async function getProjectAddress(mint: anchor.web3.PublicKey){
  const [project, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('project'), mint.toBuffer() ],
    LaunchpadProgram.programId
  );
  return project
}


export async function createLaunchpad(
  connection:Connection,
  wallet: any,
) {
  const maxXcrpTier0 = new anchor.BN(199);
  const maxXcrpTier1 = new anchor.BN(1999);
  const maxXcrpTier2 = new anchor.BN(9999);
  const maxXcrpTier3 = new anchor.BN(19999);
  const maxXcrpTier4 = new anchor.BN(99999);
  const [globalStateKey] = 
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(LAUNCHPAD_TAG)],
        LaunchpadProgram.programId,
      );
  console.log("LaunchpadProgram.programId", LaunchpadProgram.programId.toBase58())
  let txHash = await LaunchpadProgram.rpc.setLaunchpad(
    maxXcrpTier0,
    maxXcrpTier1,
    maxXcrpTier2,
    maxXcrpTier3,
    maxXcrpTier4,
    {
      accounts: {
        authority: wallet.publicKey,
        launchpad: globalStateKey,
        treasury: wallet.publicKey,
        stakingProgramId: stakingProgramId,
        stakingPoolId: stakingPoolId,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);
}

export async function getLaunchpad(){
  const launchpadAddress = await getLaunchpadAddress();
  try{
    const data = await LaunchpadProgram.account.launchpadAccount.fetch(launchpadAddress)
    return data
  }
  catch{

  }
  return null
}


export async function getProject(mint: string){
  const projectAddress = await getProjectAddress(new PublicKey(mint));
  try{
    const data = await LaunchpadProgram.account.projectAccount.fetch(projectAddress)
    return data
  }
  catch{

  }
  return null
}

export async function getProjectFormatted(mint: string){
  try{
    const data = await getProject(mint)
    return {
      date_preparation: time2str(data.prepareDate),
      date_whitelist_start: time2str(data.wlStartDate),
      date_whitelist_end: time2str(data.wlEndDate),
      date_sale_start: time2str(data.saleStartDate),
      date_sale_end: time2str(data.saleEndDate),
      date_distribution: time2str(data.distributionDate),
      token_price: data.tokenPrice.toString() / PRICE_PRECISION,
      pool_size: data.poolSize.toString(),
      first_liberation: data.firstLiberation.toString(),
      price_token_mint: data.priceTokenMint.toString(),
      
      max_allocation:  [ 
        new Number(data.maxAllocTier0.toString()), 
        new Number(data.maxAllocTier1.toString()),
        new Number(data.maxAllocTier2.toString()),
        new Number(data.maxAllocTier3.toString()),
        new Number(data.maxAllocTier4.toString()),
        new Number(data.maxAllocTier5.toString())
      ]
    }
  }
  catch{
  }
  return {}
}

const datetime_format = 'YYYY-MM-DD HH:mm:ss'
function str2time(date:string){
  return new BN(moment(date, datetime_format).format("X"))
}

function time2str(date: any){
  return moment(new Date(date * 1000)).format(datetime_format)
}
const PRICE_PRECISION = 1000000;

function formatProjectParams(
  prepareDate: any,
  whiltelistStartDate: any,
  whiltelistEndDate: any,
  saleStartDate: any,
  saleEndDate: any,
  distributionDate: any,
  
  max_allocs: any[],

  tokenPrice: any,
  poolSize: any,
  firstLiberation: any,
){
  return [
    str2time(prepareDate),
    str2time(whiltelistStartDate),
    str2time(whiltelistEndDate),
    str2time(saleStartDate),
    str2time(saleEndDate),
    str2time(distributionDate),
    
    max_allocs.map(function(ele){ return new BN(ele)}),
    
    new BN(Math.ceil(tokenPrice * PRICE_PRECISION)),
    new BN(poolSize),
    new BN(firstLiberation),
  ]
}

export async function saveProject(
  connection:Connection,
  wallet: any,

  projectMint: string,
  priceTokenMint: string,

  prepareDate: any,
  whiltelistStartDate: any,
  whiltelistEndDate: any,
  saleStartDate: any,
  saleEndDate: any,
  distributionDate: any,
  
  max_allocs: any[],

  tokenPrice: any,
  poolSize: any,
  firstLiberation: any,
)
{
  const [projectAddress] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(PROJECT_TAG), new PublicKey(projectMint).toBuffer() ],
    LaunchpadProgram.programId
  );
  const paramFormatted = await formatProjectParams(  
    prepareDate,
    whiltelistStartDate,
    whiltelistEndDate,
    saleStartDate,
    saleEndDate,
    distributionDate,
    
    max_allocs,
  
    tokenPrice,
    poolSize,
    firstLiberation,
  );
  let txHash = await LaunchpadProgram.rpc.setProject(
    ...paramFormatted,
    {
      accounts: {
        authority: wallet.publicKey,
        project: projectAddress,
        projectMint: projectMint,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);
}

export async function setSaleToken(
  connection:Connection,
  wallet: any,
  projectMint: PublicKey,
  saleMint: PublicKey,
) {
  const [launchpadKey] = 
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(LAUNCHPAD_TAG)],
        LaunchpadProgram.programId,
      );
    const [projectKey] = 
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(PROJECT_TAG), projectMint.toBuffer()],
        LaunchpadProgram.programId,
      );
    const launchpadData = await LaunchpadProgram.account.launchpadAccount.fetch(launchpadKey);
    const treasury = launchpadData.treasury;

    const [treasuryVault] = 
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(TREASURY_VAULT_TAG), projectKey.toBuffer()],
        LaunchpadProgram.programId,
      );
  let txHash = await LaunchpadProgram.rpc.setSaleToken(
    {
      accounts: {
        launchpad: launchpadKey,
        treasuryVault,
        treasury,
        authority: wallet.publicKey,
        project: projectKey,
        saleMint: saleMint,

        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);

  return {
    amount:0,
    success: true,
    txId:txHash,
    hash:""
  }
}

export async function depositProjectToken(
  connection:Connection,
  wallet: any,
  projectMint: PublicKey,
  userVault: PublicKey,
  amount:any
) {
  const [projectKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROJECT_TAG), projectMint.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [projectVaultKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROJECT_VAULT_TAG), projectKey.toBuffer()],
      LaunchpadProgram.programId,
    );
  const depositAmount = new anchor.BN(amount)

  let txHash = await LaunchpadProgram.rpc.depositProjectToken(
    depositAmount,
    {
      accounts: {
        project: projectKey,
        projectMint: projectMint,
        projectVault: projectVaultKey,
        userVault: userVault,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);
  return {
    amount:amount,
    success: true,
    txId:txHash,
    hash:""
  }
}

export async function withdrawProjectToken(
  connection:Connection,
  wallet: any,
  projectMint: PublicKey,
  userVault: PublicKey,
  amount:any
) {
  const [projectKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROJECT_TAG), projectMint.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [projectVaultKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROJECT_VAULT_TAG), projectKey.toBuffer()],
      LaunchpadProgram.programId,
    );
  const withdrawAmount = new anchor.BN(amount)
  
  let txHash = await LaunchpadProgram.rpc.withdrawProjectToken(
    withdrawAmount,
    {
      accounts: {
        project: projectKey,
        projectVault: projectVaultKey,
        userVault: userVault,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);
  return {
    amount:amount,
    success: true,
    txId:txHash,
    hash:""
  }
}
export async function subscribeToWhitelist(
  connection:Connection,
  wallet: any,
  projectMint: PublicKey,
) {
  const [userKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(USER_TAG), wallet.publicKey.toBuffer(), projectMint.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [userProjectToken] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(USER_PROJECT_TOKEN_TAG), wallet.publicKey.toBuffer()],
      LaunchpadProgram.programId,
    );
  let txHash = await LaunchpadProgram.rpc.registerUser(
    {
      accounts: {
        authority: wallet.publicKey,
        user: userKey,
        projectMint: projectMint,
        userProjectToken,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);
  return {
    amount:0,
    success: true,
    txId:txHash,
    hash:""
  }
}

export async function buyTokens(
  connection:Connection,
  wallet: any,
  projectMint: PublicKey,
  userSaleTokenAccount: PublicKey,
  amount:any
) {
  const payableAmount = new anchor.BN(amount)
  const [launchpadKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(LAUNCHPAD_TAG)],
      LaunchpadProgram.programId,
    );
  const [projectKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROJECT_TAG), projectMint.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [userKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(USER_TAG), wallet.publicKey.toBuffer(), projectMint.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [treasuryVault] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(TREASURY_VAULT_TAG), projectKey.toBuffer()],
      LaunchpadProgram.programId,
    );
  
  let txHash = await LaunchpadProgram.rpc.pay(
    payableAmount,
    {
      accounts: {
        project: projectKey,
        user: userKey,
        treasuryVault,
        userVault: userSaleTokenAccount,
        authority: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);
  return {
    amount:0,
    success: true,
    txId:txHash,
    hash:""
  }
}

export async function claimTokens(
  connection:Connection,
  wallet: any,
  projectMint: PublicKey
) {
  const [launchpadKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(LAUNCHPAD_TAG)],
      LaunchpadProgram.programId,
    );
  const [projectKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROJECT_TAG), projectMint.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [projectVaultKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(PROJECT_VAULT_TAG), projectKey.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [userKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(USER_TAG), wallet.publicKey.toBuffer(), projectMint.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [userProjectToken] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(USER_PROJECT_TOKEN_TAG), wallet.publicKey.toBuffer()],
      LaunchpadProgram.programId,
    );
  const [stakingUserKey] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [stakingPoolId.toBuffer(), wallet.publicKey.toBuffer()],
      stakingProgramId,
    );
  let txHash = await LaunchpadProgram.rpc.claimProjectToken(
    {
      accounts: {
        launchpad: launchpadKey,
        project: projectKey,
        user: userKey,
        projectVault: projectVaultKey,
        userVault: userProjectToken,
        stakingUser: stakingUserKey,
        authority: wallet.publicKey,
        clock: SYSVAR_CLOCK_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  ).catch((e:any) => {
    console.log("e =", e);
  });
  console.log("txHash =", txHash);
  return {
    amount:0,
    success: true,
    txId:txHash,
    hash:""
  }
}