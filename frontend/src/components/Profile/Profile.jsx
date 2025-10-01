import React, { useState } from "react";
import { Link } from "react-router";
import { Layout } from "../common/Layout";
import UserSidebar from "../common/UserSidebar";

const Profile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start mb-10 lg:mb-20">Личный кабинет</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <UserSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 shadow-sm rounded-md">
            <div className="p-4 lg:p-6">
              <h2 className="subtitle font-playfair mb-6">Мои данные</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 items-start">
                <div className="flex flex-col gap-3 lg:gap-6">
                  <label
                    htmlFor=""
                    className="text-sm sm:text-lg md:text-2xl font-semibold"
                  >
                    Имя
                  </label>
                  <input
                    type="text"
                    className="border p-2 text-sm sm:text-lg md:text-2xl rounded-md"
                    placeholder="Ваше имя"
                  />
                </div>
                <div className="flex flex-col gap-3 lg:gap-6">
                  <label
                    htmlFor=""
                    className="text-sm sm:text-lg md:text-2xl font-semibold"
                  >
                    Эл.почта
                  </label>
                  <input
                    type="email"
                    className="border p-2 text-sm sm:text-lg md:text-2xl rounded-md"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="flex flex-col gap-3 lg:gap-6">
                  <label
                    htmlFor=""
                    className="text-sm sm:text-lg md:text-2xl font-semibold"
                  >
                    Фамилия
                  </label>
                  <input
                    type="text"
                    className="border p-2 text-sm sm:text-lg md:text-2xl  rounded-md"
                    placeholder="Фамилия пользователя"
                  />
                </div>
                <div className="flex flex-col gap-3 lg:gap-6">
                  <label
                    htmlFor=""
                    className="text-sm sm:text-lg md:text-2xl font-semibold"
                  >
                    Телефон
                  </label>
                  <input
                    type="tel"
                    className="border p-2 text-sm sm:text-lg md:text-2xl rounded-md"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="subtitle font-playfair mb-6">Адрес доставки</h3>
                <textarea
                  className="border p-2 text-sm sm:text-lg md:text-2xl rounded-md w-full "
                  placeholder="Город, улица, дом, квартира"
                  rows={3}
                />
              </div>
              <button className="btn btn-primary mt-6">Обновить</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
