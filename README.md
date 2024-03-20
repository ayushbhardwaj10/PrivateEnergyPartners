##########################################
FEATURES
##########################################

##############################
Flask
##############################

1. /signup API
   - used to sign up users.
   - Security : Performs Salting + hash function to store user's passwords. 'Salting' is a powerful technique to avoid dictionary attacks by hackers by concatinating the Hash of the passwords and a unique salt value for the user and again hashing it to store as the password_hash for the user instead of storing the raw password which is highly vulnerable to data leaks.
   - handels if username already exists

##############################
React
##############################

1. Login component - Ability to login and signup
2. show and hide functionality in Login - using useState() hook.
3. Sign Up : Verifying passwords are matching and showing appropriate error message.
4. Sign Up : Verifying password is minimum 5 characters long with atleast 1 Capital Symbol and 1 special symbol and showing appropriate error message if user enters wrong. Built a regular expression to validate the problem string.
5. Sign Up : Check if user already exists and show a message to user
6. Sign Up : After successfull Sign up, convey to user and then navigate to sign in tab.
7. Following Modular programming approach : Built seperate files for storing the constants in utils/constants.js, utils/HelperFunctions.js
8. Security : Sending one way Hash of the password and not exposing the original password on network call.

   How one way hash is working in code :

   - Text Encoding: The password string is first encoded into a Uint8Array using TextEncoder. This is necessary because the Web Crypto API operates on byte data, not strings.

   - Hashing: The crypto.subtle.digest method is used to hash the encoded data. This method is part of the SubtleCrypto interface, which provides a number of low-level cryptographic primitives. The 'SHA-256' argument specifies that we want to use the SHA-256 hash function.

   - Hash Conversion: The result of crypto.subtle.digest is an ArrayBuffer. This buffer is converted into an array of bytes (Uint8Array), and then each byte is converted to a hexadecimal string. These hex strings are concatenated to form the final hash string.

##############################
MySQL Database
##############################

1. Create table users with columns - id, fullname, userName, salt, password_hash

   - Security : password_hash = hash(salt + hash(raw password))

2.
