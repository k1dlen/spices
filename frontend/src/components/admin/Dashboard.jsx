import React from "react";
import AdminSidebar from "../common/AdminSidebar";
import { Layout } from "../common/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start">Панель управления</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-10">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-bg-block shadow-sm rounded-lg flex flex-col justify-between border border-border-light">
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-text-title">0</h2>
                  <span className="text-text-default">Пользователи</span>
                </div>
                <div className="bg-bg-base p-4 rounded-b-lg border-t border-border-light">
                  <a
                    href="#"
                    className="text-text-title hover:text-primary transition-colors"
                  >
                    Просмотреть пользователей
                  </a>
                </div>
              </div>

              <div className="bg-bg-block shadow-sm rounded-lg flex flex-col justify-between border border-border-light">
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-text-title">0</h2>
                  <span className="text-text-default">Заказы</span>
                </div>
                <div className="bg-bg-base p-4 rounded-b-lg border-t border-border-light">
                  <a
                    href="#"
                    className="text-text-title hover:text-primary transition-colors"
                  >
                    Просмотреть заказы
                  </a>
                </div>
              </div>

              <div className="bg-bg-block shadow-sm rounded-lg flex flex-col justify-between border border-border-light">
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-text-title">0</h2>
                  <span className="text-text-default">Продукты</span>
                </div>
                <div className="bg-bg-base p-4 rounded-b-lg border-t border-border-light">
                  <a
                    href="#"
                    className="text-text-title hover:text-primary transition-colors"
                  >
                    Просмотреть продукты
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
