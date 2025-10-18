import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@components/context/Auth";
import { apiUrl } from "@components/common/http";
import { toast } from "react-toastify";

const RouteTokenChecker = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) return;

    const { token } = JSON.parse(userInfo);
    if (!token) return;

    const validateToken = async () => {
      try {
        const res = await fetch(`${apiUrl}/user`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          toast.info("Сессия истекла. Пожалуйста, войдите снова.");
          logout();
        }
      } catch (err) {
        console.warn("Не удалось проверить токен");
      }
    };

    validateToken();
  }, [location, logout]);

  return null;
};

export default RouteTokenChecker;
