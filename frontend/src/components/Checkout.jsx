import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "@components/context/Cart";
import Loader from "@components/common/Loader";
import { useNavigate } from "react-router";
import { set, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { userToken, apiUrl } from "@components/common/http";

const Checkout = () => {
  const { cartData, grandTotal, loader, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [disable, setDisable] = useState(false);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    if (digits.length > 0 && !digits.startsWith("7")) {
      digits = "7" + digits;
    }

    if (digits.length > 11) {
      digits = digits.slice(0, 11);
    }

    let formatted = "";
    if (digits) {
      formatted = "+7";
      const rest = digits.slice(1);
      if (rest.length > 0) formatted += " (" + rest.slice(0, 3);
      if (rest.length >= 4) formatted += ") " + rest.slice(3, 6);
      if (rest.length >= 7) formatted += "-" + rest.slice(6, 8);
      if (rest.length >= 9) formatted += "-" + rest.slice(8, 10);
    }

    setValue("mobile", formatted);
  };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      address: "",
      mobile: "",
      payment_method: "cash_on_place",
    },
  });

  const payment_method = watch("payment_method");
  const mobile = watch("mobile");

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-user-detail`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        reset({
          name: result.data.name,
          surname: result.data.surname,
          email: result.data.email,
          address: result.data.address,
          mobile: result.data.mobile,
        });
      } else {
        toast.error("Ошибка при получении данных пользователя");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const saveOrder = async (formData) => {
    setDisable(true);
    try {
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Заказ успешно создан");
        clearCart();
        navigate(`/confirmation/${result.id}`);
      } else {
        toast.error("Ошибка при создании заказа");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setDisable(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start mb-10">Оформление заказа</h1>
        <form onSubmit={handleSubmit(saveOrder)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="col-span-1 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 shadow-sm rounded-md">
              <div className="p-6">
                <h2 className="subtitle font-playfair mb-6">
                  Контактные данные
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 items-start">
                  <div className="flex flex-col gap-3 lg:gap-6">
                    <label className="text-sm sm:text-lg md:text-2xl font-semibold">
                      Имя
                    </label>
                    <input
                      {...register("name", {
                        required: "Поле имя является обязательным",
                        maxLength: {
                          value: 50,
                          message: "Поле имя не должно превышать 50 символов",
                        },
                        validate: (value) =>
                          /^[A-Za-zА-Яа-яЁё\s-]+$/.test(value) ||
                          "Имя должно содержать только буквы",
                      })}
                      type="text"
                      className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                        errors.name ? "border-red-500" : "border-border-light"
                      }`}
                      placeholder="Ваше имя"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 lg:gap-6">
                    <label className="text-sm sm:text-lg md:text-2xl font-semibold">
                      Эл.почта
                    </label>
                    <input
                      {...register("email", {
                        required: "Поле адрес эл.почты является обязательным",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Неверно указан адрес эл.почты",
                        },
                      })}
                      type="email"
                      className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                        errors.email ? "border-red-500" : "border-border-light"
                      }`}
                      placeholder="example@gmail.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 lg:gap-6">
                    <label className="text-sm sm:text-lg md:text-2xl font-semibold">
                      Фамилия
                    </label>
                    <input
                      {...register("surname", {
                        maxLength: {
                          value: 50,
                          message:
                            "Поле фамилия не должно превышать 50 символов",
                        },
                        validate: (value) => {
                          if (!value || value.trim() === "") {
                            return true;
                          }
                          return (
                            /^[A-Za-zА-Яа-яЁё\s-]+$/.test(value) ||
                            "Фамилия должна содержать только буквы"
                          );
                        },
                      })}
                      type="text"
                      className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                        errors.surname
                          ? "border-red-500"
                          : "border-border-light"
                      }`}
                      placeholder="Ваша фамилия"
                    />
                    {errors.surname && (
                      <p className="text-red-500 text-sm">
                        {errors.surname.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 lg:gap-6">
                    <label
                      htmlFor="mobile"
                      className="text-sm sm:text-lg md:text-2xl font-semibold"
                    >
                      Телефон
                    </label>
                    <input
                      {...register("mobile", {
                        required: "Поле телефона является обязательным",
                      })}
                      id="mobile"
                      value={mobile ?? ""}
                      onChange={handlePhoneChange}
                      type="tel"
                      className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                        errors.mobile ? "border-red-500" : "border-border-light"
                      }`}
                      placeholder="+7 (999) 999-99-99"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-sm">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="subtitle font-playfair mb-6">
                    Адрес доставки
                  </h3>
                  <textarea
                    {...register("address", {
                      required: "Поле адреса является обязательным",
                      validate: (value) =>
                        /^[A-Za-zА-Яа-яЁё0-9\s.,:/№-]+$/.test(value) ||
                        "Адрес должен содержать только буквы, цифры, пробелы и допустимые знаки препинания (.,:/№-)",
                    })}
                    className={`border p-3 text-lg sm:text-xl md:text-2xl text-text-default rounded-md w-full ${
                      errors.address ? "border-red-500" : "border-border-light"
                    }`}
                    placeholder="Город, улица, дом, квартира"
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address?.message}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="subtitle font-playfair mb-4">Способ оплаты</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 border border-border-light rounded-md">
                      <input
                        type="radio"
                        id="cash_on_place"
                        value="cash_on_place"
                        {...register("payment_method", {
                          required: "Выберите способ оплаты",
                        })}
                        className="accent-primary"
                      />
                      <label
                        htmlFor="cash_on_place"
                        className="text-lg sm:text-xl md:text-2xl text-text-title"
                      >
                        Наличными при получении
                      </label>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-border-light rounded-md">
                      <input
                        type="radio"
                        id="card_on_place"
                        value="card_on_place"
                        {...register("payment_method", {
                          required: "Выберите способ оплаты",
                        })}
                        className="accent-primary"
                      />
                      <label
                        htmlFor="card_on_place"
                        className="text-lg sm:text-xl md:text-2xl text-text-title"
                      >
                        Картой при получении
                      </label>
                    </div>
                  </div>
                  {errors.payment_method && (
                    <p className="text-red-500 text-sm">
                      {errors.payment_method.message}
                    </p>
                  )}
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
                  disabled={disable}
                  className="btn btn-primary  sm:w-full mt-6 text-xl xl:text-2xl"
                >
                  {disable ? "Обработка..." : "Подтвердить"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
