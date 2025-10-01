import React from "react";
import { Link } from "react-router";
import HeroImage from "../../assets/images/Hero.png";

const Hero = () => {
  return (
    <div className="bg-bg-block">
      <div className="container mx-auto px-1 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-20 md:py-40 items-center">
          <div className="col-span-1 md:col-span-6 flex flex-col items-start gap-6 md:px-0 text-left">
            <h1 className="title">
              Натуральные специи и&nbsp;пряности для ваших кулинарных шедевров.
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-text-default">
              Мы собрали лучшие вкусы со всего&nbsp;мира, чтобы каждая ваша
              тарелка наполнялась ароматом и пользой. Всегда свежие, всегда
              качественные.
            </p>

            <Link
              to={`catalog`}
              className="btn btn-primary  w-auto"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Открыть каталог
            </Link>
          </div>

          <div className="col-span-1 lg:col-span-6 flex">
            <img
              src={HeroImage}
              alt="HeroImage"
              className="hidden lg:block max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
