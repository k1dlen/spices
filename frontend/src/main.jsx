import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/style.css";
import App from "./App.jsx";
import { AdminAuthProvider } from "@components/context/AdminAuth";
import { AuthProvider } from "@components/context/Auth";
import { CartProvider } from "@components/context/Cart";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminAuthProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </AdminAuthProvider>
  </StrictMode>
);
