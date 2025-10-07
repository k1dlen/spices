import { createContext, useState } from "react";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const adminInfo = localStorage.getItem("adminInfo");
  const [user, setUser] = useState(adminInfo);

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
    localStorage.removeItem("adminInfo");
    setUser(null);
  };
  return (
    <AdminAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
