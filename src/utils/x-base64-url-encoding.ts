// What is xBase64url?
// It is the same as base64url encoding but instead of the special characters
// '-' and '_' I need to use '-x' and '_x' because of restrictions in the
// peerJS validation regex /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.
// It doesn't allow multiple occurences of '_' e.g. '__'.

export function arrayBufferToXBase64url(buffer: ArrayBuffer): string {
  let illegibleString = '';
  const uint8Arr = new Uint8Array(buffer);
  for (let i = 0; i < uint8Arr.byteLength; i++) {
    illegibleString += String.fromCharCode(uint8Arr[i]);
  }

  const base64 = window.btoa(illegibleString);

  const xBase64url = base64
    .replace(/\+/g, '-x')
    .replace(/\//g, '_x')
    .replace(/=/g, '');

  return xBase64url;
}

export function xBase64urlToArrayBuffer(xBase64url: string): ArrayBuffer {
  let base64 = xBase64url.replace(/-x/g, '+').replace(/_x/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += new Array(5 - pad).join('=');
  }

  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}
