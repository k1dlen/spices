import React from "react";
import AboutImage from "@assets/images/AboutUs.webp";

const About = () => {
  return (
    <div
      id="about"
      className="xl:py-20 lg:py-10 my-10 lg:my-20 bg-[var(--color-bg-base)] relative overflow-hidden"
    >
      <div className="container mx-auto px-1 md:px-0 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="title mb-4">О нас</h2>
          <p className="text-text-default mb-4 text-lg sm:text-xl md:text-2xl">
            Мы верим, что специи способны менять привычные блюда и превращать их
            в настоящие кулинарные открытия. Поэтому мы собрали для вас
            коллекцию из лучших пряностей и трав, чтобы вдохновлять на новые
            вкусы каждый день.
          </p>
          <p className="text-text-default text-lg sm:text-xl md:text-2xl">
            Мы выбираем только натуральные продукты и доверяем проверенным
            поставщикам. Каждая упаковка — это забота о вашем здоровье и
            удовольствии от еды.
          </p>
        </div>
        <div className="lg:hidden overflow-hidden">
          <img
            src={AboutImage}
            alt="О нас"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover rounded-md hover:scale-105 duration-300 transition-all ease-in-out"
          />
        </div>
        <div className="hidden lg:block"></div>
      </div>
      <div className="hidden lg:block rounded-l-md absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden">
        <img
          src={AboutImage}
          alt="О нас"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover rounded-l-md hover:scale-105 duration-300 transition-all ease-in-out"
        />
      </div>
    </div>
  );
};

export default About;
