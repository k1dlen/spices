import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import AdminSidebar from "@components/common/AdminSidebar";
import { adminToken, apiUrl } from "@components/common/http";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { toast } from "react-toastify";
import { formatDate } from "@components/common/DateFormatter";
import FeatherIcon from "feather-icons-react";

const Details = () => {
  const [user, setUser] = useState(null);
  const [ordersCount, setOrderCount] = useState(0);
  const [lastOrderDate, setLastOrderDate] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [loader, setLoader] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/users/${id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setUser(result.data);
        setOrderCount(result.orders_count);

        if (result.last_order) {
          setLastOrderDate(result.last_order.created_at);
          setLastOrderId(result.last_order.id);
        }
      } else {
        toast.error("Ошибка при получении пользователя");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setLoader(false);
    }
  };

  const isProfileUnchanged = () => {
    const created = new Date(user.created_at).getTime();
    const updated = new Date(user.updated_at).getTime();
    return created === updated;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start mb-10">Пользователи</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 shadow-sm rounded-md p-4">
            <h2 className="subtitle font-playfair">Детали пользователя</h2>
            {loader == true && <Loader />}
            {loader == false && user == null && (
              <>
                <Nostate text={`Пользователь с номером ${id} не найден`} />
              </>
            )}
            {!loader && user && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-text-default/20 pb-4 mb-4">
                  <h3 className="text-xl font-semibold text-text-title">
                    Номер пользователя #{user.id}
                  </h3>

                  <div>
                    <div className="text-text-default text-sm">
                      Дата регистрации
                    </div>
                    <div className="text-lg font-medium text-text-title">
                      {formatDate(user.created_at)}
                    </div>
                  </div>

                  <div>
                    <div className="text-text-default text-sm">
                      Последнее изменение данных
                    </div>
                    <div className="text-lg font-medium text-text-title">
                      {isProfileUnchanged()
                        ? "Профиль не редактировался"
                        : `${formatDate(user.updated_at)}`}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="font-semibold text-text-title">Имя: {user.name}</div>
                    {user.surname && (
                      <div className="font-semibold text-text-title">
                        Фамилия: {user.surname}
                      </div>
                    )}
                    <div className="text-text-default">
                      Эл.почта: {user.email}
                    </div>
                    <div className="text-sm text-text-default">
                      Адрес: {user.address ? user.address : "не указан"}
                    </div>
                    <div className="text-sm text-text-default">
                      Телефон: {user.mobile ? user.mobile : "не указан"}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-default">Кол-во заказов</div>
                    <div className="font-medium text-text-title">
                      {ordersCount > 0 ? (
                        <span>{ordersCount}</span>
                      ) : (
                        <span>Пользователь пока не совершал заказов</span>
                      )}
                    </div>
                  </div>
                  {lastOrderId && lastOrderDate && (
                    <div>
                      <div className="text-text-default">Последний заказ</div>
                      <span
                        onClick={() => {
                          navigate(`/admin/orders/${lastOrderId}`);
                        }}
                        className="flex flex-row group text-text-title font-medium items-center hover:cursor-pointer"
                      >
                        {formatDate(lastOrderDate)}
                        <FeatherIcon
                          icon="arrow-right"
                          strokeWidth={2.3}
                          className="h-4 w-auto ml-1 group-hover:ml-2 transition-all ease-in-out duration-300"
                        />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div>
              <Link
                to="/admin/users"
                className="btn btn-secondary self-start text-center min-w-32"
              >
                Назад
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
