import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Layout } from "@components/common/Layout";
import { apiUrl } from "@components/common/http";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { toast } from "react-toastify";

const Catalog = () => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [checkedSubs, setCheckedSubs] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-categories`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        setCategories(result.data);
      } else {
        toast.error("Ошибка при получении категорий");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-subcategories`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
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
    }
  };

  const fetchProducts = async () => {
    setLoader(true);
    try {
      let params = new URLSearchParams();

      if (checkedSubs.length > 0) {
        params.append("subcategory", checkedSubs.join(","));
      }
      const res = await fetch(`${apiUrl}/get-products?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        setProducts(result.data);
        setLoader(false);
      } else {
        toast.error("Ошибка при получении категорий");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [checkedSubs]);

  return (
    <>
      <Layout>
        <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4  items-start">
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 ">
              {categories.map((category) => (
                <div key={category.id} className="shadow-sm p-4 rounded-md">
                  <h3 className="mb-3 text-2xl md:text-4xl sm:text-3xl text-text-title">
                    {category.name}
                  </h3>

                  <ul className="flex flex-nowrap gap-2 overflow-x-auto lg:flex-col lg:gap-2 lg:overflow-visible">
                    {subcategories
                      .filter((sub) => sub.category_id === category.id)
                      .map((sub) => (
                        <li key={sub.id} className="mb-2 ms-2 flex-shrink-0">
                          <input
                            type="checkbox"
                            value={sub.id}
                            checked={checkedSubs.includes(sub.id.toString())}
                            onChange={(e) => {
                              const { checked, value } = e.target;
                              setCheckedSubs((prev) =>
                                checked
                                  ? [...prev, value]
                                  : prev.filter((v) => v !== value)
                              );
                            }}
                            className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                          />
                          <label className="ps-2 text-sm sm:text-lg md:text-2xl">
                            {sub.name}
                          </label>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 mt-4 sm:mt-6 lg:mt-0">
              {loader == true && <Loader />}
              {loader == false && products.length == 0 && (
                <div className="shadow-sm">
                  <Nostate text="Товаров не найдено" />
                </div>
              )}
              {!loader && products.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {products &&
                    products
                      .filter((product) => product.is_active)
                      .map((product) => {
                        return (
                          <div
                            className="col-span-1 md:col-span-4 flex flex-col gap-6"
                            key={product.id}
                          >
                            <div className="overflow-hidden rounded-md">
                              <img
                                src={product.image_url}
                                alt="CardImage"
                                className="max-w-full h-auto rounded-md hover:scale-105 duration-300 transition-all ease-in-out"
                              />
                            </div>
                            <h2 className="title">{product.name}</h2>
                            <p className="text-start text-lg sm:text-xl md:text-2xl text-text-default">
                              {product.short_description}
                            </p>
                            <div className="mt-auto flex flex-col gap-6">
                              <p className="font-semibold text-2xl sm:text-3xl md:text-4xl text-text-title">
                                ₽{product.price}
                              </p>
                              <Link
                                to={`/product/${product.id}`}
                                onClick={() =>
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  })
                                }
                                className="btn btn-primary text-center self-start"
                              >
                                Подробнее
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Catalog;
