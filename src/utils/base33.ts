/**
 * What is Base33?
 * It is basically a Base32 encoding that always ends with a '0'.
 * This helps when trying to automatically processing user input.
 */

const alphabet = '123456789abcdefghijkmnpqrstvwxyz';
export const base33endingChar = '0';

const alphabetMap = Object.fromEntries(
  alphabet.split('').map((char, index) => [char, index]),
);

export function base33Encode(data: ArrayBuffer) {
  const dataView = new DataView(data);

  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < dataView.byteLength; i++) {
    value = (value << 8) | dataView.getUint8(i);
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  output += base33endingChar;

  return output;
}

export function base33Decode(base33Input: string): ArrayBuffer {
  if (!base33Input.endsWith(base33endingChar))
    throw new Error(
      `Base33 encoding needs to end with a '${base33endingChar}'.`,
    );

  const base32Input = base33Input.slice(0, -1);
  const inputLength = base32Input.length;
  const outputLength = Math.floor((inputLength * 5) / 8);

  let bits = 0;
  let value = 0;
  let index = 0;

  const output = new Uint8Array(outputLength);

  for (let i = 0; i < inputLength; i++) {
    value = (value << 5) | alphabetMap[base32Input[i]];
    bits += 5;

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return output.buffer;
}
