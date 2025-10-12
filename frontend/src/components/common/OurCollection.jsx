import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { apiUrl } from "@components/common/http";

const OurCollection = () => {
  const [collectionProducts, setCollectionProducts] = useState([]);

  const fetchCollectionProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-our-collection`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        setCollectionProducts(result.data);
      } else {
        toast.error("Ошибка при получении коллекции");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  useEffect(() => {
    fetchCollectionProducts();
  }, []);

  return (
    <div className="container mx-auto mt-10 lg:mt-20 px-1 sm:px-0">
      <h2 className="title text-start lg:text-center">Наша Коллекция</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-10 items-start">
        {collectionProducts &&
          collectionProducts.map((product) => {
            return (
              <div
                className="col-span-1 lg:col-span-4 flex flex-col gap-6 h-full"
                key={product.id}
              >
                <div className="overflow-hidden rounded-md">
                  <img
                    src={product.image_url}
                    alt="CardImage"
                    className="max-w-full h-auto rounded-md hover:scale-105 duration-300 transition-all ease-in-out"
                  />
                </div>
                <h3 className="title">{product.name}</h3>
                <p className="text-start text-lg sm:text-xl md:text-2xl">
                  {product.short_description}
                </p>
                <Link
                  to={`/product/${product.id}`}
                  onClick={() => {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 150);
                  }}
                  className="btn btn-primary text-center self-start mt-auto"
                >
                  Подробнее
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default OurCollection;
