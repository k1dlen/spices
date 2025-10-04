import React, { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router";
import { AdminAuthContext } from "../context/AdminAuth";

const AdminSidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AdminAuthContext);
  return (
    <>
      <div className="p-6 hidden lg:block">
        <ul>
          <li className="border-b border-text-default mb-2">
            <Link
              to="/admin/dashboard"
              className="block px-2.5 py-2.5 text-text-default text-lg lg:text-xl xl:text-2xl hover:text-primary transition-colors"
            >
              Панель управления
            </Link>
          </li>
          <li className="border-b border-text-default mb-2">
            <Link
              to="/admin/categories"
              className="block px-2.5 py-2.5 text-text-default text-lg lg:text-xl xl:text-2xl hover:text-primary transition-colors"
            >
              Категории
            </Link>
          </li>
          <li className="border-b border-text-default mb-2">
            <Link
              to="/"
              className="block px-2.5 py-2.5 text-text-default text-lg lg:text-xl xl:text-2xl hover:text-primary transition-colors"
            >
              Товары
            </Link>
          </li>
          <li className="border-b border-text-default mb-2">
            <Link
              to="/"
              className="block px-2.5 py-2.5 text-text-default text-lg lg:text-xl xl:text-2xl hover:text-primary transition-colors"
            >
              Заказы
            </Link>
          </li>
          <li className="border-b border-text-default mb-2">
            <Link
              to="/"
              className="block px-2.5 py-2.5 text-text-default text-lg lg:text-xl xl:text-2xl hover:text-primary transition-colors"
            >
              Пользователи
            </Link>
          </li>
          <li className="border-b border-text-default text-lg lg:text-xl xl:text-2xl mb-2">
            <Link
              onClick={logout}
              to="/"
              className="block px-2.5 py-2.5 text-text-default hover:text-primary transition-colors"
            >
              Выход
            </Link>
          </li>
        </ul>
      </div>
      <div className="lg:hidden mb-6">
        <div className="rounded-md shadow-sm">
          <div
            className="list-none p-4 font-semibold text-text-title cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Панель управления
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="p-4 pt-2 space-y-2">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="text-text-default hover:text-primary"
                >
                  Панель управления
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/categories"
                  className="text-text-default hover:text-primary"
                >
                  Категории
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="text-text-default hover:text-primary"
                >
                  Товары
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="text-text-default hover:text-primary"
                >
                  Заказы
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="text-text-default hover:text-primary"
                >
                  Пользователи
                </Link>
              </li>
              <li>
                <Link
                  onClick={logout}
                  to={`/`}
                  className="text-text-default hover:text-primary text-left w-full"
                >
                  Выход
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
