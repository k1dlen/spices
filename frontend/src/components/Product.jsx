import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@components/common/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { apiUrl } from "@components/common/http";
import "swiper/css";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { CartContext } from "@components/context/Cart";
import { AuthContext } from "./context/Auth";

const Product = () => {
  const { productId } = useParams();

  const { user } = useContext(AuthContext);

  const { cartData, addToCart, updateCartItem, deleteCartItem, getQuantity } =
    useContext(CartContext);

  const [cartItemId, setCartItemId] = useState(null);
  const [product, setProduct] = useState([]);
  const [loader, setLoader] = useState(false);
  const [randomProducts, setRandomProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);

  const isSingle = productImages.length <= 1;
  const thumbsWidthClass =
    productImages.length === 2
      ? "w-[50%]"
      : productImages.length === 3
      ? "w-[75%]"
      : "w-[75%]";

  const fetchProduct = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/get-product/${productId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        setProduct(result.data);
        setProductImages(
          result.data.product_images.map((img) => ({
            id: img.id,
            url: img.image_url,
          }))
        );
        setLoader(false);
      } else {
        toast.error("Ошибка при получении категорий");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const fetchRandomProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/get-random-products/${productId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        setRandomProducts(result.data);
      } else {
        toast.error("Ошибка при получении категорий");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const handleAddToCart = () => {
    if (inCart) {
      if (quantity <= 0) {
        deleteCartItem(product.id);
      } else {
        updateCartItem(product.id, quantity);
      }
    } else {
      addToCart(product);
    }
  };

  const increment = () => {
    if (quantity < product?.reserve) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);

      if (inCart) {
        updateCartItem(cartItemId, newQuantity);
      }
    }
  };

  const decrement = () => {
    const newQuantity = quantity - 1;

    if (newQuantity > 0) {
      setQuantity(newQuantity);

      if (inCart && cartItemId) {
        updateCartItem(cartItemId, newQuantity);
      }
    } else {
      if (inCart && cartItemId) {
        deleteCartItem(cartItemId);
      }
      setInCart(false);
      setQuantity(1);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchRandomProducts();
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    let item = null;

    if (user) {
      item = cartData.find(
        (i) => i.product_id === product.id || i.id === product.id
      );
    } else {
      item = cartData.find((i) => i.product?.product_id === product.id);
    }

    if (item) {
      setInCart(true);
      setQuantity(item.quantity);
      setCartItemId(item.id || item.product?.product_id);
    } else {
      setInCart(false);
      setQuantity(1);
      setCartItemId(null);
    }
  }, [product, cartData, user]);

  return (
    <Layout>
      {loader == true && (
        <div className="py-20">
          <Loader />
        </div>
      )}
      {loader == false && (!product || Object.keys(product).length === 0) && (
        <div className="shadow-sm my-20">
          <Nostate text="Товар не найден" />
        </div>
      )}

      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        {loader == false && Object.keys(product).length > 0 && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="col-span-1 lg:col-span-3 flex flex-col gap-6 relative">
                <Swiper
                  loop={!isSingle}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="w-full h-auto"
                >
                  {productImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img.url}
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
                    className={`flex flex-shrink-0 ${thumbsWidthClass} mt-2`}
                  >
                    {productImages.map((img, index) => (
                      <SwiperSlide key={index} className="cursor-pointer  ">
                        <img
                          src={img.url}
                          alt={`thumb-${index}`}
                          className="object-contain rounded-md w-full h-full"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
              <div className="col-span-1 lg:col-span-9 flex flex-col gap-6">
                <h1 className="title">{product.name}</h1>
                <p className="font-semibold text-2xl sm:text-3xl md:text-4xl text-text-title flex items-center gap-3">
                  {product.discount ? (
                    <>
                      <span className="line-through text-text-title/20">
                        ₽{product.price}
                      </span>
                      <span className="text-title">
                        ₽
                        {Math.round(
                          product.price * (1 - product.discount / 100)
                        ).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>₽{product.price}</span>
                  )}
                </p>

                <p className="text-text-default text-lg sm:text-xl md:text-2xl">
                  {product.description ||
                    "Информация о продукте скоро появится."}
                </p>
                {inCart ? (
                  <div className="btn inline-flex items-center justify-center gap-6 self-start select-none px-5 py-2">
                    <span
                      onClick={decrement}
                      className={`text-3xl font-light transition-opacity hover:opacity-70 cursor-pointer`}
                    >
                      −
                    </span>

                    <span className="text-2xl font-semibold w-8 text-center">
                      {quantity}
                    </span>

                    <span
                      onClick={increment}
                      className={`text-3xl font-light transition-opacity ${
                        quantity < product.reserve
                          ? "cursor-pointer hover:opacity-70"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      +
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.reserve <= 0}
                    className={`btn self-start ${
                      product.reserve <= 0 ? "btn-disabled" : "btn-primary"
                    }`}
                  >
                    {product.reserve <= 0
                      ? "Нет в наличии"
                      : "Добавить в корзину"}
                  </button>
                )}
              </div>
            </div>

            <h2 className="title text-center mt-20">Случайные товары</h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start mt-10">
              {randomProducts &&
                randomProducts.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="col-span-1 md:col-span-6 lg:col-span-3 flex flex-col gap-6 h-full"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="flex flex-col gap-4 group h-full"
                      >
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-auto rounded-md group-hover:scale-105 transition-transform duration-300 ease-in-out"
                          />
                        </div>
                        <h2 className="subtitle">{product.name}</h2>
                        <p className="subtitle mt-auto">₽{product.price}</p>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Product;
