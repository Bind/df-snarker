import LRUMap from "mnemonist/lru-cache";
const snarkjs = require("snarkjs");

import {
  SnarkJSProofAndSignals,
  buildContractCallArgs,
  MoveSnarkInput,
  MoveSnarkContractCallArgs,
  moveSnarkWasmPath,
  moveSnarkZkeyPath,
} from "@darkforest_eth/snarks";

import { modPBigInt } from "@darkforest_eth/hashing";
const CACHE_SIZE: number = parseInt(process?.env?.CACHE_SIZE || "10000");
const InMemoryCache = new LRUMap(CACHE_SIZE);

//Should pull these from the actual contract or via an ENV file
const contractConstants = {
  BIOMEBASE_KEY: 422,
  BIOME_THRESHOLD_1: 15,
  BIOME_THRESHOLD_2: 17,
  DISABLE_ZK_CHECKS: false,
  INIT_PERLIN_MAX: 14,
  INIT_PERLIN_MIN: 13,
  LOCATION_REVEAL_COOLDOWN: 86400,
  MAX_NATURAL_PLANET_LEVEL: 256,
  PERLIN_LENGTH_SCALE: 16384,
  PERLIN_MIRROR_X: false,
  PERLIN_MIRROR_Y: false,
  PERLIN_THRESHOLD_1: 14,
  PERLIN_THRESHOLD_2: 15,
  PERLIN_THRESHOLD_3: 19,
  PHOTOID_ACTIVATION_DELAY: 43200,
  PLANETHASH_KEY: 420,
  PLANET_RARITY: 16384,
  SPACETYPE_KEY: 421,
  TIME_FACTOR_HUNDREDTHS: 100,
};

export default async function getMoveArgs(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number,
  distMax: number
): Promise<MoveSnarkContractCallArgs> {
  try {
    const cacheKey = `${x1}-${y1}-${x2}-${y2}-${r}-${distMax}`;
    const cachedResult = InMemoryCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult as MoveSnarkContractCallArgs;
    }
    const input: MoveSnarkInput = {
      x1: modPBigInt(x1).toString(),
      y1: modPBigInt(y1).toString(),
      x2: modPBigInt(x2).toString(),
      y2: modPBigInt(y2).toString(),
      r: r.toString(),
      distMax: distMax.toString(),
      PLANETHASH_KEY: contractConstants.PLANETHASH_KEY.toString(),
      SPACETYPE_KEY: contractConstants.SPACETYPE_KEY.toString(),
      SCALE: contractConstants.PERLIN_LENGTH_SCALE.toString(),
      xMirror: contractConstants.PERLIN_MIRROR_X ? "1" : "0",
      yMirror: contractConstants.PERLIN_MIRROR_X ? "1" : "0",
    };

    const {
      proof,
      publicSignals,
    }: SnarkJSProofAndSignals = await snarkjs.groth16.fullProve(
      input,
      moveSnarkWasmPath,
      moveSnarkZkeyPath
    );

    const proofArgs = buildContractCallArgs(
      proof,
      publicSignals
    ) as MoveSnarkContractCallArgs;
    InMemoryCache.set(cacheKey, proofArgs);
    return proofArgs;
  } catch (e) {
    throw e;
  }
}
