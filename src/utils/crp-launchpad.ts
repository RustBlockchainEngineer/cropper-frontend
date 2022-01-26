// @ts-ignore
import * as anchor from '@project-serum/anchor';

// @ts-ignore
import * as serumCmn from "@project-serum/common";

import { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
const { BN, web3, Program, Provider } = anchor
const { PublicKey, SystemProgram, Keypair, Transaction } = web3
const utf8 = anchor.utils.bytes.utf8;

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
import { Account, Connection} from '@solana/web3.js';
import { LAUNCHPAD_PROGRAM_ID } from './ids';
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
  const transaction = new Transaction()
  const signers: Account[] = []

  const [launchpad, launchpadBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('launchpad')],
    LaunchpadProgram.programId
  );

  const treasury = new Keypair()

  transaction.add(
    LaunchpadProgram.instruction.createLaunchpad(launchpadBump, 
    {
      accounts: {
        launchpad,
        authority: wallet.publicKey,
        treasury: treasury.publicKey,
        ...defaultAccounts
      }
    })
  )

  // const stateInfo = await StakingProgram.account.stateAccount.fetch(stateSigner)
  return await sendTransaction(connection, wallet, transaction, signers)
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

export async function updateLaunchpad(
  connection:Connection,
  wallet: any,
) {
  const transaction = new Transaction()
  const signers: Account[] = []

  const launchpadAddress = await getLaunchpadAddress();
  const treasury = new Keypair()

  transaction.add(
    LaunchpadProgram.instruction.createLaunchpad( 
    {
      accounts: {
        launchpad: launchpadAddress,
        authority: wallet.publicKey,
        treasury: treasury.publicKey,
        ...defaultAccounts
      }
    })
  )
  return await sendTransaction(connection, wallet, transaction, signers)

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
      token_price: data.tokenPrice.toString(),
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

function str2time(date:string){
  return new BN(moment(date, 'DD MMMM YYYY').format("X"))
}

function time2str(date: any){
  return moment(new Date(date * 1000)).format('DD MMMM YYYY')
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
  const transaction = new Transaction()
  const signers: Account[] = []

  const launchpadAddress = await getLaunchpadAddress();
  
  const [projectAddress, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('project'), new PublicKey(projectMint).toBuffer() ],
    LaunchpadProgram.programId
  );
  const tmp_max_allocs = max_allocs.map(function(ele){
    return new BN(ele);
  })

  const project = await getProject(projectMint);

  // transaction.add(
  //   LaunchpadProgram.instruction.createProject(
  //     bump,
  //     str2time('01 Feb 2021'),
  //     str2time('02 Feb 2021'),
  //     str2time('03 Feb 2021'),
  //     str2time('04 Feb 2021'),
  //     str2time('05 Feb 2021'),
  //     str2time('06 Feb 2021'),
  //     [new BN(0), new BN(1), new BN(2), new BN(3), new BN(4), new BN(5),],
  //     new BN(100),
  //     new BN(25),
  //     new BN(10),
  //   {
  //     accounts: {
  //       launchpad: launchpadAddress,
  //       project: projectAddress,
  //       authority: wallet.publicKey,
  //       projectMint,
  //       priceTokenMint: new Keypair().publicKey,
  //       ...defaultAccounts
  //     }
  //   })
  // )
  // return await sendTransaction(connection, wallet, transaction, signers)
  
  if(!project){
    transaction.add(
      LaunchpadProgram.instruction.createProject(
        bump,
        str2time(prepareDate),
        str2time(whiltelistStartDate),
        str2time(whiltelistEndDate),
        str2time(saleStartDate),
        str2time(saleEndDate),
        str2time(distributionDate),
        tmp_max_allocs,
        new BN(tokenPrice),
        new BN(poolSize),
        new BN(firstLiberation),
      {
        accounts: {
          launchpad: launchpadAddress,
          project: projectAddress,
          authority: wallet.publicKey,
          projectMint,
          priceTokenMint: new PublicKey(priceTokenMint),
          ...defaultAccounts
        }
      })
    )
  }
  else
  {
    transaction.add(
      LaunchpadProgram.instruction.updateProject(
        
        str2time(prepareDate),
        str2time(whiltelistStartDate),
        str2time(whiltelistEndDate),
        str2time(saleStartDate),
        str2time(saleEndDate),
        str2time(distributionDate),
        
        tmp_max_allocs,
        
        new BN(tokenPrice),
        new BN(poolSize),
        new BN(firstLiberation),

      {
        accounts: {
          launchpad: launchpadAddress,
          project: projectAddress,
          authority: wallet.publicKey,
          priceTokenMint: new PublicKey(priceTokenMint),
          ...defaultAccounts
        }
      })
    )
  }

  return await sendTransaction(connection, wallet, transaction, signers)
}
