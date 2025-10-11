import React from "react";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
};
