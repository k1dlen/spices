import { createContext, useEffect, useState, useContext } from "react";
import { apiUrl, userToken } from "@components/common/http";
import { AuthContext } from "@components/context/Auth";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [shipping, setShipping] = useState(200);

  const mergeLocalCartToServer = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!user || localCart.length === 0) return;

    let serverCart = [];
    try {
      const res = await fetch(`${apiUrl}/cart`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
      });
      if (res.ok) {
        const result = await res.json();
        serverCart = result.data;
      }
    } catch (error) {
      console.error(error);
    }

    const mergedCart = [...serverCart];

    localCart.forEach((localItem) => {
      const index = mergedCart.findIndex(
        (s) => s.product.id === localItem.product.id
      );
      if (index >= 0) {
        mergedCart[index].quantity += localItem.quantity;
      } else {
        mergedCart.push({
          product_id: localItem.product.product_id || localItem.id,
          quantity: localItem.quantity,
          product: {
            id: localItem.product.product_id || localItem.id,
            name: localItem.product.name,
            price: localItem.product.price,
            discount: localItem.product.discount || 0,
            grams: localItem.product.grams || 0,
            image_url: localItem.product.image_url,
          },
        });
      }
    });

    for (const item of mergedCart) {
      const existing = serverCart.find((s) => s.product.id === item.product_id);
      if (existing) {
        await fetch(`${apiUrl}/cart/${existing.id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
          body: JSON.stringify({
            quantity: item.quantity,
          }),
        });
      } else {
        await fetch(`${apiUrl}/cart`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
          body: JSON.stringify({
            product_id: item.product_id,
            quantity: item.quantity,
          }),
        });
      }
    }

    setCartData(mergedCart);
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    mergeLocalCartToServer();
  }, [user]);

  const fetchCart = async () => {
    if (user) {
      setLoader(true);
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          setCartData(result.data);
          setLoader(false);
        } else {
          toast.error("Ошибка при получении корзины");
        }
      } catch (error) {
        console.error("Ошибка сети или парсинга");
        toast.error("Сервер недоступен. Проверьте подключение.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoader(true);

      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const mappedCart = localCart.map((item) => ({
        ...item,
        product: {
          id: item.product_id || item.product?.id,
          product_id: item.product_id || item.product?.id,
          name: item.name || item.product?.name,
          price: item.price || item.product?.price,
          image_url: item.image || item.product?.image_url,
          grams: item.grams || item.product?.grams,
          discount: item.discount || item.product?.discount || 0,
        },
      }));

      setCartData(mappedCart);
      setLoader(false);
    }
  }, [user]);

  const saveLocalCart = (data) => {
    localStorage.setItem("cart", JSON.stringify(data));
    setCartData(data);
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
          body: JSON.stringify({ product_id: product.id, quantity }),
        });

        const result = await res.json();

        if (res.ok) {
          const newCartItem = result.data;
          setCartData((prev) => {
            const existing = prev.find((item) => item.id === newCartItem.id);
            if (existing) {
              return prev.map((item) =>
                item.id === newCartItem.id ? newCartItem : item
              );
            } else {
              return [...prev, newCartItem];
            }
          });
        } else {
          toast.error("Ошибка при добавлении в корзину");
        }
      } catch (error) {
        console.error("Ошибка сети или парсинга");
        toast.error("Сервер недоступен. Проверьте подключение.");
      }
    } else {
      const existing = cartData.find(
        (item) => (item.product.product_id || item.product.id) === product.id
      );

      let updatedCart;
      if (existing) {
        updatedCart = cartData.map((item) =>
          (item.product.product_id || item.product.id) === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [
          ...cartData,
          {
            quantity,
            product: {
              id: product.id,
              product_id: product.id,
              name: product.name,
              price: product.price,
              grams: product.grams,
              discount: product.discount || 0,
              image_url: product.image_url,
            },
          },
        ];
      }
      saveLocalCart(updatedCart);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (user) {
      try {
        const res = await fetch(`${apiUrl}/cart/${itemId}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
          body: JSON.stringify({ quantity: quantity, id: itemId }),
        });

        const result = await res.json();

        if (res.ok) {
          const updatedItem = result.data;
          setCartData((prev) =>
            prev.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            )
          );
        } else {
          toast.error("Ошибка при обновлении товара в корзине");
        }
      } catch (error) {
        console.error("Ошибка сети или парсинга");
        toast.error("Сервер недоступен. Проверьте подключение.");
      }
    } else {
      const updatedCart = cartData.map((item) =>
        item.id === itemId || item.product.product_id === itemId
          ? { ...item, quantity }
          : item
      );
      saveLocalCart(updatedCart);
    }
  };

  const deleteCartItem = async (itemId) => {
    if (user) {
      try {
        const res = await fetch(`${apiUrl}/cart/${itemId}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          fetchCart();
          toast.success(result.message);
        } else {
          toast.error("Ошибка при удалении товара из корзины");
        }
      } catch (error) {
        console.error("Ошибка сети или парсинга");
        toast.error("Сервер недоступен. Проверьте подключение.");
      }
    } else {
      const updatedCart = cartData.filter(
        (item) => item.id !== itemId && item.product.product_id !== itemId
      );
      saveLocalCart(updatedCart);
    }
  };

  const getItemTotal = (item) => {
    if (!item || !item.product) return 0;
    return +(item.product.price * item.quantity).toFixed(2);
  };

  const getQuantity = () => {
    return cartData.length;
  };

  const subTotal = () => {
    return cartData.reduce(
      (sum, item) => sum + item?.quantity * item.product?.price,
      0
    );
  };

  const shippingCost = () => {
    const subtotal = subTotal();
    return subtotal >= 1000 ? 0 : shipping;
  };

  const totalDiscount = () =>
    cartData.reduce((sum, item) => {
      const discountAmount =
        item.product?.discount > 0
          ? ((item.product?.price * item.product?.discount) / 100) *
            item?.quantity
          : 0;
      return sum + discountAmount;
    }, 0);
  const grandTotal = () => subTotal() - totalDiscount() + shippingCost();

  return (
    <CartContext.Provider
      value={{
        cartData,
        addToCart,
        updateCartItem,
        deleteCartItem,
        getQuantity,
        getItemTotal,
        subTotal,
        shippingCost,
        totalDiscount,
        grandTotal,
        loader,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
