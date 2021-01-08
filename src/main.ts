const snarkjs = require("snarkjs");
const fs = require("fs");
import { MoveSnarkArgs } from "./_types/contractAPITypes";
import { modPBigInt } from "./mimc";

type MoveInfo = {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  r: string;
  distMax: string;
};
const vkey = JSON.parse(fs.readFileSync(`${__dirname}/vkey/move.json`));

export default async function getMoveArgs(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number,
  distMax: number
): Promise<[MoveSnarkArgs]> {
  try {
    const input: MoveInfo = {
      x1: modPBigInt(x1).toString(),
      y1: modPBigInt(y1).toString(),
      x2: modPBigInt(x2).toString(),
      y2: modPBigInt(y2).toString(),
      r: r.toString(),
      distMax: distMax.toString(),
    };

    const snarkProof = await snarkjs.groth16.fullProve(
      input,
      `${__dirname}/circuits/move.wasm`,
      `${__dirname}/zkey/move.zkey`
    );

    const localVerified = await snarkjs.groth16.verify(
      vkey,
      snarkProof.publicSignals,
      snarkProof.proof
    );
    console.log(`locally verified ${localVerified}`);

    return snarkProof;
  } catch (e) {
    throw e;
  }
}
