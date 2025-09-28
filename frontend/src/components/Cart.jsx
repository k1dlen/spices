import React from "react";
import { Layout } from "./common/Layout";
import { Link } from "react-router";
import FeatherIcon from "feather-icons-react";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      image: "/src/assets/images/groundTurmeric.png",
      name: "Куркума молотая",
      weight: "100",
      price: 130.0,
      quantity: 2,
      total: 260.0,
    },
    {
      id: 2,
      image: "/src/assets/images/driedTumeric.png",
      name: "Куркума в корне",
      weight: "100",
      price: 100.0,
      quantity: 1,
      total: 100.0,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start mb-10 lg:mb-20">Корзина</h1>
        <div className="hidden lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-text-default/20">
                <th className="py-3 text-center text-text-default font-medium text-lg sm:text-xl md:text-2xl w-5/12">
                  Товар
                </th>
                <th className="py-3 text-center text-text-default font-medium text-lg sm:text-xl md:text-2xl w-2/12">
                  Цена
                </th>
                <th className="py-3 text-center text-text-default font-medium text-lg sm:text-xl md:text-2xl w-2/12">
                  Количество
                </th>
                <th className="py-3 text-center text-text-default font-medium text-lg sm:text-xl md:text-2xl w-2/12">
                  Итог
                </th>
                <th className="py-3 w-1/12"></th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="border-b border-text-default/20">
                  <td className="py-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-1/4 h-auto object-contain rounded-md"
                      />
                      <div>
                        <h3 className="subtitle text-text-title font-playfair">
                          {item.name}
                        </h3>
                        <p className="text-text-default text-lg sm:text-xl md:text-2xl mt-1">
                          {item.weight}г.
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 text-center align-top xl:text-4xl lg:text-3xl">
                    ₽{item.price.toFixed(2)}
                  </td>
                  <td className="py-6 text-center align-top xl:text-4xl lg:text-3xl">
                    x {item.quantity}
                  </td>
                  <td className="py-6 text-center align-top xl:text-4xl lg:text-3xl">
                    ₽{item.total.toFixed(2)}
                  </td>
                  <td className="py-6 text-right align-top">
                    <button
                      aria-label="Удалить из корзины"
                      className="text-text-default hover:text-red-500 transition-all duration-300"
                    >
                      <FeatherIcon
                        icon="trash"
                        strokeWidth={2.3}
                        className="w-9 h-auto"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden flex flex-col gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className=" shadow-sm rounded-md py-4 px-3 sm:px-4 flex flex-col items-start sm:flex-row sm:items-start gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full sm:w-1/4 h-auto object-contain rounded-md sm:mx-0"
              />

              <div className="w-full sm:flex-1 flex flex-col gap-2 text-left">
                <h3 className="subtitle text-text-title font-playfair">
                  {item.name}
                </h3>
                <p className="text-text-default text-lg">{item.weight}г.</p>
                <p className="text-text-title text-xl">
                  Цена: ₽{item.price.toFixed(2)}
                </p>
                <p className="text-text-default text-xl">
                  Количество: x {item.quantity}
                </p>
                <p className="text-text-title text-xl">
                  Итог: ₽{item.total.toFixed(2)}
                </p>
              </div>

              <button
                aria-label="Удалить из корзины"
                className="text-text-default hover:text-red-500 transition-all duration-300 sm:self-center mt-2 sm:mt-0"
              >
                <FeatherIcon
                  icon="trash"
                  strokeWidth={2.3}
                  className="w-9 h-auto"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
