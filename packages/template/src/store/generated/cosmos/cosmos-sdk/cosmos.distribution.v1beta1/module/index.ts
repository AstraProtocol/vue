// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.

import { StdFee } from '@cosmjs/launchpad'
import {
  DirectSecp256k1HdWallet,
  EncodeObject,
  OfflineSigner,
  Registry
} from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'

import { Api } from './rest'
import { MsgWithdrawDelegatorReward } from './types/cosmos/distribution/v1beta1/tx'
import { MsgWithdrawValidatorCommission } from './types/cosmos/distribution/v1beta1/tx'
import { MsgFundCommunityPool } from './types/cosmos/distribution/v1beta1/tx'
import { MsgSetWithdrawAddress } from './types/cosmos/distribution/v1beta1/tx'

const types = [
  [
    '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    MsgWithdrawDelegatorReward
  ],
  [
    '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    MsgWithdrawValidatorCommission
  ],
  ['/cosmos.distribution.v1beta1.MsgFundCommunityPool', MsgFundCommunityPool],
  ['/cosmos.distribution.v1beta1.MsgSetWithdrawAddress', MsgSetWithdrawAddress]
]
export const MissingWalletError = new Error('wallet is required')

export const registry = new Registry(<any>types)

const defaultFee = {
  amount: [],
  gas: '200000'
}

interface TxClientOptions {
  addr: string
}

interface SignAndBroadcastOptions {
  fee: StdFee
  memo?: string
}

const txClient = async (
  wallet: OfflineSigner,
  { addr: addr }: TxClientOptions = { addr: 'http://localhost:26657' }
) => {
  if (!wallet) throw MissingWalletError
  let client
  if (addr) {
    client = await SigningStargateClient.connectWithSigner(addr, wallet, {
      registry
    })
  } else {
    client = await SigningStargateClient.offline(wallet, { registry })
  }
  const { address } = (await wallet.getAccounts())[0]

  return {
    signAndBroadcast: (
      msgs: EncodeObject[],
      { fee, memo }: SignAndBroadcastOptions = { fee: defaultFee, memo: '' }
    ) => client.signAndBroadcast(address, msgs, fee, memo),
    msgWithdrawDelegatorReward: (
      data: MsgWithdrawDelegatorReward
    ): EncodeObject => ({
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      value: MsgWithdrawDelegatorReward.fromPartial(data)
    }),
    msgWithdrawValidatorCommission: (
      data: MsgWithdrawValidatorCommission
    ): EncodeObject => ({
      typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
      value: MsgWithdrawValidatorCommission.fromPartial(data)
    }),
    msgFundCommunityPool: (data: MsgFundCommunityPool): EncodeObject => ({
      typeUrl: '/cosmos.distribution.v1beta1.MsgFundCommunityPool',
      value: MsgFundCommunityPool.fromPartial(data)
    }),
    msgSetWithdrawAddress: (data: MsgSetWithdrawAddress): EncodeObject => ({
      typeUrl: '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
      value: MsgSetWithdrawAddress.fromPartial(data)
    })
  }
}

interface QueryClientOptions {
  addr: string
}

const queryClient = async (
  { addr: addr }: QueryClientOptions = { addr: 'http://localhost:1317' }
) => {
  return new Api({ baseUrl: addr })
}

export { queryClient, txClient }
