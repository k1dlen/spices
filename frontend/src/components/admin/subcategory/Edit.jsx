import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Layout } from "@components/common/Layout";
import AdminSidebar from "@components/common/AdminSidebar";
import { adminToken, apiUrl } from "@components/common/http";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import CustomSelect from "@components/common/CustomSelect";

const Edit = () => {
  const [disable, setDisable] = useState(false);
  const [subcategory, setSubcategory] = useState(null);
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      is_active: 1,
    },
  });

  const is_active = watch("is_active");

  const fetchSubcategory = async () => {
    try {
      const res = await fetch(`${apiUrl}/subcategories/${subcategoryId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        setSubcategory(result.data);
        reset({
          name: result.data.name,
          is_active: result.data.is_active,
        });
      } else {
        toast.error("Ошибка при получении подкатегорий");
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
    }
  };

  const saveSubcategory = async (data) => {
    setDisable(true);
    try {
      const res = await fetch(`${apiUrl}/subcategories/${subcategoryId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setDisable(false);
        toast.success(result.message || "Подкатегория успешно обновлена");
        navigate(`/admin/subcategories/${categoryId}`);
      } else {
        toast.error("Ошибка при обновлении категории");
        setDisable(false);
      }
    } catch (error) {
      console.error("Ошибка сети или парсинга");
      toast.error("Сервер недоступен. Проверьте подключение.");
      setDisable(false);
    }
  };

  useEffect(() => {
    fetchSubcategory();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto my-10 lg:my-20 px-1 sm:px-0">
        <h1 className="title text-start">Подкатегории</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mt-10">
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:shadow-sm rounded-md">
            <AdminSidebar />
          </div>
          <div className="col-span-1 lg:col-span-9 flex flex-col gap-6 shadow-sm p-4">
            <h2 className="subtitle font-playfair mb-6">
              Редактирование подкатегории
            </h2>
            <form
              onSubmit={handleSubmit(saveSubcategory)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-lg md:text-2xl font-semibold">
                  Название подкатегории
                </label>
                <input
                  {...register("name", {
                    required: "Введите название подкатегории",
                  })}
                  type="text"
                  className={`border border-border-light p-2 text-sm sm:text-lg md:text-2xl rounded-md ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Название подкатегории"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <CustomSelect
                label="Статус"
                name="is_active"
                options={[
                  { value: 1, label: "Активна" },
                  { value: 0, label: "Скрыта" },
                ]}
                value={is_active}
                onChange={(value) => setValue("is_active", value)}
                error={errors.is_active?.message}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/admin/subcategories/${categoryId}`}
                  className="btn btn-secondary self-start text-center min-w-32 sm:min-w-0"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={disable}
                  className="btn btn-primary self-start min-w-32 sm:min-w-0"
                >
                  {disable ? "Обновление..." : "Обновить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
