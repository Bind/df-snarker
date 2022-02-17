import LRUMap from "mnemonist/lru-cache";
const snarkjs = require("snarkjs");

import {
  SnarkJSProofAndSignals,
  buildContractCallArgs,
  MoveSnarkInput,
  MoveSnarkContractCallArgs,
  moveSnarkWasmPath,
  moveSnarkZkeyPath,
  BiomebaseSnarkContractCallArgs,
  BiomebaseSnarkInput,
  biomebaseSnarkWasmPath,
  biomebaseSnarkZkeyPath,
  RevealSnarkContractCallArgs,
  RevealSnarkInput,
  revealSnarkWasmPath,
  revealSnarkZkeyPath,
} from "@darkforest_eth/snarks";

import { modPBigInt } from "@darkforest_eth/hashing";
const CACHE_SIZE: number = parseInt(process?.env?.CACHE_SIZE || "10000");
const InMemoryCache = new LRUMap(CACHE_SIZE);

export async function getMoveArgs(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number,
  distMax: number,
  PLANETHASH_KEY: number,
  SPACETYPE_KEY: number,
  SCALE: number,
  xMirror: number,
  yMirror: number
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
      PLANETHASH_KEY: PLANETHASH_KEY.toString(),
      SPACETYPE_KEY: SPACETYPE_KEY.toString(),
      SCALE: SCALE.toString(),
      xMirror: xMirror.toString(),
      yMirror: yMirror.toString(),
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

export async function getFindArtifactArgs(
  x: number,
  y: number,
  PLANETHASH_KEY: number,
  BIOMEBASE_KEY: number,
  SCALE: number,
  xMirror: number,
  yMirror: number
): Promise<BiomebaseSnarkContractCallArgs> {
  try {
    const start = Date.now();
    console.log("ARTIFACT: calculating witness and proof");
    const input: BiomebaseSnarkInput = {
      x: modPBigInt(x).toString(),
      y: modPBigInt(y).toString(),
      PLANETHASH_KEY: PLANETHASH_KEY.toString(),
      BIOMEBASE_KEY: BIOMEBASE_KEY.toString(),
      SCALE: SCALE.toString(),
      xMirror: xMirror.toString(),
      yMirror: yMirror.toString(),
    };

    const {
      proof,
      publicSignals,
    }: SnarkJSProofAndSignals = await snarkjs.groth16.fullProve(
      input,
      biomebaseSnarkWasmPath,
      biomebaseSnarkZkeyPath
    );

    const proofArgs = buildContractCallArgs(proof, publicSignals);

    return proofArgs as BiomebaseSnarkContractCallArgs;
  } catch (e) {
    throw e;
  }
}

export async function getRevealArgs(
  x: number,
  y: number,
  PLANETHASH_KEY: number,
  SPACETYPE_KEY: number,
  SCALE: number,
  xMirror: number,
  yMirror: number
): Promise<RevealSnarkContractCallArgs> {
  try {
    const input: RevealSnarkInput = {
      x: modPBigInt(x).toString(),
      y: modPBigInt(y).toString(),
      PLANETHASH_KEY: PLANETHASH_KEY.toString(),
      SPACETYPE_KEY: SPACETYPE_KEY.toString(),
      SCALE: SCALE.toString(),
      xMirror: xMirror.toString(),
      yMirror: yMirror.toString(),
    };

    const {
      proof,
      publicSignals,
    }: SnarkJSProofAndSignals = snarkjs.groth16.fullProve(
      input,
      revealSnarkWasmPath,
      revealSnarkZkeyPath
    );
    const ret = buildContractCallArgs(
      proof,
      publicSignals
    ) as RevealSnarkContractCallArgs;

    return ret;
  } catch (e) {
    throw e;
  }
}
