import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/Auth";

const UserSidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  return (
    <>
      <div className="p-6 hidden lg:block">
        <ul>
          <li className="border-b border-text-default mb-2">
            <Link
              to="/profile"
              className="block px-2.5 py-2.5 text-text-default text-lg lg:text-xl xl:text-2xl hover:text-[var(--color-primary)] transition-colors"
            >
              Мои данные
            </Link>
          </li>
          <li className="border-b border-text-default mb-2">
            <Link
              to="/profile/orders"
              className="block px-2.5 py-2.5 text-text-default text-lg lg:text-xl xl:text-2xl hover:text-[var(--color-primary)] transition-colors"
            >
              Мои заказы
            </Link>
          </li>
          <li className="border-b border-text-default text-lg lg:text-xl xl:text-2xl mb-2">
            <Link
              onClick={logout}
              to="/"
              className="block px-2.5 py-2.5 text-text-default hover:text-[var(--color-primary)] transition-colors"
            >
              Выход
            </Link>
          </li>
        </ul>
      </div>
      <div className="lg:hidden">
        <div className="rounded-md shadow-sm">
          <div
            className="list-none p-4 font-semibold text-text-title cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            Меню аккаунта
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="p-4 pt-2 space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-text-default hover:text-[var(--color-primary)]"
                >
                  Мои данные
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/orders"
                  className="text-text-default hover:text-[var(--color-primary)]"
                >
                  Мои заказы
                </Link>
              </li>
              <li>
                <Link
                  to={`/`}
                  onClick={logout}
                  className="text-text-default hover:text-[var(--color-primary)] text-left w-full"
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

export default UserSidebar;
