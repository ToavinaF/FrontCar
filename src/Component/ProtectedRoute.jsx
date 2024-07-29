import { Navigate } from "react-router-dom";
import { TokenContext } from "../TokenContext";
import { useContext } from "react";
import { getToken } from "../utils/common";

const ProtectedRoute = ({ children}) => {
  const [isToken] = useContext(TokenContext);

  if (!isToken) {
    return <Navigate to=".." />;
  }



  return children;
};

export default ProtectedRoute;