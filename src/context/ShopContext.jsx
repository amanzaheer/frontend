import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs. ";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user && token) {
      // For logged-in users, add to server cart
      let cartData = { ...cartItems };
      if (cartData[itemId]) {
        cartData[itemId] = cartData[itemId] + 1;
      } else {
        cartData[itemId] = 1;
      }

      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          {
            itemId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setCartItems(cartData);
          toast.success("Item added to cart successfully");
        } else {
          toast.error(response.data.message || "Failed to add item to cart");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error adding item to cart");
      }
    } else {
      // For guest users, add to localStorage cart
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
      if (localCart[itemId]) {
        localCart[itemId] = localCart[itemId] + 1;
      } else {
        localCart[itemId] = 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(localCart));
      setCartItems(localCart);
      toast.success("Item added to cart successfully");
    }
  };

  const getCartCount = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    if (user && token) {
      // For logged-in users, count from state
      let totalCount = 0;
      for (const itemId in cartItems) {
        if (cartItems[itemId] && typeof cartItems[itemId] === "number") {
          totalCount += cartItems[itemId];
        }
      }
      return totalCount;
    } else {
      // For guest users, count from localStorage
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
      let totalCount = 0;
      for (const itemId in localCart) {
        if (localCart[itemId] && typeof localCart[itemId] === "number") {
          totalCount += localCart[itemId];
        }
      }
      return totalCount;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user && token) {
      // For logged-in users, update server cart
      let cartData = structuredClone(cartItems);

      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          {
            itemId,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          if (quantity > 0) {
            cartData[itemId] = quantity;
          } else {
            delete cartData[itemId];
          }
          setCartItems(cartData);
        } else {
          toast.error(response.data.message || "Failed to update cart");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error updating cart");
      }
    } else {
      // For guest users, update localStorage cart
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
      if (quantity > 0) {
        localCart[itemId] = quantity;
      } else {
        delete localCart[itemId];
      }
      localStorage.setItem("cartItems", JSON.stringify(localCart));
      setCartItems(localCart);
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const currentCart = user && token ? cartItems : JSON.parse(localStorage.getItem("cartItems") || "{}");
    
    for (const itemId in currentCart) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && currentCart[itemId] > 0) {
        totalAmount += itemInfo.price * currentCart[itemId];
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      console.log("Connecting to backend at:", backendUrl);
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products.reverse());
        console.log("Successfully fetched products from backend");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error connecting to backend:", error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.error(error);
      // Don't show error for cart fetch
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
