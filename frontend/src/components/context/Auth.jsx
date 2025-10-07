import { createContext, useState } from "react";
import { apiUrl } from "../common/http";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  const [user, setUser] = useState(userInfo);

  const login = (user) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      const token = user?.token;
      if (token) {
        await fetch(`${apiUrl}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.warn("Не удалось уведомить сервер о выходе");
    }
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
