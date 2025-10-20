import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router";
import AdminSidebar from "@components/common/AdminSidebar";
import { useForm } from "react-hook-form";
import Loader from "@components/common/Loader";
import Nostate from "@components/common/Nostate";
import { toast } from "react-toastify";
import { apiUrl, adminToken } from "@components/common/http";
import CustomSelect from "@components/common/CustomSelect";

const Edit = () => {
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [defaultImageId, setDefaultImageId] = useState(null);
  const [tempImages, setTempImages] = useState([]);
  const { productId } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_id: "",
      status: "in_stock",
      is_active: 1,
      is_featured: 0,
    },
  });

  const category_id = watch("category_id");
  const subcategory_id = watch("subcategory_id");
  const status = watch("status");
  const is_active = watch("is_active");
  const is_featured = watch("is_featured");

  const fetchProduct = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${apiUrl}/products/${productId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        const product = result.data;
        setProduct(product);
        reset({
          name: product.name,
          description: product.description,
          short_description: product.short_description,
          price: product.price,
          discount: product.discount,
          subcategory_id: product.subcategory_id,
          category_id: product.subcategory.category_id,
          reserve: product.reserve,
          status: product.status,
          is_active: product.is_active,
          is_featured: product.is_featured,
          grams: product.grams,
        });
        if (product.category_id) {
          await fetchSubcategories(product.category_id);
        }
        setProductImages(
          product.product_images.map((img) => ({
            id: img.id,
            url: img.image_url,
          }))
        );
        const images = product.product_images.map((img) => ({
          id: img.id,
          url: img.image_url,
        }));
        const defaultImg = images.find(
          (img) => img.url === product.image_url || img.image === product.image
        );
        if (defaultImg) {
          setDefaultImageId(defaultImg.id);
        }
        setTempImages([]);
      } else {
        toast.error("Ошибка при получении товара");
      }
    } catch {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setLoader(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/categories`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setCategories(result.data);
      } else {
        toast.error("Ошибка при загрузке категорий");
      }
    } catch {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const fetchSubcategories = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/subcategories/category/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });
      const result = await res.json();

      if (res.ok) {
        setSubcategories(result.data);
      } else {
        toast.error("Ошибка при щагрузке подкатегорий");
      }
    } catch {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDisable(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiUrl}/temp-images`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setTempImages((prev) => [
          ...prev,
          {
            id: result.data.id,
            url: result.data.image_url,
          },
        ]);
        toast.success("Изображение добавлено");
      } else {
        toast.error("Ошибка при загрузке изображения");
      }
    } catch {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setDisable(false);
      e.target.value = "";
    }
  };

  const deleteProductImage = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/product-images/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken()}`,
          Accept: "application/json",
        },
      });
      const result = res.json();
      if (res.ok) {
        setProductImages((prev) => prev.filter((img) => img.id !== id));
        toast.success(result.message || "Изображение удалено");
      } else {
        toast.error("При удалении изображения возникла ошибка.");
      }
    } catch (err) {
      toast.error("Ошибка удаления");
    }
  };

  const deleteTempImage = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/temp-images/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken()}`,
          Accept: "application/json",
        },
      });
      const result = res.json();
      if (res.ok) {
        setTempImages((prev) => prev.filter((img) => img.id !== id));
        toast.success(result.message || "Изображение удалено");
      } else {
        toast.error("При удалении изображения возникла ошибка.");
      }
    } catch {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const updateProduct = async (data) => {
    const formData = {
      ...data,
      product_images_ids: productImages.map((img) => img.id),
      temp_image_ids: tempImages.map((img) => img.id),
      default_image_id: defaultImageId,
    };

    setDisable(true);
    try {
      const res = await fetch(`${apiUrl}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Товар успешно обновлен");
        navigate("/admin/products");
      } else if (result.errors) {
        Object.keys(result.errors).forEach((field) => {
          setError(field, { message: result.errors[field][0] });
        });
        toast.error("Ошибка при обновлении товара");
      }
    } catch {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    } finally {
      setDisable(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category_id) {
      fetchSubcategories(category_id);
    } else {
      setSubcategories([]);
    }
  }, [category_id]);

  return (
    <>
      <div className="container mx-auto my-10 lg:my-20 px-1 md:px-0">
        <h1 className="title text-start">Товары</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-10">
          <div className="col-span-1 lg:col-span-3">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 shadow-sm p-4 flex flex-col gap-6">
            <h2 className="subtitle font-playfair">Редактирование товара</h2>
            {loader == true && <Loader />}
            {loader == false && !product && (
              <>
                <Nostate text="Товар не найден" />
                <Link
                  to="/admin/products"
                  className="btn btn-secondary self-start text-center min-w-32 sm:min-w-0"
                >
                  Назад
                </Link>
              </>
            )}
            {loader == false && product && (
              <form
                onSubmit={handleSubmit(updateProduct)}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
                    Название товара
                  </label>
                  <input
                    {...register("name", {
                      required: "Введите название товара",
                      validate: (value) =>
                        /^[A-Za-zА-Яа-яЁё\s-]+$/.test(value) ||
                        "Название товара должно содержать только буквы",
                    })}
                    type="text"
                    className={`border border-border-light p-2 text-sm  focus:outline-none focus:ring-1 focus:ring-primary sm:text-lg md:text-2xl rounded-md ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Название товара"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <CustomSelect
                  label="Категория"
                  name="category_id"
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  value={category_id}
                  onChange={(value) => {
                    setValue("category_id", value);
                    fetchSubcategories(value);
                  }}
                  error={errors.category_id?.message}
                />

                <CustomSelect
                  label="Подкатегория"
                  name="subcategory_id"
                  options={subcategories.map((sub) => ({
                    value: sub.id,
                    label: sub.name,
                  }))}
                  value={subcategory_id}
                  onChange={(value) => setValue("subcategory_id", value)}
                  error={errors.subcategory_id?.message}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
                      Цена
                    </label>
                    <input
                      {...register("price", {
                        required: "Введите цену",
                        min: {
                          value: 0,
                          message: "Цена не может быть меньше 0",
                        },
                      })}
                      type="number"
                      step="0.01"
                      onChange={(e) => {
                        let val = parseFloat(e.target.value);
                        if (isNaN(val) || val < 0) val = 0;
                        setValue("price", val, { shouldValidate: true });
                      }}
                      className={`border border-border-light  focus:outline-none focus:ring-1 focus:ring-primary mt-2 p-2 rounded-md text-sm sm:text-lg md:text-2xl w-full ${
                        errors.price ? "border-red-500" : ""
                      }`}
                      placeholder="Цена"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
                      Грамм в упаковке
                    </label>
                    <input
                      {...register("grams", {
                        required: "Введите количество грамм",
                        min: {
                          value: 0,
                          message: "Граммовка не может быть меньше 0",
                        },
                        max: {
                          value: 9999,
                          message: "Граммовка не может быть больше 9999",
                        },
                      })}
                      type="number"
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val) || val < 0) val = 0;
                        setValue("grams", val, { shouldValidate: true });
                      }}
                      className={`border border-border-light  focus:outline-none focus:ring-1 focus:ring-primary p-2 mt-2 rounded-md text-sm sm:text-lg md:text-2xl w-full ${
                        errors.grams ? "border-red-500" : ""
                      }`}
                      placeholder="Количество грамм"
                    />
                    {errors.grams && (
                      <p className="text-red-500 text-sm">
                        {errors.grams.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
                    Количество
                  </label>
                  <input
                    {...register("reserve", {
                      required: "Введите количество товара на складе",
                      min: {
                        value: 0,
                        message: "Количество не может быть меньше 0",
                      },
                    })}
                    type="number"
                    onChange={(e) => {
                      let val = parseInt(e.target.value);
                      if (isNaN(val) || val < 0) val = 0;
                      setValue("reserve", val, { shouldValidate: true });
                    }}
                    className={`border border-border-light p-2 text-sm  focus:outline-none focus:ring-1 focus:ring-primary sm:text-lg md:text-2xl rounded-md ${
                      errors.reserve ? "border-red-500" : ""
                    }`}
                    placeholder="Количество товара"
                  />
                  {errors.reserve && (
                    <p className="text-red-500 text-sm">
                      {errors.reserve.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
                    Короткое описание
                  </label>
                  <textarea
                    {...register("short_description")}
                    className="border border-border-light  focus:outline-none focus:ring-1 focus:ring-primary p-2 rounded-md text-sm sm:text-lg md:text-2xl w-full h-24 mt-2"
                    placeholder="Короткое описание товара"
                  ></textarea>
                </div>

                <div>
                  <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
                    Описание
                  </label>
                  <textarea
                    {...register("description")}
                    className="border border-border-light  focus:outline-none focus:ring-1 focus:ring-primary p-2 rounded-md text-sm sm:text-lg md:text-2xl w-full h-40 mt-2"
                    placeholder="Подробное описание товара"
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm sm:text-lg md:text-2xl font-semibold text-text-title">
                    Изображения
                  </label>
                  <input
                    type="file"
                    onChange={handleFile}
                    className="border p-2 rounded-md"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={image.url}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => deleteProductImage(image.id)}
                          title="Удалить"
                          className="absolute top-2 right-2 bg-red-500 text-bg-base rounded-full text-xs px-2 py-1 hover:bg-red-600 transition"
                        >
                          ✕
                        </button>
                        {defaultImageId === image.id ? (
                          <div
                            className="absolute top-2 left-2 bg-yellow-500 text-bg-base rounded-full w-6 h-6 flex items-center justify-center"
                            title="Главное фото"
                          >
                            ★
                          </div>
                        ) : (
                          <button
                            className="absolute top-2 left-2 bg-text-title text-bg-base rounded-full w-6 h-6 flex items-center justify-center"
                            onClick={() => setDefaultImageId(image.id)}
                            title="Сделать главным"
                          >
                            ☆
                          </button>
                        )}
                      </div>
                    ))}
                    {tempImages.map((image, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-full object-cover rounded-md shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => deleteTempImage(image.id)}
                          title="Удалить"
                          className="absolute top-2 right-2 bg-red-500 text-bg-base rounded-full text-xs px-2 py-1 hover:bg-red-600 transition"
                        >
                          ✕
                        </button>
                        {defaultImageId === image.id ? (
                          <div
                            className="absolute top-2 left-2 bg-yellow-500 text-bg-base rounded-full w-6 h-6 flex items-center justify-center"
                            title="Главное фото"
                          >
                            ★
                          </div>
                        ) : (
                          <button
                            className="absolute top-2 left-2 bg-text-title text-bg-base rounded-full w-6 h-6 flex items-center justify-center"
                            onClick={() => setDefaultImageId(image.id)}
                            title="Сделать главным"
                          >
                            ☆
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <CustomSelect
                  label="Статус"
                  name="status"
                  options={[
                    { value: "in_stock", label: "В наличии" },
                    { value: "on_sale", label: "Скидка" },
                    { value: "sold_out", label: "Распродан" },
                  ]}
                  value={status}
                  onChange={(value) => setValue("status", value)}
                  error={errors.status?.message}
                />

                {status === "on_sale" && (
                  <div>
                    <label className="text-sm sm:text-lg md:text-2xl font-semibold mb-2 text-text-title">
                      Скидка (%)
                    </label>
                    <input
                      {...register("discount", {
                        required: "Введите процент скидки",
                        min: { value: 1, message: "Минимум 1%" },
                        max: { value: 99, message: "Максимум 99%" },
                      })}
                      type="number"
                      step="1"
                      onChange={(e) => {
                        let val = parseInt(e.target.value);
                        if (val > 100) val = 99;
                        if (val < 0) val = 1;
                        setValue("discount", val, { shouldValidate: true });
                      }}
                      className={`border border-border-light focus:outline-none focus:ring-1 focus:ring-primary mt-2 p-2 rounded-md text-sm sm:text-lg md:text-2xl w-full ${
                        errors.discount ? "border-red-500" : ""
                      }`}
                      placeholder="Скидка в % (0-100)"
                    />
                    {errors.discount && (
                      <p className="text-red-500 text-sm">
                        {errors.discount.message}
                      </p>
                    )}
                  </div>
                )}

                <CustomSelect
                  label="Состояние"
                  name="is_active"
                  options={[
                    { value: 1, label: "Активен" },
                    { value: 0, label: "Скрыт" },
                  ]}
                  value={is_active}
                  onChange={(value) => setValue("is_active", value)}
                  error={errors.is_active?.message}
                />

                <CustomSelect
                  label='Отображение в блоке "Наша коллекция"'
                  name="is_featured"
                  options={[
                    { value: 1, label: "Показывать" },
                    { value: 0, label: "Не показывать" },
                  ]}
                  value={is_featured}
                  onChange={(value) => setValue("is_featured", value)}
                  error={errors.is_featured?.message}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/admin/products"
                    className="btn btn-secondary self-start min-w-32 sm:min-w-0"
                  >
                    Отмена
                  </Link>
                  <button
                    type="submit"
                    disabled={disable}
                    className="btn btn-primary self-start min-w-32 sm:min-w-0"
                  >
                    {disable ? "Обработка..." : "Сохранить"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
