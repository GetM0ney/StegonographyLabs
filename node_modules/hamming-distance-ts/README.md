# hamming-distance-ts

Hamming distance in TypeScript.

## Motivation

There are other pure JS hamming distance libraries out there that I could have written a TypeScript declaration file for, but I wanted to learn about writing and publishing TypeScript libraries and I needed hamming distance computation for another project.

## Installation

`npm install --save hamming-distance-ts`

Now you can have your Hamming distances and some types too!

## Usage

```typescript
import { hammingDistance } from "hamming-distance-ts";

const hexString1 = "deadbeef" // these could also be Buffers
const hexString2 = "deadbeff"

const hd = hammingDistance(hexString1, hexString2)
// hd === 1
```

## License

MIT