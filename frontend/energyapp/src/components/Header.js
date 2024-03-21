import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName");
  const logoutFromApp = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = async () => {
    console.log("Calling protected");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:5000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // if (!response.ok) throw new Error("Fetching data failed");

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <div className="md:flex md:justify-between p-4">
      <div>Welcome {fullName}</div>
      <div className="flex sm:justify-evenly justify-between">
        <div className="font-bold md:px-7">Favourites</div>
        <div className="font-bold md:px-7 cursor-pointer" onClick={logoutFromApp}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Header;
