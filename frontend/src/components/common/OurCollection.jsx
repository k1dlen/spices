import React from "react";
import { Link } from "react-router";

const OurCollection = () => {
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
      short_desc: "Пряность с золотистым цветом и мягким ароматом, 100 г",
      image: "/src/assets/images/groundTurmeric.png",
    },
  ];

  return (
    <div className="container mx-auto mt-10 lg:mt-20 px-1 sm:px-0">
      <h2 className="title text-start lg:text-center">Наша Коллекция</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-10 items-start">
        {products &&
          products.map((product) => {
            return (
              <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
                <div className="overflow-hidden rounded-md">
                  <img
                    src={product.image}
                    alt="CardImage"
                    className="max-w-full h-auto rounded-md hover:scale-105 duration-300 transition-all ease-in-out"
                  />
                </div>
                <h3 className="title">{product.title}</h3>
                <p className="text-start text-lg sm:text-xl md:text-2xl">
                  {product.short_desc}
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
            );
          })}
      </div>
    </div>
  );
};

export default OurCollection;
