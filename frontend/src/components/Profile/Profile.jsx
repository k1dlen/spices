import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { userToken, apiUrl } from "@components/common/http";
import UserSidebar from "@components/common/UserSidebar";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [loader, setLoader] = useState(false);
  const [disable, setDisable] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      mobile: "",
      address: "",
    },
  });

  const mobile = watch("mobile");

  const handlePhoneChange = (e) => {
    let numbers = e.target.value.replace(/\D/g, "");

    if (numbers.startsWith("7") || numbers.startsWith("8")) {
      numbers = numbers.substring(1);
    }

    numbers = numbers.substring(0, 10);

    let formatted = "";

    if (numbers.length > 0) {
      formatted += "+7 ";
      formatted += " (" + numbers.substring(0, 3);
    }
    if (numbers.length >= 4) {
      formatted += ") " + numbers.substring(3, 6);
    }
    if (numbers.length >= 7) {
      formatted += "-" + numbers.substring(6, 8);
    }
    if (numbers.length >= 9) {
      formatted += "-" + numbers.substring(8, 10);
    }

    setValue("mobile", formatted);
  };

  const updateUser = async (data) => {
    setDisable(true);
    try {
      const res = await fetch(`${apiUrl}/update-user`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        reset({
          name: result.data.name,
          surname: result.data.surname,
          email: result.data.email,
          mobile: result.data.mobile ?? mobile,
          address: result.data.address,
        });
        toast.success(
          result.message || "Данные о пользователе успешно обновлены"
        );
      } else {
        toast.error("Ошибка при обновлении данных пользователя");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setDisable(false);
    }
  };

  const fetchUser = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/getUserDetail`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setUserData(result.data);
        reset({
          name: result.data.name,
          surname: result.data.surname,
          email: result.data.email,
          mobile: result.data.mobile ?? mobile,
          address: result.data.address,
        });
      } else {
        toast.error("Ошибка при получении данных пользователя");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start mb-10">Личный кабинет</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <UserSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 shadow-sm rounded-md">
            <div className="p-4 lg:p-6">
              <h2 className="subtitle font-playfair mb-6">Мои данные</h2>
              {loader == true && <Loader />}
              {loader == false && !userData && (
                <Nostate text="Пользователь не был найден, попробуйте перезагрузить страницу." />
              )}
              {loader == false && userData && (
                <form onSubmit={handleSubmit(updateUser)}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 items-start">
                    <div className="flex flex-col gap-3 lg:gap-6">
                      <label
                        htmlFor="name"
                        className="text-text-title font-semibold text-lg sm:text-xl md:text-2xl"
                      >
                        Имя
                      </label>
                      <input
                        {...register("name", {
                          required: "Поле имя является обязательным",
                          maxLength: {
                            value: 50,
                            message: "Поле имя не должно превышать 50 символов",
                          },
                        })}
                        id="name"
                        type="text"
                        autoComplete="given-name"
                        className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.name ? "border-red-500" : "border-border-light"
                        }`}
                        placeholder="Ваше имя"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 lg:gap-6">
                      <label
                        htmlFor="email"
                        className="text-text-title font-semibold text-lg sm:text-xl md:text-2xl"
                      >
                        Эл. почта
                      </label>
                      <input
                        {...register("email", {
                          required: "Поле эл.почты является обязательным",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Недействительный адрес эл.почты",
                          },
                        })}
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.email
                            ? "border-red-500"
                            : "border-border-light"
                        }`}
                        placeholder="example@gmail.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 lg:gap-6">
                      <label
                        htmlFor="surname"
                        className="text-text-title font-semibold text-lg sm:text-xl md:text-2xl"
                      >
                        Фамилия
                      </label>
                      <input
                        {...register("surname", {
                          maxLength: {
                            value: 50,
                            message:
                              "Поле фамилия не должно превышать 50 символов",
                          },
                        })}
                        id="surname"
                        type="text"
                        autoComplete="family-name"
                        className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                          errors.surname
                            ? "border-red-500"
                            : "border-border-light"
                        }`}
                        placeholder="Фамилия (необязательно)"
                      />
                      {errors.surname && (
                        <p className="mt-1 text-sm text-red-500">
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
                          maxLength: {
                            value: 20,
                            message:
                              "Поле телефон не может быть больше, чем 20 символов",
                          },
                        })}
                        id="mobile"
                        value={mobile}
                        onChange={handlePhoneChange}
                        type="tel"
                        className={`border border-border-light p-2 text-sm sm:text-lg md:text-2xl rounded-md ${
                          errors.mobile ? "border-red-500" : ""
                        }`}
                        placeholder="+7 (999) 999-99-99 (необязательно)"
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
                        maxLength: {
                          value: 255,
                          message:
                            "Поле адреса не может быть больше, чем 255 символов",
                        },
                      })}
                      className={`border border-border-light p-2 text-sm sm:text-lg md:text-2xl rounded-md w-full ${
                        errors.address ? "border-red-500" : ""
                      }`}
                      name="address"
                      placeholder="Город, улица, дом, квартира (необязательно)"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">
                        {errors.address?.message}
                      </p>
                    )}
                  </div>
                  <button className="btn btn-primary mt-6">Обновить</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
