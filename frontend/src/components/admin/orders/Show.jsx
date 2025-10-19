import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { adminToken, apiUrl } from "@components/common/http";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { toast } from "react-toastify";
import AdminSidebar from "@components/common/AdminSidebar";
import FeatherIcon from "feather-icons-react";

const Show = () => {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

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

  const fetchOrders = async (page) => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/orders?page=${page}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setOrders(result.data);
        setMeta(result.meta);
      } else {
        toast.error("Ошибка при получении заказов");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setLoader(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= meta.last_page) {
      fetchOrders(page);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);
  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start mb-10">Заказы</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
            {loader == true && <Loader />}
            {loader == false && orders.length == 0 && (
              <div className="shadow-sm">
                <Nostate text="Нет найденных заказов" />
              </div>
            )}
            <div className="hidden sm:block shadow-sm rounded-md overflow-x-auto">
              {orders.length > 0 && (
                <table className="min-w-full divide-y divide-border-light rounded-md">
                  <thead className="bg-bg-block">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-16">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title">
                        Клиент
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Сумма
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Оплата
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Статус
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light bg-bg-base">
                    {orders.map((order) => (
                      <tr
                        key={`order-${order.id}`}
                        className="hover:bg-bg-block/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-text-default text-lg">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 text-text-default text-lg">
                          {order.name}
                          <div className="text-sm text-text-muted">
                            {order.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-default text-lg">
                          {order.grand_total} ₽
                        </td>
                        <td className="px-4 py-3">
                          {order.payment_status === "paid" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                              Оплачен
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                              Не оплачен
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
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
                            <div
                              className="inline-flex items-center gap-1 relative cursor-pointer group"
                              ref={tooltipRef}
                              onClick={() => setOpen((prev) => !prev)}
                            >
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                                Отменён
                                {order.cancellation_reason && (
                                  <FeatherIcon
                                    icon="info"
                                    strokeWidth={2.3}
                                    className="w-4 h-auto"
                                  />
                                )}
                              </span>

                              {order.cancellation_reason && (
                                <span
                                  className={`
                                    absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-50 group-hover:opacity-100 group-hover:visible max-w-[calc(100vw-8px)] rounded-sm bg-red-100 text-red-800 px-2 py-1 text-xs transition-opacity duration-200
                                    ${
                                      open
                                        ? "opacity-100 visible"
                                        : "opacity-0 invisible"
                                    }
                                  `}
                                >
                                  Причина: {order.cancellation_reason}
                                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></span>
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="px-4 py-3 flex items-center space-x-3">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary hover:text-primary-hover transition-colors"
                              title="Подробнее"
                            >
                              <FeatherIcon icon="eye" className="w-5 h-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="sm:hidden flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={`order-card-${order.id}`}
                  className="bg-bg-base rounded-md shadow-sm p-4 cursor-pointer transition hover:shadow-md"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <div className="text-text-title font-semibold">
                    Заказ #{order.id}
                  </div>
                  <div className="mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.payment_status === "paid"
                        ? "Оплачен"
                        : "Не оплачен"}
                    </span>
                  </div>
                  <div className="text-text-default text-lg font-medium">
                    Имя: {order.name}
                  </div>
                  <div className="text-text-default text-lg font-medium mb-2">
                    Фамилия: {order.surname}
                  </div>
                  <div className="text-sm text-text-muted mb-2">
                    Эл.почта: {order.email}
                  </div>
                  <div className="text-sm mb-2">
                    Сумма: {order.grand_total} ₽
                  </div>
                  <div className="text-sm mb-2">
                    Статус:{" "}
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
                  {order.status === "cancelled" && (
                    <div className="text-sm mb-2">
                      Причина: {order.cancellation_reason}
                    </div>
                  )}

                  <Link
                    to={`/admin/orders/${order.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:text-primary-hover transition-colors flex items-center"
                  >
                    <FeatherIcon icon="eye" className="w-5 h-5 mr-1" />
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>

            {orders.length > 0 && (
              <div className="flex justify-start space-x-2">
                <button
                  onClick={() => handlePageChange(meta.current_page - 1)}
                  disabled={meta.current_page === 1}
                  className="px-3 py-1 rounded-md border border-border-light disabled:opacity-50"
                >
                  Назад
                </button>

                <span className="px-3 py-1 text-text-default">
                  Страница {meta.current_page} из {meta.last_page}
                </span>

                <button
                  onClick={() => handlePageChange(meta.current_page + 1)}
                  disabled={meta.current_page === meta.last_page}
                  className="px-3 py-1 rounded-md border border-border-light disabled:opacity-50"
                >
                  Вперёд
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;
