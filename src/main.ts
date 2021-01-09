  const snarkjs = require("snarkjs");
  const fs = require("fs");
  import { MoveSnarkArgs, ContractCallArgs } from "./_types/contractAPITypes";
  import {
    SnarkJSProof,
    SnarkJSProofAndSignals,
    SnarkLogData
  } from './_types/globalTypes';
  import mimcHash,{ modPBigInt,modPBigIntNative  } from "./mimc";
  import perlin from "./perlin"
  import bigInt,{ BigInteger } from 'big-integer'
  import * as CRC32 from 'crc-32';

  type MoveInfo = {
    x1: string;
    y1: string;
    x2: string; 
    y2: string;
    r: string;
    distMax: string;
  };
  const vkey = JSON.parse(fs.readFileSync(`${__dirname}/../snark_files/move_vkey.json`));

  export default async function getMoveArgs(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r: number,
    distMax: number
  ): Promise<[MoveSnarkArgs, SnarkLogData]> {
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
        `${__dirname}/../snark_files/move_circuit.wasm`,
        `${__dirname}/../snark_files/move.zkey`
      );

      const hash1 =  mimcHash(x1, y1);
      const hash2 =  mimcHash(x2, y2);
      const perl2 = perlin({ x: x2, y: y2 });
      const publicSignals: BigInteger[] = [
        hash1,
        hash2,
        bigInt(perl2),
        bigInt(r),
        bigInt(distMax),
      ];
      
      const proofArgs = callArgsFromProofAndSignals(
        snarkProof.proof,
        publicSignals
      );

      const localVerified = await snarkjs.groth16.verify(
        vkey,
        snarkProof.publicSignals,
        snarkProof.proof
      );
      console.log(`locally verified ${localVerified}`);
      const snarkLogs: SnarkLogData = {
        expectedSignals: snarkProof.publicSignals,
        actualSignals: publicSignals.map((x) => x.toString()),
        proofVerified: false,
        circuitCRC: CRC32.buf([1]),
        zkeyCRC: CRC32.buf([1]),
        snarkjsCRC: CRC32.buf([1]),
      };

      return [proofArgs as MoveSnarkArgs , snarkLogs]
    } catch (e) {
      throw e;
    }
  }

  function callArgsFromProofAndSignals(
    snarkProof: SnarkJSProof,
    publicSignals: BigInteger[]
  ): ContractCallArgs {
    // the object returned by genZKSnarkProof needs to be massaged into a set of parameters the verifying contract
    // will accept
    return [
      snarkProof.pi_a.slice(0, 2), // pi_a
      // genZKSnarkProof reverses values in the inner arrays of pi_b
      [
        snarkProof.pi_b[0].slice(0).reverse(),
        snarkProof.pi_b[1].slice(0).reverse(),
      ], // pi_b
      snarkProof.pi_c.slice(0, 2), // pi_c
      publicSignals.map((signal) => signal.toString(10)), // input
    ];
  }