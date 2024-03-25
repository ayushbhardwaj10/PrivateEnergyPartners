import React, { useState, useEffect } from "react";
import { validatePassword, hashPassword } from "../utils/HelperFunctions";
import { MODE, SIGNUP_API_URL, SIGNIN_API_URL } from "../utils/Constants";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../utils/HelperFunctions";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [password2, setPassword2] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const navigate = useNavigate();

  const toggleSignUp = () => {
    setErrorMessage("");
    setIsSignUp(!isSignUp);
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (isSignUp) {
      // sign up
      if (fullName === "" || userName === "" || password === "" || password2 === "") {
        setErrorMessage("Please fill all the details");
        return;
      }
      if (password !== password2) {
        setErrorMessage("passwords not matching");
        return;
      }
      if (!validatePassword(password)) {
        setErrorMessage("passwords must be minimum 5 characters with 1 Capital Letter and 1 Special Symbol");
        return;
      }

      // hashPassword is a async method, thus, call SignAPI only when hashPassword() returns results
      hashPassword(password).then((passwordHash) => {
        fetch(SIGNUP_API_URL[MODE], {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName,
            userName: userName,
            password: passwordHash,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 401) {
                setSuccessMessage("");
                setErrorMessage("Username already exists");
              }
              throw new Error("Sign up Failure");
            } else {
              return response.json();
            }
          })
          .then((data) => {
            // sign up is successull
            setSuccessMessage("Succesfully Signed up. Please Sign In");
            setIsSignUp(false);
            setErrorMessage("");
          })
          .catch((error) => console.log(error));
      });
    } else {
      // sign in user
      if (userName === "" || password === "") {
        setErrorMessage("Please enter Username and Password");
        return;
      }
      hashPassword(password).then((passwordHash) => {
        console.log("passwordHash :", passwordHash);
        const credentials = btoa(`${userName}:${passwordHash}`); // Base64 encode username and password
        console.log("credentials :", credentials);

        fetch(SIGNIN_API_URL[MODE], {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({
            userName: userName,
            password: passwordHash,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status >= 400 && response.status < 500) {
                setSuccessMessage("");
                setErrorMessage("Incorrect Username or Password");
              }
              throw new Error("Sign in Failure");
            } else {
              return response.json();
            }
          })
          .then((data) => {
            // Sign in is successull
            setErrorMessage("");
            setSuccessMessage("Success Sign in");
            localStorage.setItem("token", data.token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("fullName", data.fullName);
            localStorage.setItem("userid", data.userid);
            localStorage.setItem("userName", userName);
            navigate("/home");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  };
  const togglePasswordVisibility2 = (e) => {
    e.preventDefault();
    setIsPasswordVisible2(!isPasswordVisible2);
  };

  useEffect(() => {
    checkToken()
      .then((data) => {
        const tokenData = data;
        if (tokenData.tokenFound) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-16 h-16 mr-2" src="/images/greenVolt.jpg" alt="logo" />
            GreenVolt
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {isSignUp === true ? "Sign up your account" : "Sign in to your account"}
              </h1>
              <form className="space-y-4 md:space-y-6">
                {isSignUp && (
                  <div>
                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="userName"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your Username
                  </label>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="username"
                    required={true}
                  />
                </div>

                <div className="password-input-container relative">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={password}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button onClick={togglePasswordVisibility} className="password-toggle-button text-[0.8rem] absolute right-2 bottom-3">
                    {isPasswordVisible ? "hide" : "show"}
                  </button>
                </div>
                {isSignUp && (
                  <div className="relative">
                    <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Confirm Password
                    </label>
                    <input
                      type={isPasswordVisible2 ? "text" : "password"}
                      name="password2"
                      id="password2"
                      placeholder="••••••••"
                      value={password2}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                    <button onClick={togglePasswordVisibility2} className="password-toggle-button text-[0.8rem] absolute right-2 bottom-3">
                      {isPasswordVisible2 ? "hide" : "show"}
                    </button>
                  </div>
                )}

                <div className="text-sm text-red-500 font-bold">{errorMessage}</div>
                <div className="text-sm text-green-500 font-bold">{successMessage}</div>
                <button
                  className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={submitForm}
                >
                  {isSignUp ? "Sign Up" : "   Sign In"}
                </button>
                <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                  {isSignUp ? "Login with credentials" : "Don’t have an account yet?"}{" "}
                  <div onClick={toggleSignUp} className="inline font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer">
                    {isSignUp ? "Sign In" : "   Sign Up"}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
