import * as anchor from '@project-serum/anchor'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { AnchorFarm } from '@/utils/farm-v3-types'
import FarmIdl from '@/utils/farm-v3-idl.json'
import {
  CLOCK_PROGRAM_ID,
  CRP_LP_PROGRAM_ID_V1,
  FARM_INITIAL_FEE_OWNER,
  FARM_PROGRAM_ID,
  RENT_PROGRAM_ID,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from './ids'

const GLOBAL_STATE_TAG = 'golbal-state-seed'
const FARM_TAG = 'farm-seed'
const USER_INFO_TAG = 'user-info-seed'
const FARM_POOL_LP_TAG = 'farm-pool-lp-seed'
const FARM_POOL_REWARD_TAG = 'farm-pool-reward-seed'
const DUAL_POOL_REWARD_TAG = 'dual-pool-reward-seed'
const DUAL_TAG = 'farm-dual'

const HARVEST_FEE_NUMERATOR = 1
const HARVEST_FEE_DENOMINATOR = 1000

// This command makes an Lottery
export function getFarmProgramV3(connection: anchor.web3.Connection, wallet: any, farmProgramId = FARM_PROGRAM_ID) {
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions())
  return new anchor.Program(FarmIdl as any, new anchor.web3.PublicKey(farmProgramId), provider) as anchor.Program<AnchorFarm>
}
export async function getFilteredFarms(connection: anchor.web3.Connection, wallet: any, filters:any = undefined) {
  const program = getFarmProgramV3(connection, wallet);
  const result = await program.account.farmPool.all(filters);
  return result;
}
export async function getFilteredUserInfos(connection: anchor.web3.Connection, wallet: any, filters:any = undefined) {
  const program = getFarmProgramV3(connection, wallet);
  const result = await program.account.userInfo.all(filters);
  return result;
}

export async function getGlobalStateV3(
  connection: anchor.web3.Connection,
  wallet: any
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const globalState = await program.account.farmProgram.fetchNullable(globalStateKey);
  return globalState;
}

export async function setGlobalStateV3(
  connection: anchor.web3.Connection,
  wallet: any,
  newSuperOwner: anchor.web3.PublicKey = wallet.publicKey,
  feeOwner: string = FARM_INITIAL_FEE_OWNER,
  allowedCreator: anchor.web3.PublicKey = wallet.publicKey,
  ammProgramId: anchor.web3.PublicKey = new anchor.web3.PublicKey(CRP_LP_PROGRAM_ID_V1),
  _farmFee: number = 0,
  harvestFeeNumerator: number = HARVEST_FEE_NUMERATOR,
  harvestFeeDenominator: number = HARVEST_FEE_DENOMINATOR
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const tx = await program.rpc.createGlobalState(
    globalStateKeyNonce,
    new anchor.BN(harvestFeeNumerator),
    new anchor.BN(harvestFeeDenominator),
    {
      accounts: {
        superOwner: wallet.publicKey,
        globalState: globalStateKey,
        newSuperOwner: newSuperOwner,
        feeOwner: new anchor.web3.PublicKey(feeOwner),
        allowedCreator: allowedCreator,
        ammProgramId: ammProgramId,
        systemProgram: SYSTEM_PROGRAM_ID,
        rent: RENT_PROGRAM_ID
      }
    }
  )
  console.log('setGlobalState txid = ', tx)
}

export async function createFarmV3(
  connection: anchor.web3.Connection,
  wallet: any,
  rewardMintPubkey: anchor.web3.PublicKey,
  lpMintPubkey: anchor.web3.PublicKey,
  ammPubkey: anchor.web3.PublicKey,
  startTimestamp: number,
  endTimestamp: number
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const newFarmSeed = anchor.web3.Keypair.generate()
  let [farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), newFarmSeed.publicKey.toBuffer()],
    program.programId
  )
  const [farmPoolLpKey, farmPoolLpKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_LP_TAG), farmKey.toBuffer()],
    program.programId
  )
  const [farmPoolRewardKey, farmPoolRewardKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_REWARD_TAG), farmKey.toBuffer()],
    program.programId
  )

  const tx = await program.rpc.createFarm(
    globalStateKeyNonce,
    farmKeyNonce,
    farmPoolLpKeyNonce,
    farmPoolRewardKeyNonce,
    new anchor.BN(startTimestamp),
    new anchor.BN(endTimestamp),
    {
      accounts: {
        creator: wallet.publicKey,
        globalState: globalStateKey,
        newFarm: farmKey,
        farmSeed: newFarmSeed.publicKey,
        poolLpMint: lpMintPubkey,
        poolRewardMint: rewardMintPubkey,
        poolLpToken: farmPoolLpKey,
        poolRewardToken: farmPoolRewardKey,
        ammSwap: ammPubkey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID
      }
    }
  )
  console.log('createFarmV3 txid = ', tx)
  const createdFarm = await program.account.farmPool.fetchNullable(farmKey)
  return {createdFarm, farmKey}
}

export async function extendSingleFarmDurationV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  newEndTime: number
) {
  const program = getFarmProgramV3(connection, wallet)
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const tx = await program.rpc.extendFarm(farmKeyNonce, new anchor.BN(newEndTime), {
    accounts: {
      creator: wallet.publicKey,
      farm: farmKey,
      farmSeed: oldFarm.seedKey
    }
  })
  console.log('extendSingleFarmDuration txid = ', tx)
}

export async function addDualYieldV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  dualRewardTokenMint: anchor.web3.PublicKey,
  startTimestamp: number,
  endTimestamp: number
) {
  const program = getFarmProgramV3(connection, wallet)
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const [farmPoolRewardDualKey, farmPoolRewardDualKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(DUAL_POOL_REWARD_TAG), farmKey.toBuffer()],
    program.programId
  )
  const tx = await program.rpc.createDual(
    globalStateKeyNonce,
    farmKeyNonce,
    farmPoolRewardDualKeyNonce,
    new anchor.BN(startTimestamp),
    new anchor.BN(endTimestamp),
    {
      accounts: {
        creator: wallet.publicKey,
        globalState: globalStateKey,
        farm: farmKey,
        farmSeed: oldFarm.seedKey,
        poolRewardMintDual: dualRewardTokenMint,
        poolRewardTokenDual: farmPoolRewardDualKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID
      }
    }
  )
  console.log('addDualYieldV3 txid = ', tx)
}

export async function extendDualYieldDurationV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  newEndTime: number
) {
  const program = getFarmProgramV3(connection, wallet)
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const tx = await program.rpc.extendDual(farmKeyNonce, new anchor.BN(newEndTime), {
    accounts: {
      creator: wallet.publicKey,
      farm: farmKey,
      farmSeed: oldFarm.seedKey
    }
  })
  console.log('extendDualYieldDurationV3 txid = ', tx)
}

export async function addSingleRewardV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  userRewardTokenAccount: anchor.web3.PublicKey,
  amount: number
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const [farmPoolLpKey, farmPoolLpKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_LP_TAG), farmKey.toBuffer()],
    program.programId
  )
  const [farmPoolRewardKey, farmPoolRewardKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_REWARD_TAG), farmKey.toBuffer()],
    program.programId
  )
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const tx = await program.rpc.addRewardSingle(
    globalStateKeyNonce,
    farmKeyNonce,
    farmPoolLpKeyNonce,
    farmPoolRewardKeyNonce,
    new anchor.BN(amount),
    {
      accounts: {
        depositor: wallet.publicKey,
        globalState: globalStateKey,
        farm: farmKey,
        farmSeed: oldFarm.seedKey,
        poolLpToken: farmPoolLpKey,
        poolRewardToken: farmPoolRewardKey,
        userRewardToken: userRewardTokenAccount,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID,
        clock: CLOCK_PROGRAM_ID
      }
    }
  )
  console.log('addSingleRewardV3 txid = ', tx)
}

export async function createFarmAndAddRewardV3(
  connection: anchor.web3.Connection,
  wallet: any,
  rewardMintPubkey: anchor.web3.PublicKey,
  lpMintPubkey: anchor.web3.PublicKey,
  ammPubkey: anchor.web3.PublicKey,
  startTimestamp: number,
  endTimestamp: number,
  userRewardTokenAccount: anchor.web3.PublicKey,
  amount: number
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const newFarmSeed = anchor.web3.Keypair.generate()
  let [farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), newFarmSeed.publicKey.toBuffer()],
    program.programId
  )
  const [farmPoolLpKey, farmPoolLpKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_LP_TAG), farmKey.toBuffer()],
    program.programId
  )
  const [farmPoolRewardKey, farmPoolRewardKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_REWARD_TAG), farmKey.toBuffer()],
    program.programId
  )

  const createInstruction = await program.instruction.createFarm(
    globalStateKeyNonce,
    farmKeyNonce,
    farmPoolLpKeyNonce,
    farmPoolRewardKeyNonce,
    new anchor.BN(startTimestamp),
    new anchor.BN(endTimestamp),
    {
      accounts: {
        creator: wallet.publicKey,
        globalState: globalStateKey,
        newFarm: farmKey,
        farmSeed: newFarmSeed.publicKey,
        poolLpMint: lpMintPubkey,
        poolRewardMint: rewardMintPubkey,
        poolLpToken: farmPoolLpKey,
        poolRewardToken: farmPoolRewardKey,
        ammSwap: ammPubkey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID
      }
    }
  )
  const instructions = []
  instructions.push(createInstruction)

  const tx = await program.rpc.addRewardSingle(
    globalStateKeyNonce,
    farmKeyNonce,
    farmPoolLpKeyNonce,
    farmPoolRewardKeyNonce,
    new anchor.BN(amount),
    {
      accounts: {
        depositor: wallet.publicKey,
        globalState: globalStateKey,
        farm: farmKey,
        farmSeed: newFarmSeed.publicKey,
        poolLpToken: farmPoolLpKey,
        poolRewardToken: farmPoolRewardKey,
        userRewardToken: userRewardTokenAccount,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID,
        clock: CLOCK_PROGRAM_ID
      },
      instructions
    }
  )
  console.log('createFarmAndAddRewardV3 txid = ', tx)
}

export async function addDualRewardV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  userRewardTokenAccount: anchor.web3.PublicKey,
  amount: number
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const [farmPoolLpKey, farmPoolLpKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_LP_TAG), farmKey.toBuffer()],
    program.programId
  )
  const [farmPoolRewardKey, farmPoolRewardKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_REWARD_TAG), farmKey.toBuffer()],
    program.programId
  )
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const tx = await program.rpc.addRewardDual(
    globalStateKeyNonce,
    farmKeyNonce,
    farmPoolLpKeyNonce,
    farmPoolRewardKeyNonce,
    new anchor.BN(amount),
    {
      accounts: {
        depositor: wallet.publicKey,
        globalState: globalStateKey,
        farm: farmKey,
        farmSeed: oldFarm.seedKey,
        poolLpToken: farmPoolLpKey,
        poolRewardTokenDual: farmPoolRewardKey,
        userRewardTokenDual: userRewardTokenAccount,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID,
        clock: CLOCK_PROGRAM_ID
      }
    }
  )
  console.log('addDualRewardV3 txid = ', tx)
}

export async function removeDualRewardV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  userRewardTokenAccount: anchor.web3.PublicKey,
  amount: number
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const [farmPoolLpKey, farmPoolLpKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_LP_TAG), farmKey.toBuffer()],
    program.programId
  )
  const [farmPoolRewardKey, farmPoolRewardKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_REWARD_TAG), farmKey.toBuffer()],
    program.programId
  )
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const tx = await program.rpc.removeRewardDual(
    globalStateKeyNonce,
    farmKeyNonce,
    farmPoolLpKeyNonce,
    farmPoolRewardKeyNonce,
    new anchor.BN(amount),
    {
      accounts: {
        depositor: wallet.publicKey,
        globalState: globalStateKey,
        farm: farmKey,
        farmSeed: oldFarm.seedKey,
        poolLpToken: farmPoolLpKey,
        poolRewardTokenDual: farmPoolRewardKey,
        userRewardTokenDual: userRewardTokenAccount,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID,
        clock: CLOCK_PROGRAM_ID
      }
    }
  )
  console.log('removeDualRewardV3 txid = ', tx)
}

export async function depositLPV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  userLpTokenAccount: anchor.web3.PublicKey,
  amount: number,
  withSwapAction: boolean = false,
  swapInstructions = [],
  swapSigners = []
) {
  
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const [farmPoolLpKey, farmPoolLpKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_LP_TAG), farmKey.toBuffer()],
    program.programId
  )
  const [userInfoKey, userInfoKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(USER_INFO_TAG), farmKey.toBuffer(), wallet.publicKey.toBuffer()],
    program.programId
  )
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  if(withSwapAction){
    const tx = await program.rpc.deposit(
      globalStateKeyNonce,
      farmKeyNonce,
      farmPoolLpKeyNonce,
      userInfoKeyNonce,
      withSwapAction ? 1 : 0,
      new anchor.BN(amount),
      {
        accounts: {
          depositor: wallet.publicKey,
          globalState: globalStateKey,
          farm: farmKey,
          farmSeed: oldFarm.seedKey,
          userInfo: userInfoKey,
          poolLpToken: farmPoolLpKey,
          userLpToken: userLpTokenAccount,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID
        },
        instructions: swapInstructions,
        signers: swapSigners,
      }
    )
    console.log('depositLPV3 txid = ', tx)
  }
  else{
    const tx = await program.rpc.deposit(
      globalStateKeyNonce,
      farmKeyNonce,
      farmPoolLpKeyNonce,
      userInfoKeyNonce,
      withSwapAction ? 1 : 0,
      new anchor.BN(amount),
      {
        accounts: {
          depositor: wallet.publicKey,
          globalState: globalStateKey,
          farm: farmKey,
          farmSeed: oldFarm.seedKey,
          userInfo: userInfoKey,
          poolLpToken: farmPoolLpKey,
          userLpToken: userLpTokenAccount,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID
        }
      }
    )
    console.log('depositLPV3 txid = ', tx)
  }
}

export async function withdrawLPV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  userLp: string | undefined | null,
  amount: number,
  withSwapAction: boolean = false,
): Promise<any> {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const [farmPoolLpKey, farmPoolLpKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_POOL_LP_TAG), farmKey.toBuffer()],
    program.programId
  )
  const [userInfoKey, userInfoKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(USER_INFO_TAG), farmKey.toBuffer(), wallet.publicKey.toBuffer()],
    program.programId
  )
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const signers = []
  const instructions = []
  let userLpTokenAccount: any = null;
  if (userLp === null || userLp === undefined) {
    const newUserTokenAccount = anchor.web3.Keypair.generate()
    signers.push(newUserTokenAccount)
    userLpTokenAccount = newUserTokenAccount.publicKey
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        oldFarm.poolMintAddress,
        userLpTokenAccount,
        wallet.publicKey,
        wallet.publicKey
      )
    )
  }
  else {
    userLpTokenAccount = new anchor.web3.PublicKey(userLp);
  }

  if(withSwapAction){
    const withdrawLpInstruction = await program.instruction.withdraw(
      globalStateKeyNonce,
      farmKeyNonce,
      farmPoolLpKeyNonce,
      userInfoKeyNonce,
      withSwapAction ? 1 : 0,
      new anchor.BN(amount),
      {
        accounts: {
          withdrawer: wallet.publicKey,
          globalState: globalStateKey,
          farm: farmKey,
          farmSeed: oldFarm.seedKey,
          userInfo: userInfoKey,
          poolLpToken: farmPoolLpKey,
          userLpToken: userLpTokenAccount,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID
        },
      }
    )
    instructions.push(withdrawLpInstruction);
    return {farmInstructions: instructions, farmSigners: signers, userLpTokenAccount: userLpTokenAccount.toBase58() as string};
  }
  else{

    const tx = await program.rpc.withdraw(
      globalStateKeyNonce,
      farmKeyNonce,
      farmPoolLpKeyNonce,
      userInfoKeyNonce,
      withSwapAction ? 1 : 0,
      new anchor.BN(amount),
      {
        accounts: {
          withdrawer: wallet.publicKey,
          globalState: globalStateKey,
          farm: farmKey,
          farmSeed: oldFarm.seedKey,
          userInfo: userInfoKey,
          poolLpToken: farmPoolLpKey,
          userLpToken: userLpTokenAccount,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_PROGRAM_ID,
          clock: CLOCK_PROGRAM_ID
        },
        instructions,
        signers
      }
    )
    console.log('withdrawLPV3 txid = ', tx)
  }
  
}

export async function harvestV3(
  connection: anchor.web3.Connection,
  wallet: any,
  farmKey: anchor.web3.PublicKey,
  userRewardTokenAccount: anchor.web3.PublicKey | null,
  isDual: boolean = false
) {
  const program = getFarmProgramV3(connection, wallet)
  let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  )
  const [userInfoKey, userInfoKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(USER_INFO_TAG), farmKey.toBuffer(), wallet.publicKey.toBuffer()],
    program.programId
  )
  const [farmPoolRewardKey] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(isDual ? DUAL_POOL_REWARD_TAG : FARM_POOL_REWARD_TAG), farmKey.toBuffer()],
    program.programId
  )
  const globalState = await program.account.farmProgram.fetch(globalStateKey)
  const oldFarm = await program.account.farmPool.fetch(farmKey)
  let [_farmKey, farmKeyNonce] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(FARM_TAG), oldFarm.seedKey.toBuffer()],
    program.programId
  )
  const rewardTokenMint = isDual ? oldFarm.rewardMintAddressDual : oldFarm.rewardMintAddress
  const signers = []
  const instructions = []
  if (userRewardTokenAccount == null) {
    const newUserTokenAccount = anchor.web3.Keypair.generate()
    signers.push(newUserTokenAccount)
    userRewardTokenAccount = newUserTokenAccount.publicKey
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        rewardTokenMint,
        userRewardTokenAccount,
        globalState.feeOwner,
        wallet.publicKey
      )
    )
  }
  let rewardATA = await checkWalletATA(
    connection,
    globalState.feeOwner,
    rewardTokenMint.toBase58()
  )

  if (rewardATA == null) {
    const newFeeTokenAccount = anchor.web3.Keypair.generate()
    signers.push(newFeeTokenAccount)
    rewardATA = newFeeTokenAccount.publicKey
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        rewardTokenMint,
        rewardATA,
        globalState.feeOwner,
        wallet.publicKey
      )
    )
  }
  if (userRewardTokenAccount && rewardATA) {
    const tx = await program.rpc.harvest(globalStateKeyNonce, farmKeyNonce, userInfoKeyNonce, isDual ? 1 : 0, {
      accounts: {
        harvester: wallet.publicKey,
        globalState: globalStateKey,
        farm: farmKey,
        farmSeed: oldFarm.seedKey,
        userInfo: userInfoKey,
        poolRewardToken: farmPoolRewardKey,
        userRewardToken: userRewardTokenAccount,
        feeRewardToken: rewardATA,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_PROGRAM_ID,
        clock: CLOCK_PROGRAM_ID
      },
      instructions,
      signers
    })
    console.log('harvestV3 txid = ', tx)
  }
}

export async function checkWalletATA(
  connection: anchor.web3.Connection,
  walletPubkey: anchor.web3.PublicKey,
  mint: string
) {
  let parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    walletPubkey,
    {
      programId: TOKEN_PROGRAM_ID
    },
    'confirmed'
  )
  let result: any = null
  parsedTokenAccounts.value.forEach(async (tokenAccountInfo) => {
    const tokenAccountPubkey = tokenAccountInfo.pubkey
    const parsedInfo = tokenAccountInfo.account.data.parsed.info
    const mintAddress = parsedInfo.mint
    if (mintAddress === mint) {
      result = tokenAccountPubkey
    }
  })
  return result
}
