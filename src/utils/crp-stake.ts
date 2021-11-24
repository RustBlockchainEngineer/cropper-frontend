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
}

import waggle_farm_idl from '@/utils/waggle_farm.json'
import { Account, Connection } from '@solana/web3.js';
import { createSplAccount } from './crp-swap';
import { createAssociatedTokenAccountIfNotExist2, sendTransaction } from './web3';
import { STAKE_TIERS_PROGRAM_ID } from './ids';
let WaggleFarm:any = null
// import ido_idl from '@/utils/waggle_ido_sol.json'
// const idoProgramId = new anchor.web3.PublicKey("2epB32Fz3TFgibUqPFFN61U1MFXmU5f3CyHyvBZCoh4b");
// let idoCRP = new anchor.Program(ido_idl, idoProgramId);


export function setAnchorProvider(
  connection: Connection,
  wallet: any,
) {
  if (!wallet.publicKey) return null;

  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions(),
  );
  // Generate the program client from IDL.
  const program = new (anchor as any).Program(waggle_farm_idl, new PublicKey(STAKE_TIERS_PROGRAM_ID), provider);
  WaggleFarm = program

  return program;
}


export interface ExtraRewardConfigs{
  duration: any
  extraPercentage: any
}

async function getFarmStateAddress(){
  const [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('state')],
    WaggleFarm.programId
  );
  return stateSigner
}

async function getExtraRewardAddress(){
  const [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('extra')],
    WaggleFarm.programId
  );
  return stateSigner
}

async function getPoolAddressFromMint(mint:string){
  const [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [new PublicKey(mint).toBuffer()],
    WaggleFarm.programId
  );
  return stateSigner
}


export async function createFarmState(
  connection:Connection,
  wallet: any,
  tokenPerSecond: number,
  rewardMint: string,
)
{
  const transaction = new Transaction()
  const signers: Account[] = []

  const [stateSigner, stateBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('state')],
    WaggleFarm.programId
  );

  const stateRewardVault = await createAssociatedTokenAccountIfNotExist2(
    null,
    stateSigner,
    wallet.publicKey,
    rewardMint,
    transaction
  )

  transaction.add(
    WaggleFarm.instruction.createState(stateBump, new BN(tokenPerSecond), {
      accounts: {
        state: stateSigner,
        rewardMint: rewardMint,
        rewardVault: stateRewardVault,
        authority: wallet.publicKey,
        ...defaultAccounts
      }
    })
  )

  // const stateInfo = await WaggleFarm.account.stateAccount.fetch(stateSigner)
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async function getFarmState(){
  const stateSigner = await getFarmStateAddress();
  return await WaggleFarm.account.stateAccount.fetch(stateSigner)
}

export async function getExtraRewardConfigs(){
  const [extraRewardSigner, extraRewardBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('extra')],
    WaggleFarm.programId
  );
  const extraRewardConfigs = await WaggleFarm.account.extraRewardsAccount.fetch(extraRewardSigner)
  // assert.ok(extraRewardConfigs.configs.length === 3)
  // assert.ok(new BN(1).eq(extraRewardConfigs.configs[1].duration))
  // assert.ok(getNumber(50).eq(extraRewardConfigs.configs[1].extraPercentage))
  return extraRewardConfigs
}


export async function createExtraReward(
  connection:Connection,
  wallet: any,
){
  const transaction = new Transaction()
  const signers: Account[] = []

  const [extraRewardSigner, extraRewardBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('extra')],
    WaggleFarm.programId
  );
  console.log(extraRewardSigner.toString(), extraRewardBump)
  /*const tx = WaggleFarm.instruction.createExtraRewardConfigs(extraRewardBump, 
      [{ duration: new BN(0), extraPercentage: new BN(0) }],
      {
        accounts: {
          extraRewardAccount: extraRewardSigner,
          authority: wallet.publicKey,
          ...defaultAccounts
        },
      })*/
  // transaction.add(tx)
  // return await sendTransaction(connection, wallet, transaction, signers)
  //5ddHqcSm4KtAAgSEY2sEEH4BhvGC7cpiRi62qotB
  await WaggleFarm.rpc.createExtraRewardConfigs(extraRewardBump, [
      { duration: new BN(0), extraPercentage: new BN(0) },
    ], {
      accounts: {
        extraRewardAccount: extraRewardSigner,
        authority: wallet.publicKey,
        ...defaultAccounts
      },
    })
}

export async function setExtraReward(
  connection:Connection,
  wallet: any,
  extraRewards: ExtraRewardConfigs[],
)
{

  const transaction = new Transaction()
  const signers: Account[] = []

  const [extraRewardSigner, extraRewardBump] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('extra')],
    WaggleFarm.programId
  );

  transaction.add(WaggleFarm.instruction.setExtraRewardConfigs(extraRewards, {
    accounts: {
      extraRewardAccount: extraRewardSigner,
      authority: wallet.publicKey,
      ...defaultAccounts
    },
  }))
  return await sendTransaction(connection, wallet, transaction, signers)

}

export async function getAllPools(){
  const pools = await WaggleFarm.account.farmPoolAccount.all()
  return pools
}

export async function createPool(
  connection:Connection,
  wallet: any,
  rewardMint: string,
  pools: any[]
) {

  const transaction = new Transaction()
  const signers: Account[] = []
  

  const [poolSigner, poolBump] = await anchor.web3.PublicKey.findProgramAddress(
    [new PublicKey(rewardMint).toBuffer()],
    WaggleFarm.programId
  );
  const stateSigner = await getFarmStateAddress()

  const poolVault = await createAssociatedTokenAccountIfNotExist2(
    null, 
    poolSigner, 
    wallet.publicKey,  
    rewardMint, 
    transaction)


  // let pools = await WaggleFarm.account.farmPoolAccount.all()
  transaction.add(
    WaggleFarm.instruction.createPool(poolBump, new BN('0'), new BN('0'), {
      accounts: {
        pool: poolSigner,
        state: stateSigner,
        mint: rewardMint,
        vault: poolVault,
        authority: wallet.publicKey,
        ...defaultAccounts
      },
      remainingAccounts: pools.map(p => ({
        pubkey: p.publicKey,
        isWritable: true,
        isSigner: false
      }))
    })
  )
  // let stateInfo = await program.account.stateAccount.fetch(stateSigner)
  // let poolInfo = await program.account.farmPoolAccount.fetch(poolSigner)
  // assert.ok(poolInfo.point.eq(stateInfo.totalPoint))
  // assert.ok(poolInfo.point.eq(new BN('0')))
  // assert.ok(poolInfo.amountMultipler.eq(new BN(0)))
  return await sendTransaction(connection, wallet, transaction, signers)
}
export async function closePool(
  connection:Connection,
  wallet: any,
  poolSigner:string,
  pools:any[]
){
  const transaction = new Transaction()
  const signers: Account[] = []

  const stateSigner = await getFarmStateAddress()
  
  WaggleFarm.instruction.closePool({
    accounts: {
      pool: new PublicKey(poolSigner),
      state: stateSigner,
      authority: wallet,
      ...defaultAccounts
    },
    remainingAccounts: pools.map(p => ({
      pubkey: p.publicKey,
      isWritable: true,
      isSigner: false
    }))
  })
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async function changePoolAmountMultipler(
  connection:Connection,
  wallet: any,
  poolSigner:string,
) {
  
  const transaction = new Transaction()
  const signers: Account[] = []

  const stateSigner = await getFarmStateAddress()

  WaggleFarm.instruction.changePoolAmountMultipler(new BN(1), {
    accounts: {
      pool: new PublicKey(poolSigner),
      state: stateSigner,
      authority: wallet,
      ...defaultAccounts
    }
  })
  // let poolInfo = await program.account.farmPoolAccount.fetch(poolSigner)
  // assert.ok(poolInfo.amountMultipler.eq(new BN(1)))
  return await sendTransaction(connection, wallet, transaction, signers)
}
export async function changeTokenPerSecond(
  connection:Connection,
  wallet: any,
  pools:any[]
){
  const transaction = new Transaction()
  const signers: Account[] = []

  const stateSigner = await getFarmStateAddress()

  WaggleFarm.instruction.changeTokensPerSecond(new BN(40), {
    accounts: {
      state: stateSigner,
      authority: wallet,
      ...defaultAccounts
    },
    remainingAccounts: pools.map(p => ({
      pubkey: p.publicKey,
      isWritable: true,
      isSigner: false
    }))
  })

  return await sendTransaction(connection, wallet, transaction, signers)
}
export async function changePoolPoint(
  connection:Connection,
  wallet: any,
  poolSigner: string,
) {

  const transaction = new Transaction()
  const signers: Account[] = []
  
  const stateSigner = await getFarmStateAddress()

  let pools = await getAllPools()
  
  WaggleFarm.instruction.changePoolPoint(new BN(1000), {
    accounts: {
      pool: new PublicKey(poolSigner),
      state: stateSigner,
      authority: wallet,
      ...defaultAccounts
    },
    remainingAccounts: pools.map((p : any) => ({
      pubkey: p.publicKey,
      isWritable: true,
      isSigner: false
    }))
  })
  // let stateInfo = await WaggleFarmaccount.stateAccount.fetch(stateSigner)
  // let poolInfo = await WaggleFarmaccount.farmPoolAccount.fetch(poolSigner)
  // assert.ok(poolInfo.point.eq(stateInfo.totalPoint))
  // assert.ok(poolInfo.point.eq(new BN(1000)))
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async  function  fundToProgram(
  connection:Connection,
  wallet: any,
  poolSigner: string,
  masterRewardVault:string,
  amount:any
) {

  const transaction = new Transaction()
  const signers: Account[] = []

  const stateSigner = await getFarmStateAddress()
  const state = await getFarmState()
  // await rewardMint.mintTo(stateRewardVault, wallet, [provider.wallet], getNumber(10000).toString())
  const tx = WaggleFarm.instruction.fundRewardToken(new BN(amount), {
    accounts: {
      pool: poolSigner,
      state: stateSigner,
      rewardVault: state.rewardVault,
      userVault: masterRewardVault,
      authority: wallet.publicKey,
      ...defaultAccounts
    }
  })
  transaction.add(tx)
  return await sendTransaction(connection, wallet, transaction, signers)

}

export async function getPoolUserAccount(
  wallet: any,
  poolSigner: any,
){
  
  const [poolUserAccount, bump1] = await PublicKey.findProgramAddress([
    poolSigner.toBuffer(), wallet.publicKey.toBuffer()
  ], WaggleFarm.programId)
  return await WaggleFarm.account.poolUserAccount.fetch(poolUserAccount)
}

export async function stake (
  connection:Connection,
  wallet: any,
  rewardMint: string,
  poolVault: string,
  rewardUserVault: string,
  amount:any, 
  lock = 0
) {

  const transaction = new Transaction()
  const signers: Account[] = []

  const stateSigner = await getFarmStateAddress()
  const extraRewardSigner = await getExtraRewardAddress()
  const poolSigner = await getPoolAddressFromMint(rewardMint)

  const [poolUserAccount, bump1] = await PublicKey.findProgramAddress([
    poolSigner.toBuffer(), wallet.publicKey.toBuffer()
  ], WaggleFarm.programId)


  const tx = WaggleFarm.instruction.stake(new BN(amount), new BN(lock), {
    accounts: {
      mint: rewardMint,
      extraRewardAccount: extraRewardSigner,
      poolVault: poolVault,
      userVault: rewardUserVault,
      user: poolUserAccount,
      state: stateSigner,
      pool: poolSigner,
      authority: wallet.publicKey,
      ...defaultAccounts
    }
  });
  transaction.add(tx)
  return await sendTransaction(connection, wallet, transaction, signers)
}

export async function unstake (
  connection:Connection,
  wallet: any,
  rewardMint: string,
  poolVault: string,
  rewardUserVault:string,
  amount: number
) {

  const transaction = new Transaction()
  const signers: Account[] = []
  
  const stateSigner = await getFarmStateAddress()
  const extraRewardSigner = await getExtraRewardAddress()
  const poolSigner = await getPoolAddressFromMint(rewardMint)

  const [poolUserAccount, bump1] = await PublicKey.findProgramAddress([
    poolSigner.toBuffer(), wallet.publicKey.toBuffer()
  ], WaggleFarm.programId)


  const ix = WaggleFarm.instruction.unstake(amount, {
    accounts: {
      mint: rewardMint,
      extraRewardAccount: extraRewardSigner,
      poolVault: poolVault,
      userVault: rewardUserVault,
      user: poolUserAccount,
      state: stateSigner,
      pool: poolSigner,
      authority: wallet.publicKey,
      ...defaultAccounts
    }
  });
  transaction.add(ix)
  // const hash = await u.provider.send(tx, [], { commitment: 'confirmed' });
  // return await cccc.getTransaction(hash)
  return await sendTransaction(connection, wallet, transaction, signers)

}

export async function harvest (
  connection:Connection,
  wallet: any,
  rewardMint: string,
  rewardUserVault: string,
  stateRewardVault: string
) {

  const transaction = new Transaction()
  const signers: Account[] = []

  const stateSigner = await getFarmStateAddress()
  const extraRewardSigner = await getExtraRewardAddress()
  const poolSigner = await getPoolAddressFromMint(rewardMint)

  const [poolUserAccount, bump1] = await PublicKey.findProgramAddress([
    poolSigner.toBuffer(), wallet.publicKey.toBuffer()
  ], WaggleFarm.programId)



  const tx = WaggleFarm.instruction.harvest({
    accounts: {
      mint: rewardMint,
      extraRewardAccount: extraRewardSigner,
      rewardVault: stateRewardVault,
      userVault: rewardUserVault,
      user: poolUserAccount,
      state: stateSigner,
      pool: poolSigner,
      authority: wallet.publicKey,
      ...defaultAccounts
    }
  });
  // const hash = await u.provider.send(tx, [], { commitment: 'confirmed' });
  // return await cccc.getTransaction(hash)
  return await sendTransaction(connection, wallet, transaction, signers)
}
