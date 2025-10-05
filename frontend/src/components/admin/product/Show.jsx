import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Layout } from "../../common/Layout";
import AdminSidebar from "../../common/AdminSidebar";
import { adminToken, apiUrl } from "../../common/http";
import Loader from "../../common/Loader";
import Nostate from "../../common/Nostate";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FeatherIcon from "feather-icons-react";
import ConfirmModal from "../../common/ConfirmModal";

const Show = () => {
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/products`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setProducts(result.data);

        setLoader(false);
      } else {
        toast.error("Ошибка при получении товаров");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteProduct(selectedId);
    }
    setIsModalOpen(false);
  };

  const cancelDelete = () => {
    setSelectedId(null);
    setIsModalOpen(false);
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();

      if (res.ok) {
        const newProducts = products.filter((product) => product.id != id);
        setProducts(newProducts);
        toast.success(result.message || "Товар успешно удален");
      } else {
        toast.error("Ошибка при удалении товара");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start">Товары</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-10">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
            {loader == true && <Loader />}
            {loader == false && products.length == 0 && (
              <div className="shadow-sm">
                <Nostate text="Товары не найдены" />
              </div>
            )}

            <div className="hidden sm:block shadow-sm rounded-md overflow-x-auto">
              {products.length > 0 && (
                <table className="min-w-full divide-y divide-border-light rounded-md">
                  <thead className="bg-bg-block">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-16">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-16">
                        Фотография
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title">
                        Название
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-title w-32">
                        Состояние
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
                    {products.map((product) => (
                      <tr
                        key={`product-${product.id}`}
                        className="hover:bg-bg-block/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-text-default text-lg">
                          {product.id}
                        </td>
                        <td className="px-4 py-3">
                          {product.image_url == "" ? (
                            <img
                              src="https://placehold.co/48x48"
                              alt="product_img"
                              className="w-12"
                            />
                          ) : (
                            <img
                              src={product.image_url}
                              alt="product_img"
                              className="w-12"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-text-default text-lg">
                          {product.name}
                        </td>
                        <td className="px-4 py-3">
                          {product.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Активен
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Скрыт
                            </span>
                          )}
                        </td>
                        <td>
                          {product.status === "in_stock" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                              В наличии
                            </span>
                          )}
                          {product.status === "sold_out" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                              Распродано
                            </span>
                          )}
                          {product.status === "on_sale" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                              Скидка
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex items-center space-x-3">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:text-primary-hover transition-colors"
                            title="Редактировать"
                          >
                            <FeatherIcon icon="edit" className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(product.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Удалить"
                          >
                            <FeatherIcon icon="trash-2" className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="sm:hidden flex flex-col gap-4">
              {products.map((product) => (
                <div
                  key={`product-card-${product.id}`}
                  className="bg-bg-base rounded-md shadow-sm p-4 cursor-pointer transition hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-title font-semibold">
                      ID: {product.id}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        product.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.is_active ? "Активна" : "Скрыта"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>
                      {product.image_url == "" ? (
                        <img
                          src="https://placehold.co/48x48"
                          alt="product_img"
                          className="w-12"
                        />
                      ) : (
                        <img
                          src={product.image_url}
                          alt="product_img"
                          className="w-12"
                        />
                      )}
                    </span>

                    <span>
                      {product.status === "in_stock" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                          В наличии
                        </span>
                      )}
                      {product.status === "sold_out" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                          Распродано
                        </span>
                      )}
                      {product.status === "on_sale" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                          Скидка
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-text-default text-lg font-medium mb-2">
                    {product.name}
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:text-primary-hover transition-colors"
                      title="Редактировать"
                    >
                      <FeatherIcon icon="edit" className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(product.id);
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
                to="/admin/products/create"
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
        title="Удаление товара"
        text="Вы уверены, что хотите удалить этот товар?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Layout>
  );
};

export default Show;
