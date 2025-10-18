import React, { lazy, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import AdminSidebar from "@components/common/AdminSidebar";
import { adminToken, apiUrl } from "@components/common/http";
import { useForm } from "react-hook-form";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import CustomSelect from "@components/common/CustomSelect";
import { toast } from "react-toastify";

const Details = () => {
  const [disable, setDisable] = useState(false);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "pending",
      payment_status: "not_paid",
      cancellation_reason: null,
    },
  });

  const status = watch("status");
  const payment_status = watch("payment_status");

  const fetchOrder = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setOrder(result.data);
        setItems(result.data.items);
        reset({
          status: result.data.status,
          payment_status: result.data.payment_status,
          cancellation_reason: result.data?.cancellation_reason,
        });
      } else {
        toast.error("Ошибка при получении заказа");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setLoader(false);
    }
  };

  const updateOrder = async (data) => {
    setDisable(true);
    try {
      const res = await fetch(`${apiUrl}/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Статус был успешно изменен");
        navigate("/admin/orders");
      } else {
        toast.error("Ошибка при изменении статуса");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setDisable(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start mb-10">Заказы</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 shadow-sm rounded-md p-4">
            <h2 className="subtitle font-playfair">Детали заказа</h2>
            {loader == true && <Loader />}
            {loader == false && order == null && (
              <>
                <Nostate text={`Заказ с номером ${id} не найден`} />
                <Link
                  to="/admin/orders"
                  className="btn btn-secondary self-start text-center min-w-32 sm:min-w-0"
                >
                  Назад
                </Link>
              </>
            )}
            {!loader && order && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-text-default/20 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Заказ #{order.id}</h3>

                    {order.status === "pending" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                        В ожидании
                      </span>
                    )}
                    {order.status === "shipped" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        Отправлен
                      </span>
                    )}
                    {order.status === "delivered" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                        Доставлен
                      </span>
                    )}
                    {order.status === "cancelled" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                        Отменён
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-text-default text-sm">Дата заказа</div>
                    <div className="text-lg font-medium">
                      {order.created_at}
                    </div>
                  </div>

                  <div>
                    <div className="text-text-default text-sm">Оплата</div>
                    {order.payment_status === "paid" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                        Оплачен
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                        Не оплачен
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="font-semibold">Имя: {order.name}</div>
                    {order.surname && (
                      <div className="font-semibold">
                        Фамилия: {order.surname}
                      </div>
                    )}
                    <div className="text-text-default">
                      Эл.почта: {order.email}
                    </div>
                    <div className="text-sm">Адрес: {order.address}</div>
                    <div className="text-sm">Телефон: {order.mobile}</div>
                  </div>
                  <div>
                    <div className="text-text-default">Метод оплаты</div>
                    <div className="font-medium">
                      {order.payment_status === "card_on_place" ? (
                        <span>Картой при получении </span>
                      ) : (
                        <span>Наличными при получении</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Товары</h3>
                  <div className="divide-y divide-text-default/20">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:py-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          {item.product.image_url && (
                            <img
                              src={item.product.image_url}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded sm:mr-3 "
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {item.product_name}
                            </div>
                            <div className="text-sm text-text-default">
                              {item.product.grams}г.
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-sm text-text-default">
                            Кол-во: x{item.quantity}
                          </div>
                          <div className="font-semibold">
                            {item.total_price} ₽
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-text-default/20 pt-2 space-y-1 hidden sm:block">
                  <div className="flex justify-between">
                    <span>Подытог</span>
                    <span>{order.subtotal} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Скидка</span>
                    <span>{order.discount} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span>{order.shipping} ₽</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t border-text-default/20 pt-2">
                    <span>Итого</span>
                    <span>{order.grand_total} ₽</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-text-default/20 pt-2 space-y-1 sm:hidden">
                  <div className="flex flex-start">
                    <span className="mr-1">Подытог:</span>
                    <span>{order.subtotal} ₽</span>
                  </div>
                  <div className="flex flex-start">
                    <span className="mr-1">Скидка:</span>
                    <span>{order.discount} ₽</span>
                  </div>
                  <div className="flex flex-start">
                    <span className="mr-1">Доставка:</span>
                    <span>{order.shipping} ₽</span>
                  </div>
                  <div className="flex flex-start font-semibold text-lg border-t border-text-default/20 pt-2">
                    <span className="mr-1">Итого:</span>
                    <span>{order.grand_total} ₽</span>
                  </div>
                </div>
              </div>
            )}

            {order && (
              <div className="space-y-6">
                <h2 className="subtitle font-playfair">
                  Обновить статус заказа
                </h2>
                <form
                  onSubmit={handleSubmit(updateOrder)}
                  className="flex flex-col gap-4"
                >
                  <CustomSelect
                    {...register("status", {
                      required: "Поле статус явялется обязательным",
                    })}
                    label="Статус"
                    name="status"
                    options={[
                      { value: "pending", label: "В ожидании" },
                      { value: "shipped", label: "Отправлен" },
                      { value: "delivered", label: "Доставлен" },
                      { value: "cancelled", label: "Отменен" },
                    ]}
                    value={status}
                    onChange={(value) => setValue("status", value)}
                    error={errors.status?.message}
                  />

                  {status === "cancelled" && (
                    <div>
                      <label className="text-sm sm:text-lg md:text-2xl font-semibold mb-2">
                        Причина
                      </label>
                      <input
                        {...register("cancellation_reason", {
                          required: "Введите причину отмены заказа",
                        })}
                        name="cancellation_reason"
                        type="text"
                        className={`border border-border-light focus:outline-none focus:ring-1 focus:ring-primary mt-2 p-2 rounded-md text-sm sm:text-lg md:text-2xl w-full ${
                          errors.cancellation_reason ? "border-red-500" : ""
                        }`}
                        placeholder="Причина отмены заказа"
                      />
                      {errors.cancellation_reason && (
                        <p className="text-red-500 text-sm">
                          {errors.cancellation_reason.message}
                        </p>
                      )}
                    </div>
                  )}

                  <CustomSelect
                    {...register("payment_status", {
                      required: "Поле статус оплаты явялется обязательным",
                    })}
                    label="Статус оплаты"
                    name="payment_status"
                    options={[
                      { value: "paid", label: "Оплачен" },
                      { value: "not_paid", label: "Не оплачен" },
                    ]}
                    value={payment_status}
                    onChange={(value) => setValue("payment_status", value)}
                    error={errors.payment_status?.message}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Link
                      to="/admin/orders"
                      className="btn btn-secondary self-start text-center min-w-32"
                    >
                      Назад
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary self-start min-w-32"
                    >
                      Обновить
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
