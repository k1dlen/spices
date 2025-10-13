import React, { useContext } from "react";
import { Layout } from "@components/common/Layout";
import { CartContext } from "@components/context/Cart";
import Loader from "@components/common/Loader";

const Checkout = () => {
  const { cartData, grandTotal, loader } = useContext(CartContext);

  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start mb-10">Оформление заказа</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 shadow-sm rounded-md">
            <div className="p-6">
              <h2 className="subtitle font-playfair mb-6">Контактные данные</h2>
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
                    className="border border-border-light p-2 text-sm sm:text-lg md:text-2xl rounded-md"
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
                    className="border border-border-light p-2 text-sm sm:text-lg md:text-2xl rounded-md"
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
                    className="border border-border-light p-2 text-sm sm:text-lg md:text-2xl  rounded-md"
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
                    className="border border-border-light p-2 text-sm sm:text-lg md:text-2xl rounded-md"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
              </div>
              <div className="mt-6">
                <h3 className="subtitle font-playfair mb-6">Адрес доставки</h3>
                <textarea
                  className="border border-border-light p-2 text-sm sm:text-lg md:text-2xl rounded-md w-full "
                  placeholder="Город, улица, дом, квартира"
                  rows={3}
                />
              </div>
              <div className="mt-6">
                <h3 className="subtitle font-playfair mb-4">Способ оплаты</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-2 border border-border-light rounded-md">
                    <input
                      type="radio"
                      name="payment"
                      id="cash"
                      defaultChecked
                      className="accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor="cash"
                      className="text-sm sm:text-lg md:text-2xl"
                    >
                      Наличными при получении
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-2 border border-border-light rounded-md">
                    <input
                      type="radio"
                      name="payment"
                      id="card"
                      className="accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor="card"
                      className="text-sm sm:text-lg md:text-2xl"
                    >
                      Картой при получении
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 shadow-sm rounded-md">
            <div className="p-6">
              <h3 className="subtitle font-playfair mb-4">Ваш заказ</h3>
              <div className="space-y-4">
                {loader == true && <Loader />}
                {cartData.map((item) => (
                  <div key={item.product.id}>
                    <div className="sm:hidden flex flex-col items-start gap-2">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-20 h-auto object-contain rounded-md"
                      />
                      <h4 className="text-text-title font-semibold text-lg">
                        {item.product.name}
                      </h4>
                      <p className="text-text-default text-lg">
                        {item.quantity} × {item.product.price}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-start gap-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-20 h-auto object-contain rounded-md flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-text-title font-semibold text-lg lg:text-xl xl:text-2xl">
                          {item.product.name}
                        </h4>
                        <p className="text-text-default text-lg lg:text-xl xl:text-2xl mt-1">
                          {item.quantity} × {item.product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-text-default/20 pt-4 mt-4">
                <div className="flex sm:justify-between">
                  <span className="text-text-title hidden sm:block pe-2 sm:pe-0 font-semibold text-lg lg:text-xl xl:text-2xl">
                    Итого
                  </span>
                  <span className="text-text-title pe-2 sm:hidden font-semibold text-lg lg:text-xl xl:text-2xl">
                    Итого:
                  </span>
                  <span className="text-text-title font-semibold text-lg lg:text-xl xl:text-2xl">
                    ₽{grandTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-primary  sm:w-full mt-6 text-xl xl:text-2xl"
                onClick={() => alert("Заказ оформлен!")}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
