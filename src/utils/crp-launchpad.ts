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
import { Account, Connection } from '@solana/web3.js';
import { createSplAccount } from './crp-swap';
import { createAssociatedTokenAccountIfNotExist2, sendTransaction } from './web3';
import { LAUNCHPAD_PROGRAM_ID } from './ids';
import moment from 'moment';
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
  const [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('launchpad')],
    LaunchpadProgram.programId
  );
  return stateSigner
}

async function getExtraRewardAddress(){
  const [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('extra')],
    LaunchpadProgram.programId
  );
  return stateSigner
}

async function getPoolAddressFromMint(mint:string){
  const [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [new PublicKey(mint).toBuffer()],
    LaunchpadProgram.programId
  );
  return stateSigner
}

export async function createLaunchpad(
  connection:Connection,
  wallet: any,
)
{
  const transaction = new Transaction()
  const signers: Account[] = []

  const [launchpad, launchpadBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('launchpad')],
    LaunchpadProgram.programId
  );

  transaction.add(
    LaunchpadProgram.instruction.createLaunchpad(launchpadBump, 
    {
      accounts: {
        launchpad,
        authority: wallet.publicKey,
        ...defaultAccounts
      }
    })
  )

  // const stateInfo = await StakingProgram.account.stateAccount.fetch(stateSigner)
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async function getLaunchpad(){
  const launchpadAddress = await getLaunchpadAddress();
  return await LaunchpadProgram.account.LaunchpadAccount.fetch(launchpadAddress)
}

export async function updateLaunchpad(
  connection:Connection,
  wallet: any,
  prepareDate: any,
  whiltelistStartDate: any,
  whiltelistEndDate: any,
  lotteryWinPct: any,
  saleStartDate: any,
  saleEndDate: any,
  distributionDate: any,
  whitelist: any,
  maxAlloc: any
)
{
  const transaction = new Transaction()
  const signers: Account[] = []

  const launchpadAddress = await getLaunchpadAddress();


  transaction.add(
    LaunchpadProgram.instruction.updateLaunchpad(
      prepareDate,
      whiltelistStartDate,
      whiltelistEndDate,
      lotteryWinPct,
      saleStartDate,
      saleEndDate,
      distributionDate,
      whitelist,
      maxAlloc, 
    {
      accounts: {
        launchpad: launchpadAddress,
        authority: wallet.publicKey,
        ...defaultAccounts
      }
    })
  )

  // const stateInfo = await StakingProgram.account.stateAccount.fetch(stateSigner)
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async function setPreparationDate(
  connection:Connection,
  wallet: any,
  prepareDate: any,
)
{
  const transaction = new Transaction()
  const signers: Account[] = []

  const launchpadAddress = await getLaunchpadAddress();


  transaction.add(
    LaunchpadProgram.instruction.setPreparationDate(
      prepareDate,
    {
      accounts: {
        launchpad: launchpadAddress,
        authority: wallet.publicKey,
        ...defaultAccounts
      }
    })
  )

  // const stateInfo = await StakingProgram.account.stateAccount.fetch(stateSigner)
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async function setWhitelistStartDate(
  connection:Connection,
  wallet: any,
  date: any,
)
{
  const transaction = new Transaction()
  const signers: Account[] = []

  const launchpadAddress = await getLaunchpadAddress();


  transaction.add(
    LaunchpadProgram.instruction.setWhitelistStartDate(
      date,
    {
      accounts: {
        launchpad: launchpadAddress,
        authority: wallet.publicKey,
        ...defaultAccounts
      }
    })
  )

  // const stateInfo = await StakingProgram.account.stateAccount.fetch(stateSigner)
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async function setWhitelistEndDate(
  connection:Connection,
  wallet: any,
  date: any,
)
{
  const transaction = new Transaction()
  const signers: Account[] = []

  const launchpadAddress = await getLaunchpadAddress();


  transaction.add(
    LaunchpadProgram.instruction.setWhitelistEndDate(
      date,
    {
      accounts: {
        launchpad: launchpadAddress,
        authority: wallet.publicKey,
        ...defaultAccounts
      }
    })
  )

  // const stateInfo = await StakingProgram.account.stateAccount.fetch(stateSigner)
  return await sendTransaction(connection, wallet, transaction, signers)
}
