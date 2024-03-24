import { MODE, TOKENVALID_API_URL, REFRESH_TOKEN_API_URL } from "./Constants";
import CryptoJS from "crypto-js";
export function validatePassword(str) {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
  return regex.test(str);
}

export async function hashPassword(password) {
  // Encode the password string into Uint8Array using TextEncoder
  const oneWayHash = CryptoJS.SHA256(password).toString();
  return oneWayHash;
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
      if (response.status === 402) {
        // Access token expired, try to refresh it
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Store the new access token and retry the API call
          localStorage.setItem("token", newAccessToken);
          // Retry the API call or perform other actions as needed
          const response2 = await fetch(TOKENVALID_API_URL[MODE], {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          const data = await response2.json();
          return { tokenFound: 1, data: data, error: null };
        } else {
          // Handle failure (e.g., redirect to login)
        }
      }
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

export const capitalizeFirstLetter = (s) => (s ? `${s[0].toUpperCase()}${s.slice(1)}` : "");

export async function refreshAccessToken() {
  let refresh_token = localStorage.getItem("refresh_token");
  try {
    const response = await fetch(REFRESH_TOKEN_API_URL[MODE], {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }
    const data = await response.json();
    return data.token; // Return the new access token
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
    // logout the user since refresh tokens are expired
  }
}
