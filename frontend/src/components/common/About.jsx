import React from "react";
import AboutImage from "../../assets/images/AboutUs.png";

const About = () => {
  return (
    <div
      id="about"
      className="xl:py-20 lg:py-10 my-20 bg-[var(--color-bg-base)] relative overflow-hidden"
    >
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
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
        <div className="lg:hidden">
          <img
            src={AboutImage}
            alt="О нас"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
        <div className="hidden lg:block"></div>
      </div>
      <div className="hidden lg:block absolute top-0 bottom-0 right-0 w-1/2">
        <img
          src={AboutImage}
          alt="О нас"
          className="w-full h-full object-cover rounded-l-md"
        />
      </div>
    </div>
  );
};

export default About;
