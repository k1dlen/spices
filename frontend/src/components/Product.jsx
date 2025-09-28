import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "./common/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router";
import FirstImage from "../assets/images/groundTurmeric.png";
import SecondImage from "../assets/images/driedTumeric.png";

const Product = () => {
  const params = useParams();

  const randomProducts = [
    {
      id: 1,
      title: "Куркума молотая",
      price: 130.0,
      image: "/src/assets/images/groundTurmeric.png",
    },
    {
      id: 2,
      title: `Куркума в корне`,
      price: 100.0,
      image: "/src/assets/images/driedTumeric.png",
    },
    {
      id: 3,
      title: "Куркума молотая",
      price: 130.0,
      image: "/src/assets/images/groundTurmeric.png",
    },
    {
      id: 4,
      title: `Куркума в корне`,
      price: 100.0,
      image: "/src/assets/images/driedTumeric.png",
    },
  ];

  const productImages = [
    { image_url: FirstImage },
    { image_url: SecondImage },
    { image_url: FirstImage },
    { image_url: FirstImage },
    { image_url: SecondImage },
    { image_url: SecondImage },
  ];

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const isSingle = productImages.length === 1;

  return (
    <Layout>
      <div className="container mx-auto my-20 px-1 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 relative">
            <Swiper
              loop={!isSingle}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="w-full h-auto"
            >
              {productImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.image_url}
                    alt={`product-${index}`}
                    className="object-contain w-full h-auto rounded-md"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {!isSingle && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={Math.min(productImages.length, 3)}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="flex flex-shrink-0 w-[75%] mt-2"
              >
                {productImages.map((img, index) => (
                  <SwiperSlide key={index} className="cursor-pointer  ">
                    <img
                      src={img.image_url}
                      alt={`thumb-${index}`}
                      className="object-contain rounded-md w-full h-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
            <h1 className="title">Куркума молотая</h1>
            <p className="font-semibold text-2xl sm:text-3xl md:text-4xl text-text-title">
              ₽130.00
            </p>
            <p className="text-text-default text-lg sm:text-xl md:text-2xl">
              Пряность с золотистым цветом и мягким ароматом. Отлично подходит
              для карри, риса и маринадов. Можно использовать в маринадах и
              напитках.
            </p>
            <Link to={`/`} className="btn btn-primary text-center self-start">
              Добавить в корзину
            </Link>
          </div>
        </div>

        <h2 className="title text-center my-20">Случайные товары</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {randomProducts &&
            randomProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="col-span-1 md:col-span-6 lg:col-span-3 flex flex-col gap-6"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="flex flex-col gap-4 group"
                  >
                    <div className="overflow-hidden rounded-md">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-auto rounded-md group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      />
                    </div>
                    <h2 className="subtitle font-playfair">{product.title}</h2>
                    <p className="subtitle">₽{product.price.toFixed(2)}</p>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
