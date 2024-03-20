export function validatePassword(str) {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
  return regex.test(str);
}

export async function hashPassword(password) {
  // Encode the password string into Uint8Array using TextEncoder
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Use the SubtleCrypto.digest method to hash the data using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash from ArrayBuffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return hashHex;
}
