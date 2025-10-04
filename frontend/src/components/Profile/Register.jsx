import React from "react";
import { Layout } from "../common/Layout";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../common/http";
import { toast } from "react-toastify";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);

        navigate("/profile");
      } else {
        const formErrors = result.errors;
        Object.keys(formErrors).forEach((field) => {
          setError(field, {
            message: formErrors[field][0],
          });
        });
      }
    } catch (error) {
      console.error("Network or parsing error");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start mb-10">Регистрация</h1>
        <div className="max-w-lg mx-auto">
          <div className="bg-bg-base rounded-md shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-text-title font-semibold text-lg sm:text-xl md:text-2xl"
                >
                  Имя
                </label>
                <input
                  {...register("name", {
                    required: "Поле имени является обязательным",
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

              <div className="flex flex-col gap-2">
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
                      message: "Поле фамилия не должно превышать 50 символов",
                    },
                  })}
                  id="surname"
                  type="text"
                  autoComplete="family-name"
                  className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                    errors.surname ? "border-red-500" : "border-border-light"
                  }`}
                  placeholder="Фамилия (необязательно)"
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.surname.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
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
                    errors.email ? "border-red-500" : "border-border-light"
                  }`}
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="group relative flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-text-title font-semibold text-lg sm:text-xl md:text-2xl"
                >
                  Пароль
                </label>
                <input
                  {...register("password", {
                    required: "Поле пароля является обязательным",
                    minLength: {
                      value: 12,
                      message: "Пароль должен быть минимум 12 символов",
                    },
                    validate: (value) => {
                      const regex =
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
                      return (
                        regex.test(value) ||
                        "Пароль должен содержать заглавные, строчные буквы, цифры и спецсимволы"
                      );
                    },
                  })}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                    errors.password ? "border-red-500" : "border-border-light"
                  }`}
                  placeholder="••••••••"
                />
                <div className="absolute left-0 top-full mt-1 bg-bg-base w-64 border rounded-md shadow-md p-2 text-sm text-gray-700 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition">
                  Пароль должен содержать:
                  <ul className="list-disc ml-4">
                    <li>Минимум 12 символов</li>
                    <li>Заглавные и строчные буквы</li>
                    <li>Цифры</li>
                    <li>Спецсимволы (!@#$%^&*)</li>
                  </ul>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password_confirmation"
                  className="text-text-title font-semibold text-lg sm:text-xl md:text-2xl"
                >
                  Подтверждение пароля
                </label>
                <input
                  {...register("password_confirmation", {
                    required: "Подтверждение пароля обязательно",
                    validate: (value) =>
                      value === password || "Пароли не совпадают",
                  })}
                  id="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary ${
                    errors.password_confirmation
                      ? "border-red-500"
                      : "border-border-light"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Зарегистрироваться
              </button>

              <div className="text-start sm:text-center pt-2">
                <p className="flex flex-wrap gap-x-2 gap-y-1 text-text-default text-lg sm:justify-center">
                  Уже есть аккаунт?
                  <Link
                    to="/account/login"
                    className="text-primary hover:text-primary-hover font-semibold transition-colors"
                  >
                    Войти
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
