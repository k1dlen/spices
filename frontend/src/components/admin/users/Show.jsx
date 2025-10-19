import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { adminToken, apiUrl } from "@components/common/http";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { toast } from "react-toastify";
import AdminSidebar from "@components/common/AdminSidebar";
import FeatherIcon from "feather-icons-react";

const Show = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/users?page=${page}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setUsers(result.data);
        setMeta(result.meta);
      } else {
        toast.error("Ошибка при получении пользователей");
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
      fetchUsers(page);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);
  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start mb-10">Пользователи</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
            {loader == true && <Loader />}
            {loader == false && users.length == 0 && (
              <div className="shadow-sm">
                <Nostate text="Пользователи не найдены" />
              </div>
            )}
            <div className="hidden sm:block shadow-sm rounded-md overflow-x-auto">
              {users.length > 0 && (
                <table className="min-w-full divide-y divide-border-light rounded-md">
                  <thead className="bg-bg-block">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-16">
                        ID пользователя
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title">
                        Имя пользователя
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Эл.почта
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light bg-bg-base">
                    {users.map((user) => (
                      <tr
                        key={`user-${user.id}`}
                        className="hover:bg-bg-block/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-text-default text-lg">
                          {user.id}
                        </td>
                        <td className="px-4 py-3 text-text-default text-lg">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 text-text-default text-lg">
                          {user.email}
                        </td>
                        <td>
                          <div className="px-4 py-3 flex items-center space-x-3">
                            <Link
                              to={`/admin/users/${user.id}`}
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
              {users.map((user) => (
                <div
                  key={`user-card-${user.id}`}
                  className="bg-bg-base rounded-md shadow-sm p-4 cursor-pointer transition hover:shadow-md"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <div className="text-text-title font-semibold">
                    ID пользователя: #{user.id}
                  </div>
                  <div className="text-text-default text-lg font-medium">
                    Имя: {user.name}
                  </div>
                  <div className="text-sm text-text-muted mb-2">
                    Эл.почта: {user.email}
                  </div>

                  <Link
                    to={`/admin/users/${user.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:text-primary-hover transition-colors flex items-center"
                  >
                    <FeatherIcon icon="eye" className="w-5 h-5 mr-1" />
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>

            {users.length > 0 && (
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
