import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl, currency } from "../App";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const { getCartCount, updateQuantity, getCartAmount } = useContext(ShopContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch both cart and products on mount
  useEffect(() => {
    fetchCartAndProducts();
  }, []);

  const fetchCartAndProducts = async () => {
    try {
      let cartData = {};

      if (user && token) {
        // For logged-in users, fetch from server
        const cartResponse = await fetch(`${backendUrl}/api/cart/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const response = await cartResponse.json();
        cartData = response.cartData || {};
      } else {
        // For guest users, use localStorage
        cartData = JSON.parse(localStorage.getItem("cartItems") || "{}");
      }

      // Fetch all products
      const productsResponse = await fetch(`${backendUrl}/api/product/list`);
      const productsData = await productsResponse.json();

      // Create a map of products by ID for easy lookup
      const productsMap = productsData.products.reduce((acc, product) => {
        acc[product._id] = product;
        return acc;
      }, {});

      // Combine cart quantities with product details
      const cartItems = Object.entries(cartData).map(([productId, quantity]) => {
        const product = productsMap[productId];
        return {
          _id: productId,
          quantity: quantity,
          name: product?.name || "Product Not Found",
          price: product?.price || 0,
          image: product?.image?.[0] || "/placeholder-image.jpg",
          stock: product?.stock || 0,
        };
      });

      setCartItems(cartItems);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart and products:", error);
      setLoading(false);
      setCartItems([]);
    }
  };

  const handleQuantityUpdate = async (itemId, quantity) => {
    const currentItem = cartItems.find((item) => item._id === itemId);
    if (quantity > currentItem.stock) {
      toast.error("No more stock available.");
      return;
    }

    try {
      await updateQuantity(itemId, quantity);
      
      // Update the local state immediately for better UX
      setCartItems(
        (prevItems) =>
          prevItems
            .map((item) =>
              item._id === itemId ? { ...item, quantity: quantity } : item
            )
            .filter((item) => item.quantity > 0) // Remove items with quantity 0
      );

      // Then refresh the cart data
      fetchCartAndProducts();
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/collection")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            {cartItems?.map((item) => (
              <div key={item._id} className="flex gap-4 border-b py-6">
                <img
                  src={item.image || "/placeholder-image.jpg"}
                  alt={item.name || "Product"}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">
                    {item.name || "Product"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {currency} {(item.price || 0).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            item._id,
                            (item.quantity || 1) - 1
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={(item.quantity || 1) <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityUpdate(
                            item._id,
                            (item.quantity || 1) + 1
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleQuantityUpdate(item._id, 0)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {currency} {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{currency} {calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{currency} {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/place-order")}
                className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700 transition-colors"
              >
                {user ? "Proceed to Checkout" : "Checkout as Guest"}
              </button>
              {!user && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  No account required - you can order as a guest!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
