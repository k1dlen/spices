import React, { useEffect, useState } from "react";
import AdminSidebar from "@components/common/AdminSidebar";
import { adminToken, apiUrl } from "@components/common/http";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { toast } from "react-toastify";
import { Link } from "react-router";

const Dashboard = () => {
  const [topProduct, setTopProduct] = useState(null);
  const [newUsers, setNewUsers] = useState(null);
  const [ordersCount, setOrdersCount] = useState(null);
  const [loader, setLoader] = useState(false);

  const fetchDashboard = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/dashboard`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setTopProduct(result.top_product || null);
        setNewUsers(result.new_users_count || 0);
        setOrdersCount(result.orders_count || 0);
      } else {
        toast.error("Ошибка при получении данных для дешборда");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setLoader(false);
    }
  };

  const pluralize = (count, forms) => {
    const n10 = count % 10;
    const n100 = count % 100;
    if (n100 >= 11 && n100 <= 19) return forms[2];
    if (n10 === 1) return forms[0];
    if (n10 >= 2 && n10 <= 4) return forms[1];
    return forms[2];
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start">Панель управления</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-10">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
            {loader == true && <Loader />}
            {loader == false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-bg-block shadow-sm rounded-lg flex flex-col justify-between border border-border-light">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-text-title">
                      {newUsers !== null ? newUsers : "—"}
                    </h2>
                    <span className="text-text-default text-sm">
                      {newUsers !== null
                        ? `${pluralize(newUsers, [
                            "Новый пользователь",
                            "Новых пользователя",
                            "Новых пользователей",
                          ])}`
                        : "Нет данных"}{" "}
                      (с начала месяца)
                    </span>
                  </div>
                  <div className="bg-bg-base p-4 rounded-b-lg border-t border-border-light">
                    <Link
                      to="/admin/users"
                      className="text-text-title hover:text-primary transition-colors"
                    >
                      Просмотреть пользователей
                    </Link>
                  </div>
                </div>

                <div className="bg-bg-block shadow-sm rounded-lg flex flex-col justify-between border border-border-light">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-text-title">
                      {ordersCount !== null ? ordersCount : "—"}
                    </h2>
                    <span className="text-text-default text-sm">
                      {ordersCount !== null
                        ? `${pluralize(ordersCount, [
                            "Заказ",
                            "Заказа",
                            "Заказов",
                          ])}`
                        : "Нет данных"}{" "}
                      (с начала месяца)
                    </span>
                  </div>
                  <div className="bg-bg-base p-4 rounded-b-lg border-t border-border-light">
                    <Link
                      to="/admin/orders"
                      className="text-text-title hover:text-primary transition-colors"
                    >
                      Просмотреть заказы
                    </Link>
                  </div>
                </div>

                <div className="bg-bg-block shadow-sm rounded-lg flex flex-col justify-between border border-border-light">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-text-title">
                      {topProduct ? (
                        <>
                          {topProduct.name}{" "}
                          <span className="text-text-muted">
                            ({topProduct.sold_count} шт.)
                          </span>
                        </>
                      ) : (
                        "Нет продаж за месяц"
                      )}
                    </h2>
                    <span className="text-text-default text-sm">
                      Самый продаваемый товар
                    </span>
                  </div>
                  <div className="bg-bg-base p-4 rounded-b-lg border-t border-border-light">
                    <Link
                      to="/admin/products"
                      className="text-text-title hover:text-primary transition-colors"
                    >
                      Просмотреть продукты
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
