import React from "react";
import { Link } from "react-router";
import FirstCardImage from "../assets/images/groundTurmeric.png";
import { Layout } from "./common/Layout";

const Catalog = () => {
  const products = [
    {
      id: 1,
      title: "Куркума молотая",
      price: 130.0,
      short_desc: "Пряность с золотистым цветом и мягким ароматом, 100 г",
      image: "/src/assets/images/groundTurmeric.png",
    },
    {
      id: 2,
      title: `Куркума в корне`,
      price: 100.0,
      short_desc: "Сушёный корень куркумы, сохраняет аромат и вкус, 100 г",
      image: "/src/assets/images/driedTumeric.png",
    },
    {
      id: 3,
      title: "Куркума молотая",
      price: 130.0,
      short_desc: "Пряность с золотистым цветом и мягким ароматом, 100 г",
      image: "/src/assets/images/groundTurmeric.png",
    },
    {
      id: 4,
      title: `Куркума в корне`,
      price: 100.0,
      short_desc: "Сушёный корень куркумы, сохраняет аромат и вкус, 100 г",
      image: "/src/assets/images/driedTumeric.png",
    },
    {
      id: 5,
      title: "Куркума молотая",
      price: 130.0,
      short_desc: "Пряность с золотистым цветом и мягким ароматом, 100 г",
      image: "/src/assets/images/groundTurmeric.png",
    },
    {
      id: 6,
      title: `Куркума в корне`,
      price: 100.0,
      short_desc: "Сушёный корень куркумы, сохраняет аромат и вкус, 100 г",
      image: "/src/assets/images/driedTumeric.png",
    },
  ];
  return (
    <>
      <Layout>
        <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4  items-start">
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 ">
              <div className="shadow-sm p-4 rounded-md">
                <h3 className="mb-3 text-2xl md:text-4xl sm:text-3xl text-text-title">
                  Специи
                </h3>
                <ul className="flex flex-nowrap gap-2 overflow-x-auto lg:flex-col lg:gap-2 lg:overflow-visible">
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Паприка
                    </label>
                  </li>
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Паприка
                    </label>
                  </li>
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Паприка
                    </label>
                  </li>
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Паприка
                    </label>
                  </li>
                </ul>
              </div>
              <div className="shadow-sm p-4 rounded-md">
                <h3 className="mb-3 text-2xl md:text-4xl sm:text-3xl text-text-title">
                  Пряности
                </h3>
                <ul className="flex flex-nowrap gap-2 overflow-x-auto lg:flex-col lg:gap-2 lg:overflow-visible">
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Листовые
                    </label>
                  </li>
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Листовые
                    </label>
                  </li>
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Листовые
                    </label>
                  </li>
                  <li className="mb-2 ms-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="w-[1em] h-[1em] accent-[var(--color-primary)]"
                    />
                    <label
                      htmlFor=""
                      className="ps-2 text-sm sm:text-lg md:text-2xl"
                    >
                      Листовые
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 mt-4 sm:mt-6 lg:mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {products &&
                  products.map((product) => {
                    return (
                      <div
                        className="col-span-1 md:col-span-4 flex flex-col gap-6"
                        key={product.id}
                      >
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={product.image}
                            alt="CardImage"
                            className="max-w-full h-auto rounded-md hover:scale-105 duration-300 transition-all ease-in-out"
                          />
                        </div>
                        <h2 className="title">{product.title}</h2>
                        <p className="text-start text-lg sm:text-xl md:text-2xl text-text-default">
                          {product.short_desc}
                        </p>
                        <div className="mt-auto flex flex-col gap-6">
                          <p className="font-semibold text-2xl sm:text-3xl md:text-4xl text-text-title">
                            ₽{product.price.toFixed(2)}
                          </p>
                          <Link
                            to={`/product/${product.id}`}
                            onClick={() =>
                              window.scrollTo({ top: 0, behavior: "smooth" })
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
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Catalog;
