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
        <h1 className="title text-start mb-10">Корзина</h1>
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

          <div className="w-[500px] max-w-[40%] flex-shrink-0 ml-auto mt-10">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between mb-2">
                <span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-default">
                  Сумма
                </span>
                <span className="text-text-title font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                  ₽{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="!text-text-default !font-normal subtitle ">
                  Скидка
                </span>
                <span className="text-text-title subtitle">
                  ₽{discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-text-default/20 pt-2 font-semibold">
                <span className="font-playfair font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-title">
                  Итого
                </span>
                <span className="font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-title">
                  ₽{total.toFixed(2)}
                </span>
              </div>

              <Link
                to={`/checkout`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="btn btn-primary items-start self-start  mt-4"
              >
                Оформить заказ
              </Link>
            </div>
          </div>
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

        <div className="rounded-md p-4 shadow-sm mt-10 lg:hidden">
          <div className="sm:hidden space-y-1 mb-3">
            <div>
              <span className="text-text-default text-xl">Сумма:</span>
              <span className="text-text-title font-semibold text-xl ml-2">
                ₽{subtotal.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-text-default text-xl">Скидка:</span>
              <span className="text-text-title font-semibold text-xl ml-2">
                ₽{discount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="flex justify-between mb-2">
              <span className="text-text-default text-xl md:text-2xl">
                Сумма
              </span>
              <span className="text-text-title font-semibold text-xl md:text-2xl">
                ₽{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-text-default text-xl md:text-2xl">
                Скидка
              </span>
              <span className="text-text-title font-semibold text-xl md:text-2xl">
                ₽{discount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-text-default/20">
            <div className="sm:hidden">
              <span className="text-text-title font-playfair font-semibold text-xl">
                Итого:
              </span>
              <span className="text-text-title font-semibold text-xl ml-2">
                ₽{total.toFixed(2)}
              </span>
            </div>
            <div className="hidden sm:flex justify-between">
              <span className="text-text-title font-playfair font-semibold text-xl md:text-2xl">
                Итого
              </span>
              <span className="text-text-title font-semibold text-xl md:text-2xl">
                ₽{total.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            to={`/checkout`}
            className="btn btn-primary sm:w-full sm:text-center mt-4"
          >
            Оформить заказ
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
