import React from "react";

import useLogout from "../utils/useLogout";

const Header = () => {
  const fullName = localStorage.getItem("fullName");
  const logoutFromApp = useLogout();

  return (
    <div className="md:flex md:justify-between md:h-20 md:px-10 md:items-center bg-white">
      <div className="flex items-center text-2xl font-semibold text-gray-900">
        <img className="w-16 h-16 " src="/images/greenVolt.jpg" alt="logo" />
        GreenVolt
      </div>
      <div className="flex justify-between p-2">
        <div className="md:px-7 flex items-center font-bold"> {fullName}</div>
        <div className=" md:px-7 cursor-pointer bg-red-400 p-2 rounded-md text-white hover:bg-red-500" onClick={logoutFromApp}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Header;
