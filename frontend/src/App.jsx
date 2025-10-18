import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import RouteTokenChecker from "./components/common/RouteTokenChecker";
import NotFound from "@components/NotFound";
import { Layout } from "./components/common/Layout";
import Loader from "@components/common/Loader";
import Home from "@components/Home";
import Catalog from "@components/Catalog";
import Product from "@components/Product";
import Cart from "@components/Cart";
import Checkout from "@components/Checkout";
import Profile from "@components/profile/Profile";
import MyOrders from "@components/profile/MyOrders";
import { default as UserLogin } from "@components/profile/Login";
import { ToastContainer } from "react-toastify";
import { RequireAuth } from "@components/profile/RequireAuth";
import Register from "@components/profile/Register";

import { AdminRequireAuth } from "@components/admin/AdminRequireAuth";

const Login = lazy(() => import("@components/admin/Login"));
const Dashboard = lazy(() => import("@components/admin/Dashboard"));

const ShowCategories = lazy(() => import("@components/admin/category/Show"));
const CreateCategory = lazy(() => import("@components/admin/category/Create"));
const EditCategory = lazy(() => import("@components/admin/category/Edit"));

const ShowSubcategories = lazy(() =>
  import("@components/admin/subcategory/Show")
);
const CreateSubcategory = lazy(() =>
  import("@components/admin/subcategory/Create")
);
const EditSubcategory = lazy(() =>
  import("@components/admin/subcategory/Edit")
);

const ShowProducts = lazy(() => import("@components/admin/product/Show"));
const CreateProducts = lazy(() => import("@components/admin/product/Create"));
const EditProduct = lazy(() => import("@components/admin/product/Edit"));

const ShowOrders = lazy(() => import("@components/admin/orders/Show"));
const OrderDetails = lazy(() => import("@components/admin/orders/Details"));

function App() {
  return (
    <>
      <BrowserRouter>
        <RouteTokenChecker />
        <Layout>
          <Routes>
            {/*User Routes */}

            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account/login" element={<UserLogin />} />
            <Route path="/account/register" element={<Register />} />

            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="/profile/orders" element={<MyOrders />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <Dashboard />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/categories"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <ShowCategories />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/categories/create"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <CreateCategory />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/categories/edit/:id"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <EditCategory />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/subcategories/:id"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <ShowSubcategories />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/subcategories/:id/create"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <CreateSubcategory />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/subcategories/:categoryId/edit/:subcategoryId"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <EditSubcategory />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/products"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <ShowProducts />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/products/create"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <CreateProducts />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/products/edit/:productId"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <EditProduct />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/orders"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <ShowOrders />
                  </Suspense>
                </AdminRequireAuth>
              }
            />
            <Route
              path="admin/orders/:id"
              element={
                <AdminRequireAuth>
                  <Suspense
                    fallback={
                      <div className="sm:my-10 lg:my-20">
                        <Loader />
                      </div>
                    }
                  >
                    <OrderDetails />
                  </Suspense>
                </AdminRequireAuth>
              }
            />

            {/* Nonexistent route*/}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{ backgroundColor: " #fefbf8" }}
      />
    </>
  );
}

export default App;
