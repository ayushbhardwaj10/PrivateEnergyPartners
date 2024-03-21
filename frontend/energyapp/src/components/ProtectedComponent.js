import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../utils/HelperFunctions";

const ProtectedComponent = ({ Component }) => {
  const navigate = useNavigate();
  // Added state to track whether the check has been completed and if it's valid
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const result = await checkToken();
      if (result.tokenFound !== 1) {
        navigate("/");
      } else {
        setIsTokenVerified(true); // Set token as verified only if tokenFound == 1
      }
    };

    verifyToken();
  }, [navigate]);

  if (!isTokenVerified) return null; // Don't render anything if token hasn't been verified or is invalid

  return <Component />;
};

export default ProtectedComponent;
