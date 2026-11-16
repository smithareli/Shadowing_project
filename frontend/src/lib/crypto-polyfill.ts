import * as ExpoCrypto from 'expo-crypto';

const cryptoShim = (globalThis.crypto ?? {}) as Partial<Crypto>;
cryptoShim.randomUUID ??= ExpoCrypto.randomUUID as Crypto['randomUUID'];
cryptoShim.getRandomValues ??= ExpoCrypto.getRandomValues as Crypto['getRandomValues'];

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    configurable: true,
    value: cryptoShim,
  });
}