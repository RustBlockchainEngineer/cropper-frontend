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
  const transaction = new Transaction()
  const signers: Account[] = []

  const launchpadAddress = await getLaunchpadAddress();
  
  const [projectAddress, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('project'), new PublicKey(projectMint).toBuffer() ],
    LaunchpadProgram.programId
  );


  const project = await getProject(projectMint);
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

  if(!project){
    transaction.add(
      LaunchpadProgram.instruction.createProject(
        bump,
        ...paramFormatted,
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
        ...paramFormatted,
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
export async function subscribeToWhitelist(  
  connection: Connection,
  wallet: any,
) {
  /*
        @Hongbo => 
        here, we wait for the registering function in smart contract, 
        when the contract return the transaction ID, we'll use it in the request to also check transaction + register user in database
        SO this return should give us 2 datas if possible : 
          - txID
          - also, if it's possible for you to make a simple function (smart contract side) to return the current tier of the user sha encrypted on this base (spl == user wallet ID) :

              case crypto.createHash('sha256').update(result.spl + 'teisr0').digest('hex'):
                tier = 0;
              break;
              case crypto.createHash('sha256').update(result.spl + 'teicozksr1').digest('hex'):
                tier = 1;
              break;
              case crypto.createHash('sha256').update(result.spl + 'txxzeisr2').digest('hex'):
                tier = 2;
              break;
              case crypto.createHash('sha256').update(result.spl + 'teisrer3').digest('hex'):
                tier = 3;
              break;
              case crypto.createHash('sha256').update(result.spl + 'teiscer4').digest('hex'):
                tier = 4;
              break;
              case crypto.createHash('sha256').update(result.spl + 'teccisr5').digest('hex'):
                tier = 5;
              break;
      */

  // todo: LaunchpadProgram.rpc.registerUser
  for(let i = 0; i < 100000000; i++);
  console.log("subscribe");
  let txId = "3woKNB9ubF3VdamWN6b1m4AnTrfVY9BEDe27PLm3nWcvAT4qnLsZ53LhoTitPxdJj9MkhNdYuNDyaddPDBUnQ2mc";
  let hash = "58eda2485e96378dca8f5d8044161e6a567614bb6a24626c92df13277fdc2d72";
  let no_error = 1;
  if (no_error) return {success: true, txId, hash};
  return {success: false};
}

export async function buyTokens(  
  connection: Connection,
  wallet: any,
  amount: number
) {
  for(let i = 0; i < 100000000; i++);
  console.log("pay");
  // todo: pay
  let no_error = 1;
  if (no_error) return { success: true };
  return { success: false };
}

export async function claimTokens(  
  connection: Connection,
  wallet: any
) {
  for(let i = 0; i < 100000000; i++);
  console.log("pay");
  // todo: pay
  let amount = 1000;
  let no_error = 1;
  if (no_error) return { success: true, amount };
  return { success: false };
}
