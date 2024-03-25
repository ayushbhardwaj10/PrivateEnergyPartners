Instructions to setup :

######

1. Git pull https://github.com/ayushbhardwaj10/PrivateEnergyPartners.git
2. Open a terminal and go inside the project's root. ie. PrivateEnergyPartners/
3. Make sure you have docker installed on your machine and docker runs from the terminal. To test this, type "docker --version". It should print docker version without errors.
4. docker pull ayush1041998/reactapp:latest
5. docker pull ayush1041998/flaskapp:latest
6. docker-compose up --build
7. Go to a browser and type : http://localhost:3000/
8. You can use the following 2 users for whom the data is being loaded into database :
   (a) Username : ayush@gmail.com Password : Password@123
   (b) Username : john@gmail.com Password@123
   Note : if you create a new user, it'll still get created but for them, there'll be no production and consumption data.

API Usage

######

Note : All the APIs other than /signup and /login are protected and can only be accessed by providing the access token generated by /login api in in the header.

1. Signup Users : /signup
   - endpoint : http://127.0.0.1:5001/signup
   - headers : {Content-Type : application/json}
   - body : {
     "fullName":"Raman Gupta",
     "userName":"raman@gmail.com",
     "password":"Password@123"
     }
2. Login users : /login

   - endpoint : http://127.0.0.1:5001/login
   - headers : {Content-Type : application/json}
   - {
     "userName": <userName of user>,
     "password": <hash(SHA 256 based) of raw password>
     }

3.

Future Improvement Areas

######

1. Using HTTPOnly cookies for storing refresh tokens to protect the refresh tokens from Cross Site Scripting Attacks since the token will be accessed from javascript.
2. Use a SSL certificates to establish a HTTPS connection to make the transit more secure.
