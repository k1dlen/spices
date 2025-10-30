import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { apiUrl } from "@components/common/http";
import { toast } from "react-toastify";
import { AuthContext } from "@components/context/Auth";
import FeatherIcon from "feather-icons-react";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        const userInfo = {
          token: result.token,
          id: result.id,
          name: result.name,
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        login(userInfo);

        navigate("/profile");
      } else {
        toast.error(result.message || "Ошибка авторизации");
      }
    } catch (error) {
      console.error("Network or parsing error");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start mb-10">Вход в личный кабинет</h1>
        <div className="max-w-lg mx-auto">
          <div className="rounded-md shadow-sm p-6 ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary
                    ${errors.email ? "border-red-500" : "border-border-light"}`}
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-text-title font-semibold text-lg sm:text-xl md:text-2xl"
                >
                  Пароль
                </label>
                <div className="relative w-full">
                  <input
                    {...register("password", {
                      required: "Поле пароля является обязательным",
                    })}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`border rounded-md w-full p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary
                    ${
                      errors.password ? "border-red-500" : "border-border-light"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary focus:outline-none"
                  >
                    {showPassword ? (
                      <FeatherIcon icon="eye" className="h-4 w-auto" />
                    ) : (
                      <FeatherIcon icon="eye-off" className="h-4 w-auto" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              <button className="btn btn-primary w-full">Войти</button>

              <div className="text-start sm:text-center  pt-2">
                <p className="flex flex-wrap gap-x-2 gap-y-1 text-text-default text-lg sm:justify-center">
                  Нет аккаунта?
                  <Link
                    to="/account/register"
                    className="text-primary hover:text-primary-hover font-semibold transition-colors"
                  >
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
