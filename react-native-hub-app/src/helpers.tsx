import AsyncStorage from '@react-native-community/async-storage';
import { ThreadID } from '@textile/hub'
import { Libp2pCryptoIdentity } from '@textile/threads-core'

const versionId = 10000
const version = 10241
const versionTrip = 10200
const IDENTITY_KEY = 'identity-' + versionId
const USER_THREAD_ID_V = 'user-thread-' + version
const TRIP_THREAD_ID_V = 'trip-thread-' + versionTrip

export const clearAppData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        console.log(keys)
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error('Error clearing app data.');
    }
}

export const cacheUserThread = async (id: ThreadID) => {
  await AsyncStorage.setItem(USER_THREAD_ID_V, id.toString())
}

export const cacheTripThread = async (id: ThreadID) => {
  await AsyncStorage.setItem(TRIP_THREAD_ID_V, id.toString())
}

export const getCachedUserThread = async (): Promise<ThreadID | undefined> => {
  /**
   * All storage should be scoped to the identity
   *
   * If the identity changes and you try to use an old database,
   * it will error due to not authorized.
   */
  const idStr = await AsyncStorage.getItem(USER_THREAD_ID_V)
  // Every user adds their info to same user thread
  console.log(idStr)
  if (idStr) {
    /**
     * Temporary hack to get ThreadID working in RN
     */
    const id: ThreadID = ThreadID.fromString(idStr)
    return id
  }
  return undefined
}

export const getCachedTripThread = async (): Promise<ThreadID | undefined> => {
  const idStr = await AsyncStorage.getItem(TRIP_THREAD_ID_V)
  if (idStr) {
    const id: ThreadID = ThreadID.fromString(idStr)
    return id
  }
  return undefined
}

export const generateIdentity = async (): Promise<Libp2pCryptoIdentity> => {
  let idStr = await AsyncStorage.getItem(IDENTITY_KEY)
  if (idStr) {
    const cachedId = await Libp2pCryptoIdentity.fromString(idStr)
    return cachedId
  } else {
    const id = await Libp2pCryptoIdentity.fromRandom()
    idStr = id.toString()
    await AsyncStorage.setItem(IDENTITY_KEY, idStr)
    return id
  }
}

export const userSchema = {
  $id: 'https://example.com/astronaut.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Users',
  type: 'object',
  required: ['_id'],
  properties: {
    _id: {
      type: 'string',
      description: "The instance's id.",
    },
    userAddress: {
      type: 'string',
      description: "User's Ethereum Address",
    },
    username: {
      type: 'string',
      description: "username",
    },
    socialHandle: {
      type: 'string',
      description: "Instagram Handle",
    },
    age: {
      description: 'Age',
      type: 'integer',
      minimum: 0,
    },
    occupancy: {
      type: 'string',
      description: "User's occupancy",
    },
    adRewards: {
      type: 'boolean',
      description: "User opt in for add reward",
    },
    shareData: {
      type: 'boolean',
      description: "User opt in to share data",
    },
  },
}

export const tripSchema = {
  $id: 'https://example.com/astronaut.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Trips',
  type: 'object',
  required: ['_id'],
  properties: {
    _id: {
      type: 'string',
      description: "The instance's id.",
    },
    userEthAddress: {
      type: 'string',
      description: "User's Eth Account",
    },
    userId: {
      type: 'string',
      description: "Textile identity",
    },
    coordinates: {
      type: 'array',
      description: "Coordinates of trip",
    },
    timestamps: {
      type: 'array',
      description: 'Timestamps for coordinates',
    },
  },
}
