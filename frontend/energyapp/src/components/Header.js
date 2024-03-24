import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../utils/HelperFunctions";
import { MODE, PROTECTED_API_URL } from "../utils/Constants";
import useLogout from "../utils/useLogout";

const Header = () => {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName");
  const logoutFromApp = useLogout();

  // Calling ProtectedAPI which reqired access token, if it's not fresh then use the refresh token from localStorage to get a new access token automatically.
  async function callProtectedAPI() {
    console.log("callingProtectedAPI....");
    let accessToken = localStorage.getItem("token");
    try {
      const response = await fetch(PROTECTED_API_URL[MODE], {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // Access token expired, try to refresh it
      if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          const response2 = await fetch(PROTECTED_API_URL[MODE], {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          const data2 = await response2.json();
          console.log("Protected api data after re-try :");
          console.log(data2);
        } else {
          logoutFromApp();
        }
      } else if (!response.ok) {
        throw new Error("Error in calling protected api");
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
