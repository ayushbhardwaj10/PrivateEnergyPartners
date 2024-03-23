import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName");
  const logoutFromApp = () => {
    localStorage.clear();
    navigate("/");
  };

  // Calling ProtectedAPI which reqired access token, if it's not fresh then use the refresh token from localStorage to get a new access token automatically.
  async function refreshAccessToken() {
    let refresh_token = localStorage.getItem("refresh_token");
    try {
      const response = await fetch("http://127.0.0.1:5000/refresh_token", {
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
    }
  }
  async function callProtectedAPI() {
    console.log("callingProtectedAPI....");
    let accessToken = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:5000/protected", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        // Access token expired, try to refresh it
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Store the new access token and retry the API call
          console.log("Old access token :" + localStorage.getItem("token"));
          console.log("new Access Token : " + newAccessToken);
          localStorage.setItem("token", newAccessToken);
          console.log("new Access token set to localStorage");
          // Retry the API call or perform other actions as needed
          const response2 = await fetch("http://127.0.0.1:5000/protected", {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          const data2 = await response2.json();
          console.log("Protected api data after re-try :");
          console.log(data2);
        } else {
          // Handle failure (e.g., redirect to login)
        }
      } else {
        // Handle successful response
        const data = await response.json();
        console.log("Successful protected api response :");
        console.log(data);
      }
    } catch (error) {
      console.error("Error calling protected API:", error);
    }
  }
  useEffect(() => {
    callProtectedAPI();
  }, []);

  return (
    <div className="md:flex md:justify-between md:h-20 md:px-10 md:items-center bg-white">
      <div className="flex items-center text-2xl font-semibold text-gray-900">
        <img className="w-16 h-16 " src="/images/greenVolt.jpg" alt="logo" />
        GreenVolt
      </div>
      <div className="flex justify-between p-2">
        <div className="md:px-7 flex items-center font-bold"> {fullName}</div>
        {/* <div className="font-bold md:px-7 cursor-pointer flex items-center">Favourites</div> */}
        <div className=" md:px-7 cursor-pointer bg-red-400 p-2 rounded-md text-white hover:bg-red-500" onClick={logoutFromApp}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Header;
