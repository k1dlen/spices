import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import FeatherIcon from "feather-icons-react";
import { CartContext } from "@components/context/Cart";
import Loader from "@components/common/Loader";

const Cart = () => {
  const {
    cartData,
    updateCartItem,
    deleteCartItem,
    subTotal,
    getItemTotal,
    totalDiscount,
    shippingCost,
    grandTotal,
    loader,
  } = useContext(CartContext);

  const handleQuantityChange = (item, newQty) => {
    const { id, quantity, product } = item;
    const reserve = product?.reserve ?? 1;
    if (newQty > reserve) {
      return;
    }
    if (newQty <= 0) {
      deleteCartItem(id);
    } else {
      updateCartItem(id, newQty);
    }
  };
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        {loader == true && <Loader />}
        {loader == false && cartData.length == 0 && (
          <div className="flex flex-col items-start  md:items-center">
            <h1 className="title mb-6">Корзина пуста</h1>
            <p className="text-text-default text-lg sm:text-xl md:text-2xl mb-6 text-left md:text-center">
              Похоже, вы ещё ничего не добавили в корзину. Посмотрите наш
              каталог — там много интересных специй и пряностей.
            </p>
            <Link to="/catalog" className="btn btn-primary">
              Перейти в каталог
            </Link>
          </div>
        )}
        {cartData.length > 0 && (
          <div>
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
                  {cartData &&
                    cartData.map((item) => {
                      return (
                        <tr
                          key={`cartItem-${item.product?.id}`}
                          className="border-b border-text-default/20"
                        >
                          <td className="py-6">
                            <div className="flex items-start gap-4">
                              <img
                                src={item.product?.image_url}
                                alt={item.product?.name}
                                className="w-1/4 h-auto object-contain rounded-md"
                              />
                              <div>
                                <h3 className="subtitle text-text-title font-playfair">
                                  {item.product?.name}
                                </h3>
                                <p className="text-text-default text-lg sm:text-xl md:text-2xl mt-1">
                                  {item.product?.grams}г.
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 text-center align-top xl:text-4xl lg:text-3xl">
                            {item.product.discount ? (
                              <span className="flex flex-col items-center">
                                <span className="line-through text-text-title/50 mr-1">
                                  ₽{item.product.price}
                                </span>
                                <span className="text-title font-semibold text-text-title">
                                  ₽
                                  {Math.round(
                                    item.product.price *
                                      (1 - item.product.discount / 100)
                                  ).toFixed(2)}
                                </span>
                              </span>
                            ) : (
                              <span className="font-semibold text-text-title">
                                ₽{item.product.price}
                              </span>
                            )}
                          </td>
                          <td className="py-6 text-center align-top xl:text-4xl lg:text-3xl">
                            <div className="inline-flex items-center gap-6 justify-center select-none text-text-title">
                              <span
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    item.quantity - 1
                                  )
                                }
                                className="font-light cursor-pointer hover:opacity-70 select-none"
                              >
                                −
                              </span>

                              <span className="font-semibold">
                                x {item.quantity}
                              </span>

                              <span
                                onClick={() =>
                                  handleQuantityChange(
                                    item,
                                    item.quantity + 1
                                  )
                                }
                                className={`font-light select-none transition-opacity ${
                                  item.quantity < item.product?.reserve
                                    ? "cursor-pointer hover:opacity-70"
                                    : "opacity-40 cursor-not-allowed"
                                }`}
                              >
                                +
                              </span>
                            </div>
                          </td>

                          <td className="py-6 text-center align-top xl:text-4xl lg:text-3xl text-text-title">
                            ₽{getItemTotal(item).toFixed(2)}
                          </td>
                          <td className="py-6 text-right align-top">
                            <button
                              onClick={() => deleteCartItem(item.id)}
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
                      );
                    })}
                </tbody>
              </table>

              <div className="w-[500px] max-w-[40%] flex-shrink-0 ml-auto mt-10">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-default">
                      Подытог
                    </span>
                    <span className="text-text-title font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                      ₽{subTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="!text-text-default !font-normal subtitle ">
                      Скидка
                    </span>
                    <span className="text-text-title subtitle">
                      ₽{totalDiscount().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span
                      className="relative flex items-center !text-text-default !font-normal subtitle group cursor-pointer"
                      onClick={() => setOpen((prev) => !prev)}
                      ref={tooltipRef}
                    >
                      Доставка
                      <span className="ml-1 mb-2 relative">
                        <FeatherIcon
                          icon="info"
                          strokeWidth={2.3}
                          className="w-5 h-auto text-text-default"
                        />

                        <span
                          className={`
                            absolute bottom-full z-50 mb-1 rounded-sm bg-primary px-2 py-1 text-xs text-bg-base transition-opacity duration-200
                            ${
                              open
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                            } 
                            group-hover:opacity-100 group-hover:visible
                            max-w-[calc(100vw-8px)]
                            left-1/2 transform -translate-x-1/2 break-words
                          `}
                        >
                          Стоимость доставки фиксированная — {shippingCost()} ₽.
                          <span className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></span>
                        </span>
                      </span>
                    </span>

                    <span className="text-text-title subtitle">
                      ₽{shippingCost().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-text-default/20 pt-2 font-semibold">
                    <span className="font-playfair font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-title">
                      Итого
                    </span>
                    <span className="font-semibold text-xl md:text-2xl lg:text-3xl xl:text-4xl text-text-title">
                      ₽{grandTotal().toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to={`/checkout`}
                    onClick={() => {
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 150);
                    }}
                    className="btn btn-primary items-start self-start  mt-4"
                  >
                    Оформить заказ
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:hidden flex flex-col gap-6">
              {cartData.map((item) => (
                <div
                  key={`cartItem-${item.product?.id}`}
                  className=" shadow-sm rounded-md py-4 px-3 sm:px-4 flex flex-col items-start sm:flex-row sm:items-start gap-4"
                >
                  <img
                    src={item.product?.image_url}
                    alt={item.product?.name}
                    className="w-full sm:w-1/4 h-auto object-contain rounded-md sm:mx-0"
                  />

                  <div className="w-full sm:flex-1 flex flex-col gap-2 text-left">
                    <h3 className="subtitle text-text-title font-playfair">
                      {item.product?.name}
                    </h3>
                    <p className="text-text-default text-lg">
                      {item.product?.grams}г.
                    </p>
                    <p className="text-text-title text-xl">
                      Цена:{" "}
                      {item.product.discount ? (
                        <>
                          <span className="line-through text-text-title/50">
                            ₽{item.product.price}
                          </span>{" "}
                          <span className="text-title font-semibold">
                            ₽
                            {Math.round(
                              item.product.price *
                                (1 - item.product.discount / 100)
                            ).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span>₽{item.product.price}</span>
                      )}
                    </p>

                    <p className="text-text-default text-xl flex items-center">
                      Количество:{" "}
                      <span
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1)
                        }
                        className="font-light text-5xl cursor-pointer hover:opacity-70 select-none"
                      >
                        −
                      </span>
                      <span className="font-semibold">x {item.quantity}</span>
                      <span
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                        className={`font-light select-none text-5xl transition-opacity ${
                          item.quantity < item.product?.reserve
                            ? "cursor-pointer hover:opacity-70"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        +
                      </span>
                    </p>
                    <p className="text-text-title text-xl">
                      Итог: ₽{getItemTotal(item).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteCartItem(item.id)}
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
                  <span className="text-text-default text-xl">Подытог:</span>
                  <span className="text-text-title font-semibold text-xl ml-2">
                    ₽{subTotal().toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-text-default text-xl">Скидка:</span>
                  <span className="text-text-title font-semibold text-xl ml-2">
                    ₽{totalDiscount().toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span
                    className="relative flex items-center text-xl cursor-pointer text-text-default group"
                    onClick={() => setOpen((prev) => !prev)}
                    ref={tooltipRef}
                  >
                    Доставка
                    <span className="mb-2 ml-[2px] relative">
                      <FeatherIcon
                        icon="info"
                        strokeWidth={2}
                        className="w-4 h-auto text-text-default"
                      />

                      <span
                        className={`
                          absolute bottom-full z-50 mb-1 rounded-sm bg-primary px-2 py-1 text-xs text-bg-base transition-opacity duration-200
                          ${
                            open ? "opacity-100 visible" : "opacity-0 invisible"
                          } 
                          group-hover:opacity-100 group-hover:visible
                          max-w-[calc(100vw-8px)]
                          left-1/2 transform -translate-x-1/2 break-words
                        `}
                      >
                        Стоимость доставки фиксированная — {shippingCost()} ₽.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></span>
                      </span>
                    </span>
                    :
                  </span>

                  <span className="text-text-title font-semibold text-xl ml-2">
                    ₽{shippingCost().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="flex justify-between mb-2">
                  <span className="text-text-default text-xl md:text-2xl">
                    Подытог
                  </span>
                  <span className="text-text-title font-semibold text-xl md:text-2xl">
                    ₽{subTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-default text-xl md:text-2xl">
                    Скидка
                  </span>
                  <span className="text-text-title font-semibold text-xl md:text-2xl">
                    ₽{totalDiscount().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span
                    className="relative flex items-center !text-text-default !font-normal subtitle cursor-pointer group"
                    onClick={() => setOpen((prev) => !prev)}
                    ref={tooltipRef}
                  >
                    Доставка
                    <span className="ml-1 mb-2 relative">
                      <FeatherIcon
                        icon="info"
                        strokeWidth={2.3}
                        className="w-5 h-auto text-text-default"
                      />

                      <span
                        className={`
                          absolute bottom-full z-50 mb-1 rounded-sm bg-primary px-2 py-1 text-xs text-bg-base transition-opacity duration-200
                          ${
                            open ? "opacity-100 visible" : "opacity-0 invisible"
                          } 
                          group-hover:opacity-100 group-hover:visible
                                              
                          max-w-[calc(100vw-8px)]
                          left-1/2 transform -translate-x-1/2 break-words
                        `}
                      >
                        Стоимость доставки фиксированная — {shippingCost()} ₽.
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></span>
                      </span>
                    </span>
                  </span>
                  <span className="text-text-title font-semibold text-xl md:text-2xl">
                    ₽{shippingCost().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-text-default/20">
                <div className="sm:hidden">
                  <span className="text-text-title font-playfair font-semibold text-xl">
                    Итого:
                  </span>
                  <span className="text-text-title font-semibold text-xl ml-2">
                    ₽{grandTotal().toFixed(2)}
                  </span>
                </div>
                <div className="hidden sm:flex justify-between">
                  <span className="text-text-title font-playfair font-semibold text-xl md:text-2xl">
                    Итого
                  </span>
                  <span className="text-text-title font-semibold text-xl md:text-2xl">
                    ₽{grandTotal().toFixed(2)}
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
        )}
      </div>
    </>
  );
};

export default Cart;
