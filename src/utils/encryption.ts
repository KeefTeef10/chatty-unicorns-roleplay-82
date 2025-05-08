
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

// Generate a new keypair for a user
export const generateKeyPair = () => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    secretKey: util.encodeBase64(keyPair.secretKey)
  };
};

// Generate a random symmetric key for group encryption
export const generateSymmetricKey = () => {
  const key = nacl.randomBytes(nacl.secretbox.keyLength);
  return util.encodeBase64(key);
};

// Generate a random nonce
export const generateNonce = () => {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  return util.encodeBase64(nonce);
};

// Encrypt a message using symmetric encryption (for group chats)
export const encryptSymmetric = (message: string, symmetricKey: string) => {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = util.decodeUTF8(message);
  const keyUint8 = util.decodeBase64(symmetricKey);
  
  const encrypted = nacl.secretbox(messageUint8, nonce, keyUint8);
  
  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);
  
  return util.encodeBase64(fullMessage);
};

// Decrypt a message using symmetric encryption
export const decryptSymmetric = (encryptedMessage: string, symmetricKey: string) => {
  const messageWithNonceAsUint8 = util.decodeBase64(encryptedMessage);
  const nonce = messageWithNonceAsUint8.slice(0, nacl.secretbox.nonceLength);
  const message = messageWithNonceAsUint8.slice(nacl.secretbox.nonceLength);
  const keyUint8 = util.decodeBase64(symmetricKey);
  
  const decrypted = nacl.secretbox.open(message, nonce, keyUint8);
  
  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }
  
  return util.encodeUTF8(decrypted);
};

// Encrypt a message for a specific recipient
export const encryptAsymmetric = (message: string, mySecretKey: string, theirPublicKey: string) => {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = util.decodeUTF8(message);
  const secretKeyUint8 = util.decodeBase64(mySecretKey);
  const publicKeyUint8 = util.decodeBase64(theirPublicKey);
  
  const encrypted = nacl.box(messageUint8, nonce, publicKeyUint8, secretKeyUint8);
  
  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);
  
  return util.encodeBase64(fullMessage);
};

// Decrypt a message sent to you
export const decryptAsymmetric = (encryptedMessage: string, mySecretKey: string, theirPublicKey: string) => {
  const messageWithNonceAsUint8 = util.decodeBase64(encryptedMessage);
  const nonce = messageWithNonceAsUint8.slice(0, nacl.box.nonceLength);
  const message = messageWithNonceAsUint8.slice(nacl.box.nonceLength);
  const secretKeyUint8 = util.decodeBase64(mySecretKey);
  const publicKeyUint8 = util.decodeBase64(theirPublicKey);
  
  const decrypted = nacl.box.open(message, nonce, publicKeyUint8, secretKeyUint8);
  
  if (!decrypted) {
    throw new Error('Could not decrypt message');
  }
  
  return util.encodeUTF8(decrypted);
};

// Store keys securely in localStorage
export const storeKeys = (userId: number, keys: { publicKey: string; secretKey: string }) => {
  localStorage.setItem(`encryption_keys_${userId}`, JSON.stringify(keys));
};

// Retrieve keys from localStorage
export const getKeys = (userId: number) => {
  const keysString = localStorage.getItem(`encryption_keys_${userId}`);
  if (!keysString) return null;
  return JSON.parse(keysString) as { publicKey: string; secretKey: string };
};

// Store room symmetric key
export const storeRoomKey = (roomId: number, key: string) => {
  const roomKeys = JSON.parse(localStorage.getItem('room_keys') || '{}');
  roomKeys[roomId] = key;
  localStorage.setItem('room_keys', JSON.stringify(roomKeys));
};

// Get room symmetric key
export const getRoomKey = (roomId: number) => {
  const roomKeys = JSON.parse(localStorage.getItem('room_keys') || '{}');
  return roomKeys[roomId] || null;
};
