import { MODE, TOKENVALID_API_URL } from "./Constants";

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

// check if the token is fresh
export async function checkToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token in local storage");
    const response = await fetch(TOKENVALID_API_URL[MODE], {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 402) throw new Error("Token has expired");
      if (response.status === 401) throw new Error("Invalid Token");
      throw new Error("Error while verifying token");
    }
    const data = await response.json();
    console.log("token api data");
    return { tokenFound: 1, data: data, error: null };
  } catch (error) {
    return { tokenFound: 0, data: null, error: error.message };
  }
}
