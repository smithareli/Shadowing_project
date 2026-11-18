// polyfills.ts
import "react-native-get-random-values";
import * as ExpoCrypto from "expo-crypto";

const cryptoShim = (globalThis.crypto ?? {}) as Partial<Crypto>;

cryptoShim.getRandomValues ??= ((array: ArrayBufferView) => {
  return ExpoCrypto.getRandomValues(array as any);
}) as Crypto["getRandomValues"];

cryptoShim.randomUUID ??= (() => {
  if (typeof ExpoCrypto.randomUUID === "function") {
    return ExpoCrypto.randomUUID();
  }
  // Pure JS fallback using getRandomValues if native randomUUID isn't linked
  const bytes = new Uint8Array(16);
  cryptoShim.getRandomValues!(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}) as Crypto["randomUUID"];

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: cryptoShim,
  });
}
