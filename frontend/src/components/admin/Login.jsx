import React, { useContext } from "react";
import { AdminAuthContext } from "@components/context/AdminAuth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { apiUrl } from "@components/common/http";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AdminAuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        const adminInfo = {
          token: result.token,
          id: result.id,
          name: result.name,
        };

        localStorage.setItem("adminInfo", JSON.stringify(adminInfo));

        login(adminInfo);

        navigate("/admin/dashboard");
      } else {
        toast.error(result.message || "Ошибка авторизации");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start mb-10 lg:mb-20">Вход в админ панель</h1>
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
                <input
                  {...register("password", {
                    required: "Поле пароля является обязательным",
                  })}
                  id="password"
                  type="password"
                  className={`border rounded-md p-3 text-text-default text-lg sm:text-xl md:text-2xl focus:outline-none focus:ring-1 focus:ring-primary
                    ${
                      errors.password ? "border-red-500" : "border-border-light"
                    }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              <button className="btn btn-primary w-full">Войти</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
