import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import AdminSidebar from "@components/common/AdminSidebar";
import { adminToken, apiUrl } from "@components/common/http";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FeatherIcon from "feather-icons-react";
import ConfirmModal from "@components/common/ConfirmModal";

const Show = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  const { id } = useParams();

  const fetchSubcategories = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/subcategories/category/${id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setSubcategories(result.data);
      } else {
        toast.error("Ошибка при получении подкатегорий");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setLoader(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteSubcategory(selectedId);
    }
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setSelectedId(null);
    setIsModalOpen(false);
  };

  const deleteSubcategory = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/subcategories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();

      if (res.ok) {
        const newSubcategories = subcategories.filter(
          (subcategory) => subcategory.id != id
        );
        setSubcategories(newSubcategories);
        toast.success(result.message || "Подкатегория успешно удалена");
      } else {
        toast.error("Ошибка при удалении подкатегорий");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <h1 className="title text-start">Подкатегории</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-10">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 rounded-md">
            {loader && <Loader />}
            {!loader && subcategories.length === 0 && (
              <div className="shadow-sm">
                <Nostate text="Подкатегории не найдены" />
              </div>
            )}

            <div className="hidden sm:block shadow-sm rounded-md overflow-x-auto">
              {subcategories.length > 0 && (
                <table className="min-w-full divide-y divide-border-light rounded-md">
                  <thead className="bg-bg-block">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-16">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title">
                        Название
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Состояние
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light bg-bg-base">
                    {subcategories.map((subcategory) => (
                      <tr
                        key={`subcategory-${subcategory.id}`}
                        className="hover:bg-bg-block/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-text-default text-lg">
                          {subcategory.id}
                        </td>
                        <td className="px-4 py-3 text-text-default text-lg">
                          {subcategory.name}
                        </td>
                        <td className="px-4 py-3">
                          {subcategory.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                              Активна
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                              Скрыта
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="px-4 py-3 flex items-center space-x-3">
                            {" "}
                            <Link
                              to={`/admin/subcategories/${id}/edit/${subcategory.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary hover:text-primary-hover transition-colors"
                              title="Редактировать"
                            >
                              <FeatherIcon icon="edit" className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(subcategory.id);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Удалить"
                            >
                              <FeatherIcon icon="trash-2" className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="sm:hidden flex flex-col gap-4">
              {subcategories.map((subcategory) => (
                <div
                  key={`subcategory-card-${subcategory.id}`}
                  className="bg-bg-base rounded-md shadow-sm p-4 cursor-pointer transition hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-title font-semibold">
                      ID: {subcategory.id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-md ${
                        subcategory.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subcategory.is_active ? "Активна" : "Скрыта"}
                    </span>
                  </div>
                  <div className="text-text-default text-lg font-medium mb-2">
                    {subcategory.name}
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      to={`/admin/subcategories/${id}/edit/${subcategory.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:text-primary-hover transition-colors"
                      title="Редактировать"
                    >
                      <FeatherIcon icon="edit" className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(subcategory.id);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Удалить"
                    >
                      <FeatherIcon icon="trash-2" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 sm:w-auto">
              <Link
                to="/admin/categories"
                className="btn btn-secondary self-start text-center min-w-32  sm:min-w-0"
              >
                Назад
              </Link>
              <Link
                to={`/admin/subcategories/${id}/create`}
                className="btn btn-primary self-start min-w-32 sm:min-w-0"
              >
                Создать
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={isModalOpen}
        title="Удаление подкатегории"
        text="Вы уверены, что хотите удалить эту подкатегорию?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default Show;
