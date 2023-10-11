import CryptoJS from 'crypto-js';

const aesKey = 'O2BEeIv399qHQNhD6aGW8R8DEj4bqHXm';

export function encrypt(data) {
  return encryptAES(data, aesKey);
}

export function encryptAES(data, key) {
  const dataBytes = CryptoJS.enc.Utf8.parse(data);
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(dataBytes, keyBytes, {
    iv: keyBytes,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export function decrypt(data) {
  return decryptAES(data, aesKey);
}

export function decryptAES(data, key) {
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(data, keyBytes, {
    iv: keyBytes,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypted);
}