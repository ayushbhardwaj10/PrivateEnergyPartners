                                                FEATURES

##############################
Flask
##############################

1. /signup API

   - used to sign up users.
   - Security : Performs Salting + hash function to store user's passwords. 'Salting' is a powerful technique to preserve the password of the user if the server gets compromised. Since the hash of the raw password or the raw password itself is not stored anywhere, it'll be very hard for the hacker to extract the hash of the raw password or the raw password using the password_hash or salted value since we are using one way hash functions here.
   - handels if username already exists

2. /login API
   - logs in the user.
   - To verify password, password_hash is used. pass_hash = hash(passHash from client + salting) is calculated and compared with password_hash stored in the backend.
   - If yes return 200 OK with two JWT tokens : access tokens (valid for 15 minutes) and refresh tokens(valid for 2 days)
3. @token_required

   - it's used to protect the flask APIs that only the users with fresh JWT access token can access the resources.

4. /refresh_token
   - endpoint used to refresh the access token by providing the refresh_token and if refresh token is valid and fresh,
     returns a new access token to client.

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

   One way hash implementation in code :

   - Text Encoding: The password string is first encoded into a Uint8Array using TextEncoder. This is necessary because the Web Crypto API operates on byte data, not strings.

   - Hashing: The crypto.subtle.digest method is used to hash the encoded data. This method is part of the SubtleCrypto interface, which provides a number of low-level cryptographic primitives. The 'SHA-256' argument specifies that we want to use the SHA-256 hash function.

   - Hash Conversion: The result of crypto.subtle.digest is an ArrayBuffer. This buffer is converted into an array of bytes (Uint8Array), and then each byte is converted to a hexadecimal string. These hex strings are concatenated to form the final hash string.

9. Protecting the routes : Users cannot enter Home page (ie. /home) without first logging it. If they try, they will automatically be re-routed to the login page.
10. Responsive UI development : Using tailwind CSS.
11. Logout : When user click logout, clear the Redux store and navigate to login page.
12. JWT (JSON Web Tokens) based authentications. When user logs in they get a temporary access token valid for 15 minutes and a refresh tokens valid for 2 days. When the access token expires, the refresh token is used to generate a new access token again automatically and user doesn't have to interfere.

##############################
MySQL Database
##############################

1. Create table users with columns - id, fullname, userName, salt, password_hash

   - Security : password_hash = hash(salt + hash(raw password))

2.
