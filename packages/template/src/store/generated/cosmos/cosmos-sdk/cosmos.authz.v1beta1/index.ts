import { MissingWalletError, queryClient, registry, txClient } from './module'
import { GenericAuthorization } from './module/types/cosmos/authz/v1beta1/authz'
import { Grant } from './module/types/cosmos/authz/v1beta1/authz'
import { EventGrant } from './module/types/cosmos/authz/v1beta1/event'
import { EventRevoke } from './module/types/cosmos/authz/v1beta1/event'
import { GrantAuthorization } from './module/types/cosmos/authz/v1beta1/genesis'

export {
  EventGrant,
  EventRevoke,
  GenericAuthorization,
  Grant,
  GrantAuthorization
}

async function initTxClient(vuexGetters) {
  return await txClient(vuexGetters['common/wallet/signer'], {
    addr: vuexGetters['common/env/apiTendermint']
  })
}

async function initQueryClient(vuexGetters) {
  return await queryClient({
    addr: vuexGetters['common/env/apiCosmos']
  })
}

function mergeResults(value, next_values) {
  for (let prop of Object.keys(next_values)) {
    if (Array.isArray(next_values[prop])) {
      value[prop] = [...value[prop], ...next_values[prop]]
    } else {
      value[prop] = next_values[prop]
    }
  }
  return value
}

function getStructure(template) {
  let structure = { fields: [] }
  for (const [key, value] of Object.entries(template)) {
    let field: any = {}
    field.name = key
    field.type = typeof value
    structure.fields.push(field)
  }
  return structure
}

const getDefaultState = () => {
  return {
    Grants: {},

    _Structure: {
      GenericAuthorization: getStructure(GenericAuthorization.fromPartial({})),
      Grant: getStructure(Grant.fromPartial({})),
      EventGrant: getStructure(EventGrant.fromPartial({})),
      EventRevoke: getStructure(EventRevoke.fromPartial({})),
      GrantAuthorization: getStructure(GrantAuthorization.fromPartial({}))
    },
    _Registry: registry,
    _Subscriptions: new Set()
  }
}

// initial state
const state = getDefaultState()

export default {
  namespaced: true,
  state,
  mutations: {
    RESET_STATE(state) {
      Object.assign(state, getDefaultState())
    },
    QUERY(state, { query, key, value }) {
      state[query][JSON.stringify(key)] = value
    },
    SUBSCRIBE(state, subscription) {
      state._Subscriptions.add(JSON.stringify(subscription))
    },
    UNSUBSCRIBE(state, subscription) {
      state._Subscriptions.delete(JSON.stringify(subscription))
    }
  },
  getters: {
    getGrants:
      (state) =>
      (params = { params: {} }) => {
        if (!(<any>params).query) {
          ;(<any>params).query = null
        }
        return state.Grants[JSON.stringify(params)] ?? {}
      },

    getTypeStructure: (state) => (type) => {
      return state._Structure[type].fields
    },
    getRegistry: (state) => {
      return state._Registry
    }
  },
  actions: {
    init({ dispatch, rootGetters }) {
      console.log('Vuex module: cosmos.authz.v1beta1 initialized!')
      if (rootGetters['common/env/client']) {
        rootGetters['common/env/client'].on('newblock', () => {
          dispatch('StoreUpdate')
        })
      }
    },
    resetState({ commit }) {
      commit('RESET_STATE')
    },
    unsubscribe({ commit }, subscription) {
      commit('UNSUBSCRIBE', subscription)
    },
    async StoreUpdate({ state, dispatch }) {
      state._Subscriptions.forEach(async (subscription) => {
        try {
          const sub = JSON.parse(subscription)
          await dispatch(sub.action, sub.payload)
        } catch (e) {
          throw new Error('Subscriptions: ' + e.message)
        }
      })
    },

    async QueryGrants(
      { commit, rootGetters, getters },
      {
        options: { subscribe, all } = { subscribe: false, all: false },
        params,
        query = null
      }
    ) {
      try {
        const key = params ?? {}
        const queryClient = await initQueryClient(rootGetters)
        let value = (await queryClient.queryGrants(query)).data

        while (
          all &&
          (<any>value).pagination &&
          (<any>value).pagination.next_key != null
        ) {
          let next_values = (
            await queryClient.queryGrants({
              ...query,
              'pagination.key': (<any>value).pagination.next_key
            })
          ).data
          value = mergeResults(value, next_values)
        }
        commit('QUERY', {
          query: 'Grants',
          key: { params: { ...key }, query },
          value
        })
        if (subscribe)
          commit('SUBSCRIBE', {
            action: 'QueryGrants',
            payload: { options: { all }, params: { ...key }, query }
          })
        return getters['getGrants']({ params: { ...key }, query }) ?? {}
      } catch (e) {
        throw new Error(
          'QueryClient:QueryGrants API Node Unavailable. Could not perform query: ' +
            e.message
        )
      }
    },

    async sendMsgGrant({ rootGetters }, { value, fee = [], memo = '' }) {
      try {
        const txClient = await initTxClient(rootGetters)
        const msg = await txClient.msgGrant(value)
        const result = await txClient.signAndBroadcast([msg], {
          fee: { amount: fee, gas: '200000' },
          memo
        })
        return result
      } catch (e) {
        if (e == MissingWalletError) {
          throw new Error(
            'TxClient:MsgGrant:Init Could not initialize signing client. Wallet is required.'
          )
        } else {
          throw new Error(
            'TxClient:MsgGrant:Send Could not broadcast Tx: ' + e.message
          )
        }
      }
    },
    async sendMsgExec({ rootGetters }, { value, fee = [], memo = '' }) {
      try {
        const txClient = await initTxClient(rootGetters)
        const msg = await txClient.msgExec(value)
        const result = await txClient.signAndBroadcast([msg], {
          fee: { amount: fee, gas: '200000' },
          memo
        })
        return result
      } catch (e) {
        if (e == MissingWalletError) {
          throw new Error(
            'TxClient:MsgExec:Init Could not initialize signing client. Wallet is required.'
          )
        } else {
          throw new Error(
            'TxClient:MsgExec:Send Could not broadcast Tx: ' + e.message
          )
        }
      }
    },
    async sendMsgRevoke({ rootGetters }, { value, fee = [], memo = '' }) {
      try {
        const txClient = await initTxClient(rootGetters)
        const msg = await txClient.msgRevoke(value)
        const result = await txClient.signAndBroadcast([msg], {
          fee: { amount: fee, gas: '200000' },
          memo
        })
        return result
      } catch (e) {
        if (e == MissingWalletError) {
          throw new Error(
            'TxClient:MsgRevoke:Init Could not initialize signing client. Wallet is required.'
          )
        } else {
          throw new Error(
            'TxClient:MsgRevoke:Send Could not broadcast Tx: ' + e.message
          )
        }
      }
    },

    async MsgGrant({ rootGetters }, { value }) {
      try {
        const txClient = await initTxClient(rootGetters)
        const msg = await txClient.msgGrant(value)
        return msg
      } catch (e) {
        if (e == MissingWalletError) {
          throw new Error(
            'TxClient:MsgGrant:Init Could not initialize signing client. Wallet is required.'
          )
        } else {
          throw new Error(
            'TxClient:MsgGrant:Create Could not create message: ' + e.message
          )
        }
      }
    },
    async MsgExec({ rootGetters }, { value }) {
      try {
        const txClient = await initTxClient(rootGetters)
        const msg = await txClient.msgExec(value)
        return msg
      } catch (e) {
        if (e == MissingWalletError) {
          throw new Error(
            'TxClient:MsgExec:Init Could not initialize signing client. Wallet is required.'
          )
        } else {
          throw new Error(
            'TxClient:MsgExec:Create Could not create message: ' + e.message
          )
        }
      }
    },
    async MsgRevoke({ rootGetters }, { value }) {
      try {
        const txClient = await initTxClient(rootGetters)
        const msg = await txClient.msgRevoke(value)
        return msg
      } catch (e) {
        if (e == MissingWalletError) {
          throw new Error(
            'TxClient:MsgRevoke:Init Could not initialize signing client. Wallet is required.'
          )
        } else {
          throw new Error(
            'TxClient:MsgRevoke:Create Could not create message: ' + e.message
          )
        }
      }
    }
  }
}
