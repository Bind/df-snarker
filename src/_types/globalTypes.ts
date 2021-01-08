
export interface SnarkJSProof {
    pi_a: [string, string, string];
    pi_b: [[string, string], [string, string], [string, string]];
    pi_c: [string, string, string];
  }
  
  export interface SnarkJSProofAndSignals {
    proof: SnarkJSProof;
    publicSignals: string[];
  }

  
  