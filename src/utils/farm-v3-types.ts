export type AnchorFarm = {
  "version": "0.0.0",
  "name": "anchor_farm",
  "instructions": [
    {
      "name": "createGlobalState",
      "accounts": [
        {
          "name": "superOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newSuperOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "allowedCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "harvestFeeNumerator",
          "type": "u64"
        },
        {
          "name": "harvestFeeDenominator",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createFarm",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newFarm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolRewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammSwap",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "startTimestamp",
          "type": "u64"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createDual",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolRewardMintDual",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardDualNonce",
          "type": "u8"
        },
        {
          "name": "startTimestamp",
          "type": "u64"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "extendFarm",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "extendDual",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "userInfoNonce",
          "type": "u8"
        },
        {
          "name": "withSwapAction",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "withdrawer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "userInfoNonce",
          "type": "u8"
        },
        {
          "name": "withSwapAction",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addRewardSingle",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addRewardDual",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeRewardDual",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "harvest",
      "accounts": [
        {
          "name": "harvester",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "userInfoNonce",
          "type": "u8"
        },
        {
          "name": "rewardType",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "farmProgram",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superOwner",
            "type": "publicKey"
          },
          {
            "name": "feeOwner",
            "type": "publicKey"
          },
          {
            "name": "allowedCreator",
            "type": "publicKey"
          },
          {
            "name": "ammProgramId",
            "type": "publicKey"
          },
          {
            "name": "harvestFeeNumerator",
            "type": "u64"
          },
          {
            "name": "harvestFeeDenominator",
            "type": "u64"
          },
          {
            "name": "rewardMultipler",
            "type": "u64"
          },
          {
            "name": "reserve1",
            "type": "publicKey"
          },
          {
            "name": "reserve2",
            "type": "publicKey"
          },
          {
            "name": "reserve3",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "farmPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "state",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "seedKey",
            "type": "publicKey"
          },
          {
            "name": "poolLpTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "poolLpBalance",
            "type": "u64"
          },
          {
            "name": "poolRewardTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "poolMintAddress",
            "type": "publicKey"
          },
          {
            "name": "rewardMintAddress",
            "type": "publicKey"
          },
          {
            "name": "rewardPerShareNet",
            "type": "u128"
          },
          {
            "name": "lastTimestamp",
            "type": "u64"
          },
          {
            "name": "currentRewards",
            "type": "u64"
          },
          {
            "name": "distributedRewards",
            "type": "u64"
          },
          {
            "name": "harvestedRewards",
            "type": "u64"
          },
          {
            "name": "startTimestamp",
            "type": "u64"
          },
          {
            "name": "endTimestamp",
            "type": "u64"
          },
          {
            "name": "poolRewardTokenAccountDual",
            "type": "publicKey"
          },
          {
            "name": "rewardMintAddressDual",
            "type": "publicKey"
          },
          {
            "name": "rewardPerShareNetDual",
            "type": "u128"
          },
          {
            "name": "lastTimestampDual",
            "type": "u64"
          },
          {
            "name": "currentRewardsDual",
            "type": "u64"
          },
          {
            "name": "distributedRewardsDual",
            "type": "u64"
          },
          {
            "name": "harvestedRewardsDual",
            "type": "u64"
          },
          {
            "name": "startTimestampDual",
            "type": "u64"
          },
          {
            "name": "endTimestampDual",
            "type": "u64"
          },
          {
            "name": "reserve1",
            "type": "publicKey"
          },
          {
            "name": "reserve2",
            "type": "publicKey"
          },
          {
            "name": "reserve3",
            "type": "publicKey"
          },
          {
            "name": "reserve4",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "farmId",
            "type": "publicKey"
          },
          {
            "name": "depositBalance",
            "type": "u64"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "rewardDebt",
            "type": "u64"
          },
          {
            "name": "pendingRewardsDual",
            "type": "u64"
          },
          {
            "name": "rewardDebtDual",
            "type": "u64"
          },
          {
            "name": "reserve1",
            "type": "publicKey"
          },
          {
            "name": "reserve2",
            "type": "publicKey"
          },
          {
            "name": "reserve3",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FarmState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotAllowed"
          },
          {
            "name": "SingleYield"
          },
          {
            "name": "DualYield"
          }
        ]
      }
    },
    {
      "name": "RewardType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SingleReward"
          },
          {
            "name": "DualReward"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 301,
      "name": "AlreadyInUse",
      "msg": "AlreadyInUse"
    },
    {
      "code": 302,
      "name": "InvalidProgramAddress",
      "msg": "InvalidProgramAddress"
    },
    {
      "code": 303,
      "name": "InvalidState",
      "msg": "InvalidState"
    },
    {
      "code": 304,
      "name": "InvalidOwner",
      "msg": "InvalidOwner"
    },
    {
      "code": 305,
      "name": "NotAllowed",
      "msg": "NotAllowed"
    },
    {
      "code": 306,
      "name": "MathOverflow",
      "msg": "Math operation overflow"
    },
    {
      "code": 307,
      "name": "InvalidOracleConfig",
      "msg": "InvalidOracleConfig"
    },
    {
      "code": 308,
      "name": "InvalidAccountInput",
      "msg": "InvalidAccountInput"
    },
    {
      "code": 309,
      "name": "PreciseError",
      "msg": "PreciseError"
    },
    {
      "code": 310,
      "name": "RewardOverflow",
      "msg": "Error: reward overflow"
    },
    {
      "code": 311,
      "name": "TimeOverflow",
      "msg": "Error: timestamp overflow"
    },
    {
      "code": 312,
      "name": "InvalidPubkey",
      "msg": "Error: invalid pubkey"
    },
    {
      "code": 313,
      "name": "AmmError",
      "msg": "Error: amm error"
    },
    {
      "code": 314,
      "name": "NotStarted",
      "msg": "Error: farm is not started yet"
    },
    {
      "code": 315,
      "name": "FarmEnded",
      "msg": "Error: farm was ended"
    },
    {
      "code": 316,
      "name": "NotEnoughBalance",
      "msg": "Error: not enough balance"
    },
    {
      "code": 317,
      "name": "WrongPoolMint",
      "msg": "WrongPoolMint"
    },
    {
      "code": 318,
      "name": "WrongMintAddress",
      "msg": "WrongMintAddress"
    }
  ]
};

export const IDL: AnchorFarm = {
  "version": "0.0.0",
  "name": "anchor_farm",
  "instructions": [
    {
      "name": "createGlobalState",
      "accounts": [
        {
          "name": "superOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newSuperOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "allowedCreator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ammProgramId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "harvestFeeNumerator",
          "type": "u64"
        },
        {
          "name": "harvestFeeDenominator",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createFarm",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newFarm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolRewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ammSwap",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "startTimestamp",
          "type": "u64"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createDual",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolRewardMintDual",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardDualNonce",
          "type": "u8"
        },
        {
          "name": "startTimestamp",
          "type": "u64"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "extendFarm",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "extendDual",
      "accounts": [
        {
          "name": "creator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "endTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "userInfoNonce",
          "type": "u8"
        },
        {
          "name": "withSwapAction",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "withdrawer",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "userInfoNonce",
          "type": "u8"
        },
        {
          "name": "withSwapAction",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addRewardSingle",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addRewardDual",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeRewardDual",
      "accounts": [
        {
          "name": "depositor",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolLpToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardTokenDual",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolLpNonce",
          "type": "u8"
        },
        {
          "name": "farmPoolRewardNonce",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "harvest",
      "accounts": [
        {
          "name": "harvester",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "farm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "farmSeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userInfo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeRewardToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalStateNonce",
          "type": "u8"
        },
        {
          "name": "farmNonce",
          "type": "u8"
        },
        {
          "name": "userInfoNonce",
          "type": "u8"
        },
        {
          "name": "rewardType",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "farmProgram",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superOwner",
            "type": "publicKey"
          },
          {
            "name": "feeOwner",
            "type": "publicKey"
          },
          {
            "name": "allowedCreator",
            "type": "publicKey"
          },
          {
            "name": "ammProgramId",
            "type": "publicKey"
          },
          {
            "name": "harvestFeeNumerator",
            "type": "u64"
          },
          {
            "name": "harvestFeeDenominator",
            "type": "u64"
          },
          {
            "name": "rewardMultipler",
            "type": "u64"
          },
          {
            "name": "reserve1",
            "type": "publicKey"
          },
          {
            "name": "reserve2",
            "type": "publicKey"
          },
          {
            "name": "reserve3",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "farmPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "state",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "seedKey",
            "type": "publicKey"
          },
          {
            "name": "poolLpTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "poolLpBalance",
            "type": "u64"
          },
          {
            "name": "poolRewardTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "poolMintAddress",
            "type": "publicKey"
          },
          {
            "name": "rewardMintAddress",
            "type": "publicKey"
          },
          {
            "name": "rewardPerShareNet",
            "type": "u128"
          },
          {
            "name": "lastTimestamp",
            "type": "u64"
          },
          {
            "name": "currentRewards",
            "type": "u64"
          },
          {
            "name": "distributedRewards",
            "type": "u64"
          },
          {
            "name": "harvestedRewards",
            "type": "u64"
          },
          {
            "name": "startTimestamp",
            "type": "u64"
          },
          {
            "name": "endTimestamp",
            "type": "u64"
          },
          {
            "name": "poolRewardTokenAccountDual",
            "type": "publicKey"
          },
          {
            "name": "rewardMintAddressDual",
            "type": "publicKey"
          },
          {
            "name": "rewardPerShareNetDual",
            "type": "u128"
          },
          {
            "name": "lastTimestampDual",
            "type": "u64"
          },
          {
            "name": "currentRewardsDual",
            "type": "u64"
          },
          {
            "name": "distributedRewardsDual",
            "type": "u64"
          },
          {
            "name": "harvestedRewardsDual",
            "type": "u64"
          },
          {
            "name": "startTimestampDual",
            "type": "u64"
          },
          {
            "name": "endTimestampDual",
            "type": "u64"
          },
          {
            "name": "reserve1",
            "type": "publicKey"
          },
          {
            "name": "reserve2",
            "type": "publicKey"
          },
          {
            "name": "reserve3",
            "type": "publicKey"
          },
          {
            "name": "reserve4",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "farmId",
            "type": "publicKey"
          },
          {
            "name": "depositBalance",
            "type": "u64"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "rewardDebt",
            "type": "u64"
          },
          {
            "name": "pendingRewardsDual",
            "type": "u64"
          },
          {
            "name": "rewardDebtDual",
            "type": "u64"
          },
          {
            "name": "reserve1",
            "type": "publicKey"
          },
          {
            "name": "reserve2",
            "type": "publicKey"
          },
          {
            "name": "reserve3",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "FarmState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotAllowed"
          },
          {
            "name": "SingleYield"
          },
          {
            "name": "DualYield"
          }
        ]
      }
    },
    {
      "name": "RewardType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SingleReward"
          },
          {
            "name": "DualReward"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 301,
      "name": "AlreadyInUse",
      "msg": "AlreadyInUse"
    },
    {
      "code": 302,
      "name": "InvalidProgramAddress",
      "msg": "InvalidProgramAddress"
    },
    {
      "code": 303,
      "name": "InvalidState",
      "msg": "InvalidState"
    },
    {
      "code": 304,
      "name": "InvalidOwner",
      "msg": "InvalidOwner"
    },
    {
      "code": 305,
      "name": "NotAllowed",
      "msg": "NotAllowed"
    },
    {
      "code": 306,
      "name": "MathOverflow",
      "msg": "Math operation overflow"
    },
    {
      "code": 307,
      "name": "InvalidOracleConfig",
      "msg": "InvalidOracleConfig"
    },
    {
      "code": 308,
      "name": "InvalidAccountInput",
      "msg": "InvalidAccountInput"
    },
    {
      "code": 309,
      "name": "PreciseError",
      "msg": "PreciseError"
    },
    {
      "code": 310,
      "name": "RewardOverflow",
      "msg": "Error: reward overflow"
    },
    {
      "code": 311,
      "name": "TimeOverflow",
      "msg": "Error: timestamp overflow"
    },
    {
      "code": 312,
      "name": "InvalidPubkey",
      "msg": "Error: invalid pubkey"
    },
    {
      "code": 313,
      "name": "AmmError",
      "msg": "Error: amm error"
    },
    {
      "code": 314,
      "name": "NotStarted",
      "msg": "Error: farm is not started yet"
    },
    {
      "code": 315,
      "name": "FarmEnded",
      "msg": "Error: farm was ended"
    },
    {
      "code": 316,
      "name": "NotEnoughBalance",
      "msg": "Error: not enough balance"
    },
    {
      "code": 317,
      "name": "WrongPoolMint",
      "msg": "WrongPoolMint"
    },
    {
      "code": 318,
      "name": "WrongMintAddress",
      "msg": "WrongMintAddress"
    }
  ]
};
