import React from "react";
import { Link } from "react-router";
import FirstCardImage from "../../assets/images/groundTurmeric.png";

const OurCollection = () => {
  return (
    <div className="container mx-auto py-20 px-1 sm:px-0">
      <h1 className="title text-center">Наша Коллекция</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-10 items-start">
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <img
            src={FirstCardImage}
            alt="HeroImage"
            className="max-w-full h-auto"
          />
          <h2 className="title">Куркума молотая</h2>
          <p className="text-start text-lg sm:text-xl md:text-2xl">
            Пряность с золотистым цветом и мягким ароматом, придаёт блюдам вкус
            и пользу.
          </p>
          <Link to={`/`} className="btn btn-primary text-center self-start">
            Перейти
          </Link>
        </div>
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <img
            src={FirstCardImage}
            alt="HeroImage"
            className="max-w-full h-auto"
          />
          <h2 className="title">Название продукта</h2>
          <p className="text-start text-lg sm:text-xl md:text-2xl">
            Первый блок
          </p>
          <Link to={`/`} className="btn btn-primary text-center self-start">
            Перейти
          </Link>
        </div>
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <img
            src={FirstCardImage}
            alt="HeroImage"
            className="max-w-full h-auto"
          />
          <h2 className="title">Название продукта</h2>
          <p className="text-start text-lg sm:text-xl md:text-2xl">
            Первый блок
          </p>
          <Link to={`/`} className="btn btn-primary text-center self-start">
            Перейти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurCollection;
