import { createContext, useContext, useState } from "react";
import {
  getUser,
  setUser,
  removeUser,
  setToken,
  removeToken,
} from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(getUser());

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    setAuthUser(user);
  };

  const logout = () => {
    removeUser();
    removeToken();
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};