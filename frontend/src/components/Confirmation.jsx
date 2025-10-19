import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "@components/common/Loader";
import { userToken, apiUrl } from "@components/common/http";
import { toast } from "react-toastify";
import { formatDate } from "@components/common/DateFormatter";

const Confirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(true);

  const fetchOrder = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/get-order-detail/${id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setOrder(result.data);
        setItems(result.data.items || []);
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

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        {loader == true && (
          <div className="text-center py-10">
            <Loader />
          </div>
        )}

        {loader == false && !order && (
          <div className="text-center">
            <h2 className="title text-start lg:text-center mb-6">
              Заказ не найден
            </h2>
            <Link
              to="/"
              className="btn btn-primary"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Вернуться на главную
            </Link>
          </div>
        )}

        {loader === false && order && (
          <>
            <div className="text-left md:text-center mb-10">
              <h1 className="title text-4xl md:text-5xl lg:text-6xl text-text-title mb-4">
                Спасибо за покупку!
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-text-default max-w-2xl mx-auto">
                Ваш заказ успешно оформлен.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="col-span-1 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 shadow-sm rounded-md">
                <div className="p-6">
                  <h2 className="subtitle font-playfair mb-6">Детали заказа</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-text-title font-semibold text-lg">
                        Номер заказа
                      </p>
                      <p className="text-text-default text-lg">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-text-title font-semibold text-lg">
                        Дата
                      </p>
                      <p className="text-text-default text-lg">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-title font-semibold text-lg">
                        Статус
                      </p>
                      <p className="text-text-default text-lg mt-1">
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
                      </p>
                    </div>
                    <div>
                      <p className="text-text-title font-semibold text-lg">
                        Способ оплаты
                      </p>
                      <p className="text-text-default text-lg">
                        {order.payment_method === "cash_on_place"
                          ? "Наличными при получении"
                          : "Картой при получении"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="subtitle font-playfair mb-4">
                      Контактные данные
                    </h3>
                    <p className="text-text-default text-lg">
                      <span className="font-semibold">Имя:</span> {order.name}{" "}
                      {order.surname}
                    </p>
                    <p className="text-text-default text-lg">
                      <span className="font-semibold">Email:</span>{" "}
                      {order.email}
                    </p>
                    <p className="text-text-default text-lg">
                      <span className="font-semibold">Телефон:</span>{" "}
                      {order.mobile}
                    </p>
                    <p className="text-text-default text-lg mt-2">
                      <span className="font-semibold">Адрес доставки:</span>
                      <br />
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 shadow-sm rounded-md">
                <div className="p-6">
                  <h3 className="subtitle font-playfair mb-4">Ваш заказ</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-16 h-16 object-contain rounded-md flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h4 className="text-text-title font-semibold text-lg">
                            {item.product.name}
                          </h4>
                          <p className="text-text-default text-lg mt-1">
                            {item.quantity} × ₽
                            {parseFloat(item.product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-text-default/20 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-text-title font-semibold text-lg">
                        Итого
                      </span>
                      <span className="text-text-title font-semibold text-lg">
                        ₽{parseFloat(order.grand_total).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 mt-4">
                    <Link
                      to="/profile/orders"
                      className="btn self-start md:self-stretch min-w-32 text-center btn-secondary text-xl xl:text-2xl"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Мои заказы
                    </Link>
                    <Link
                      to="/"
                      className="btn self-start md:self-stretch text-center btn-primary  text-xl xl:text-2xl"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Продолжить покупки
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Confirmation;
