import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/style.css";
import App from "./App.jsx";
import { AdminAuthProvider } from "./components/context/AdminAuth.jsx";
import { AuthProvider } from "./components/context/Auth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminAuthProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AdminAuthProvider>
  </StrictMode>
);
