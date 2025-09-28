import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import Product from "./components/Product";
import Cart from "./components/Cart";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
