import {
    Connection,
    PublicKey,
    Transaction,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction
} from '@solana/web3.js'

import {
  LIQUIDITY_POOL_PROGRAM_ID_V5,
  SYSTEM_PROGRAM_ID,
} from '@/utils/ids'
import {
  sendTransaction,
  getAMMGlobalStateAddress
} from '@/utils/web3'

import { struct, u8 } from '@project-serum/borsh'

// @ts-ignore
import { nu64, blob } from 'buffer-layout'
export interface FeeParam{
  curveType: number
  fixedFeeNumerator: number
  returnFeeNumerator: number
  feeDenominator: number
}
const INITIAL_FEE_PARAMS:FeeParam = {
    curveType: 0,
    fixedFeeNumerator: 10,
    returnFeeNumerator: 20,
    feeDenominator: 10000,
}

const INITIAL_SUPPLY = 1000000000
const INITIAL_FEE_OWNER = "DyDdJM9KVsvosfXbcHDp4pRpmbMHkRq3pcarBykPy4ir"

export const updateAMMGlobalStateInstruction = (
    stateAccount: PublicKey,
    curStateOwner:PublicKey,
    newStateOwner: PublicKey,
    feeOwner: PublicKey,
    fee: any,
    intialSupply:number,
    swapProgramId: PublicKey,
): TransactionInstruction => {
    const keys = [
      { pubkey: stateAccount, isSigner: false, isWritable: true },
      { pubkey: curStateOwner, isSigner: true, isWritable: false },
      { pubkey: newStateOwner, isSigner: false, isWritable: false },
      { pubkey: feeOwner, isSigner: false, isWritable: false },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];
  
    const commandDataLayout = struct([
      u8("instruction"),
      nu64("initialSupply"),
      nu64("returnFeeNumerator"),
      nu64("fixedFeeNumerator"),
      nu64('feeDenominator'),
      u8("curveType"),
      blob(32, 'curveParameters'),
    ]);
    let data = Buffer.alloc(1024);
    {
      const encodeLength = commandDataLayout.encode(
        {
          instruction: 6, // InitializeSwap instruction
          initialSupply: intialSupply,
          returnFeeNumerator: fee.returnFeeNumerator,
          fixedFeeNumerator: fee.fixedFeeNumerator,
          feeDenominator: fee.feeDenominator,
          curveType: fee.curveType,
        },
        data
      );
      data = data.slice(0, encodeLength);
    }
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    });
  };
  
export async function initAMMGlobalState(
    conn: Connection,
    wallet: any
  ){
    return updateAMMGlobalState(
      conn,
      wallet, //signer, initial state owner
      wallet.publicKey, // new state owner
      new PublicKey(INITIAL_FEE_OWNER), // initial fee owner
      INITIAL_FEE_PARAMS, // initial fee params 
      INITIAL_SUPPLY, // initial lp token supply
    )
}
  
export async function updateAMMGlobalState(
  conn: Connection,
  wallet: any,
  newStateOwner: PublicKey,
  newFeeOwner: PublicKey,
  feeParams:FeeParam,
  initialSupply:number
){
  const stateId = await getAMMGlobalStateAddress()
  // const state_info = await getGlobalStateAccount(conn);

  let transaction: Transaction = new Transaction()
  console.log("update state account")

  transaction.add(
    updateAMMGlobalStateInstruction(
      stateId,
      wallet.publicKey,
      newStateOwner,
      newFeeOwner,
      feeParams,
      initialSupply,
      new PublicKey(LIQUIDITY_POOL_PROGRAM_ID_V5),
    )
  )
  
  return await sendTransaction(conn, wallet, transaction, [])
}
