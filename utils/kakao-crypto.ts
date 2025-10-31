// AES-GCM encryption/decryption for Kakao access token
// Uses Web Crypto API (available in Edge Runtime)

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM

async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("kakao-session-salt"), // Fixed salt for deterministic key
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptToken(token: string): Promise<string> {
  const secret = process.env.KAKAO_ENCRYPT_KEY || process.env.KAKAO_REST_API_KEY || "fallback-key-change-me";
  const key = await deriveKey(secret);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(token)
  );
  // Format: base64(iv) + ":" + base64(encrypted)
  const ivB64 = btoa(String.fromCharCode(...Array.from(iv)));
  const encB64 = btoa(String.fromCharCode(...Array.from(new Uint8Array(encrypted))));
  return `${ivB64}:${encB64}`;
}

export async function decryptToken(encrypted: string): Promise<string | null> {
  try {
    const secret = process.env.KAKAO_ENCRYPT_KEY || process.env.KAKAO_REST_API_KEY || "fallback-key-change-me";
    const key = await deriveKey(secret);
    const parts = encrypted.split(":");
    if (parts.length !== 2) return null;
    const iv = Uint8Array.from(atob(parts[0]), (c) => c.charCodeAt(0));
    const data = Uint8Array.from(atob(parts[1]), (c) => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data);
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch {
    return null;
  }
}
