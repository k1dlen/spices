import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Profile from "./components/profile/Profile";
import MyOrders from "./components/profile/MyOrders";
import Login from "./components/admin/Login";
import { default as UserLogin } from "./components/profile/Login";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/admin/Dashboard";
import { AdminRequireAuth } from "./components/admin/AdminRequireAuth";
import { RequireAuth } from "./components/profile/RequireAuth";
import Register from "./components/profile/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account/login" element={<UserLogin />} />
          <Route path="/account/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/profile/orders" element={<MyOrders />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRequireAuth>
                <Dashboard />
              </AdminRequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
