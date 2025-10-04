import React, { useState } from "react";
import { Link } from "react-router";
import { Layout } from "../common/Layout";
import AdminSidebar from "./common/AdminSidebar";

const pattern = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start mb-10 lg:mb-20">Title</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 shadow-sm rounded-md"></div>
        </div>
      </div>
    </Layout>
  );
};

export default pattern;
