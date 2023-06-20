import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  token: "",
  isLogedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const  AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  
  const userIsLoggedIn = !!token
  const loginHandler=(token)=>{
    setToken(token)
  }
  const logoutHandler=()=>{
    setToken(null)
    
  }
  const contextValue = {
    token:token,
    isLogedIn:userIsLoggedIn,
    login:loginHandler,
    logout:logoutHandler
  }
  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
