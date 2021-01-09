
export interface SnarkJSProof {
    pi_a: [string, string, string];
    pi_b: [[string, string], [string, string], [string, string]];
    pi_c: [string, string, string];
  }
  
  export interface SnarkJSProofAndSignals {
    proof: SnarkJSProof;
    publicSignals: string[];
  }
  export interface WorldCoords {
    x: number;
    y: number;
  }
  
  export const compareWorldCoords = (a: WorldCoords, b: WorldCoords): boolean =>
    a.x === b.x && a.y === b.y;
  
  export interface CanvasCoords {
    x: number;
    y: number;
  }
  
  export const distL2 = (
    a: CanvasCoords | WorldCoords,
    b: CanvasCoords | WorldCoords
  ): number => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  
  // returns pythagorean dist for this vector
  export const vecLen = (a: CanvasCoords | WorldCoords): number =>
    Math.sqrt(a.x ** 2 + a.y ** 2);
  
  // returns the vector with len 1
  export const normalize = (a: WorldCoords): WorldCoords => {
    const len = vecLen(a);
  
    if (len < 0.00001) return a; // prevent div by 0
  
    return {
      x: a.x / len,
      y: a.y / len,
    };
  };
  
  // returns vector scaled by k
  export const vecScale = (a: WorldCoords, k: number) => {
    const norm = normalize(a);
    const len = vecLen(a);
  
    return {
      x: norm.x * k * len,
      y: norm.y * k * len,
    };
  };
  
  export type LocationId = string & {
    __value__: never;
  };
  
  export type VoyageId = string & {
    __value__: never;
  };
  
  export type ArtifactId = string & {
    __value__: never;
  };
  
  export type EthAddress = string & {
    __value__: never;
  }; // this is expected to be 40 chars, lowercase hex. see src/utils/CheckedTypeUtils.ts for constructor

  export interface Coordinates {
    // integers
    x: number;
    y: number;
  }
  
  export type Upgrade = {
    energyCapMultiplier: number;
    energyGroMultiplier: number;
    rangeMultiplier: number;
    speedMultiplier: number;
    defMultiplier: number;
  };

  export interface Location {
    coords: WorldCoords;
    hash: LocationId;
    perlin: number;
    biomebase: number; // biome perlin value. combined with spaceType to get the actual biome
  }
  