/* eslint-disable */
import { Timestamp } from '../../../google/protobuf/timestamp'
import { Any } from '../../../google/protobuf/any'
import { Writer, Reader } from 'protobufjs/minimal'

export const protobufPackage = 'cosmos.authz.v1beta1'

/** Since: cosmos-sdk 0.43 */

/** GenesisState defines the authz module's genesis state. */
export interface GenesisState {
  authorization: GrantAuthorization[]
}

/** GrantAuthorization defines the GenesisState/GrantAuthorization type. */
export interface GrantAuthorization {
  granter: string
  grantee: string
  authorization: Any | undefined
  expiration: Date | undefined
}

const baseGenesisState: object = {}

export const GenesisState = {
  encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
    for (const v of message.authorization) {
      GrantAuthorization.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseGenesisState } as GenesisState
    message.authorization = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.authorization.push(
            GrantAuthorization.decode(reader, reader.uint32())
          )
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GenesisState {
    const message = { ...baseGenesisState } as GenesisState
    message.authorization = []
    if (object.authorization !== undefined && object.authorization !== null) {
      for (const e of object.authorization) {
        message.authorization.push(GrantAuthorization.fromJSON(e))
      }
    }
    return message
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {}
    if (message.authorization) {
      obj.authorization = message.authorization.map((e) =>
        e ? GrantAuthorization.toJSON(e) : undefined
      )
    } else {
      obj.authorization = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState
    message.authorization = []
    if (object.authorization !== undefined && object.authorization !== null) {
      for (const e of object.authorization) {
        message.authorization.push(GrantAuthorization.fromPartial(e))
      }
    }
    return message
  }
}

const baseGrantAuthorization: object = { granter: '', grantee: '' }

export const GrantAuthorization = {
  encode(
    message: GrantAuthorization,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.granter !== '') {
      writer.uint32(10).string(message.granter)
    }
    if (message.grantee !== '') {
      writer.uint32(18).string(message.grantee)
    }
    if (message.authorization !== undefined) {
      Any.encode(message.authorization, writer.uint32(26).fork()).ldelim()
    }
    if (message.expiration !== undefined) {
      Timestamp.encode(
        toTimestamp(message.expiration),
        writer.uint32(34).fork()
      ).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): GrantAuthorization {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseGrantAuthorization } as GrantAuthorization
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.granter = reader.string()
          break
        case 2:
          message.grantee = reader.string()
          break
        case 3:
          message.authorization = Any.decode(reader, reader.uint32())
          break
        case 4:
          message.expiration = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          )
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GrantAuthorization {
    const message = { ...baseGrantAuthorization } as GrantAuthorization
    if (object.granter !== undefined && object.granter !== null) {
      message.granter = String(object.granter)
    } else {
      message.granter = ''
    }
    if (object.grantee !== undefined && object.grantee !== null) {
      message.grantee = String(object.grantee)
    } else {
      message.grantee = ''
    }
    if (object.authorization !== undefined && object.authorization !== null) {
      message.authorization = Any.fromJSON(object.authorization)
    } else {
      message.authorization = undefined
    }
    if (object.expiration !== undefined && object.expiration !== null) {
      message.expiration = fromJsonTimestamp(object.expiration)
    } else {
      message.expiration = undefined
    }
    return message
  },

  toJSON(message: GrantAuthorization): unknown {
    const obj: any = {}
    message.granter !== undefined && (obj.granter = message.granter)
    message.grantee !== undefined && (obj.grantee = message.grantee)
    message.authorization !== undefined &&
      (obj.authorization = message.authorization
        ? Any.toJSON(message.authorization)
        : undefined)
    message.expiration !== undefined &&
      (obj.expiration =
        message.expiration !== undefined
          ? message.expiration.toISOString()
          : null)
    return obj
  },

  fromPartial(object: DeepPartial<GrantAuthorization>): GrantAuthorization {
    const message = { ...baseGrantAuthorization } as GrantAuthorization
    if (object.granter !== undefined && object.granter !== null) {
      message.granter = object.granter
    } else {
      message.granter = ''
    }
    if (object.grantee !== undefined && object.grantee !== null) {
      message.grantee = object.grantee
    } else {
      message.grantee = ''
    }
    if (object.authorization !== undefined && object.authorization !== null) {
      message.authorization = Any.fromPartial(object.authorization)
    } else {
      message.authorization = undefined
    }
    if (object.expiration !== undefined && object.expiration !== null) {
      message.expiration = object.expiration
    } else {
      message.expiration = undefined
    }
    return message
  }
}

type Builtin = Date | Function | Uint8Array | string | number | undefined
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000
  const nanos = (date.getTime() % 1_000) * 1_000_000
  return { seconds, nanos }
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000
  millis += t.nanos / 1_000_000
  return new Date(millis)
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o
  } else if (typeof o === 'string') {
    return new Date(o)
  } else {
    return fromTimestamp(Timestamp.fromJSON(o))
  }
}
