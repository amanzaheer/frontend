import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { backendUrl, currency } from "../App";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaCreditCard, FaCheckCircle } from "react-icons/fa";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getCartCount, getCartAmount } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Initialize form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if user is logged in
    if (!user || !token) {
      setIsGuest(true);
    } else {
      // Pre-fill form with user data if logged in
      setFormData({
        name: user.name || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      });
    }
    
    fetchCartAndProducts();
  }, []);

  const fetchCartAndProducts = async () => {
    try {
      // Get cart items from localStorage for guest users
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
      
      if (isGuest || !token) {
        // For guest users, use localStorage cart
        const productIds = Object.keys(localCart);
        if (productIds.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch products for cart items
        const productsResponse = await axios.get(`${backendUrl}/api/product/list`);
        const productsMap = productsResponse.data.products.reduce((acc, product) => {
          acc[product._id] = product;
          return acc;
        }, {});

        const cartItems = Object.entries(localCart).map(([productId, quantity]) => {
          const product = productsMap[productId];
          return {
            _id: productId,
            quantity: quantity,
            name: product?.name || "Product Not Found",
            price: product?.price || 0,
            image: product?.image?.[0] || "/placeholder-image.jpg",
            slug: product?.slug,
          };
        });

        setCartItems(cartItems);
      } else {
        // For logged-in users, fetch from server
        const cartResponse = await axios.post(`${backendUrl}/api/cart/get`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const productsResponse = await axios.get(`${backendUrl}/api/product/list`);
        const productsMap = productsResponse.data.products.reduce((acc, product) => {
          acc[product._id] = product;
          return acc;
        }, {});

        const cartItems = Object.entries(cartResponse.data.cartData || {}).map(([productId, quantity]) => {
          const product = productsMap[productId];
          return {
            _id: productId,
            quantity: quantity,
            name: product?.name || "Product Not Found",
            price: product?.price || 0,
            image: product?.image?.[0] || "/placeholder-image.jpg",
            slug: product?.slug,
          };
        });

        setCartItems(cartItems);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart and products:", error);
      setLoading(false);
      setCartItems([]);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          slug: item.slug,
        })),
        amount: calculateTotal(),
        address: formData,
        paymentMethod: method.toUpperCase(),
        payment: false,
        date: Date.now(),
      };

      // Add user info based on whether it's a guest or logged-in user
      if (isGuest || !user) {
        orderData.guestInfo = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        };
      } else {
        orderData.userId = user._id;
      }

      if (method === "cod") {
        const response = await axios.post(`${backendUrl}/api/order/place`, orderData);

        if (response.data.success) {
          // Clear cart after successful order
          if (isGuest || !token) {
            localStorage.removeItem("cartItems");
          } else {
            await axios.post(`${backendUrl}/api/cart/clear`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
          
          toast.success("Order placed successfully!");
          
          // Redirect to order tracking page with order details
          const trackingUrl = `/track-order?orderId=${response.data.order._id}&email=${formData.email}`;
          navigate(trackingUrl);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  const handlePlaceOrderClick = (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    
    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setShowModal(false);
    
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          slug: item.slug,
        })),
        amount: calculateTotal(),
        address: formData,
        paymentMethod: method.toUpperCase(),
        payment: false,
        date: Date.now(),
      };

      // Add user info based on whether it's a guest or logged-in user
      if (isGuest || !user) {
        orderData.guestInfo = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        };
      } else {
        orderData.userId = user._id;
      }

      if (method === "cod") {
        const response = await axios.post(`${backendUrl}/api/order/place`, orderData);

        if (response.data.success) {
          // Clear cart after successful order
          if (isGuest || !token) {
            localStorage.removeItem("cartItems");
          } else {
            await axios.post(`${backendUrl}/api/cart/clear`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
          // Show success popup with order ID
          setOrderSuccess({
            orderId: response.data.orderId,
            email: formData.email
          });
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
            <button
              onClick={() => navigate("/collection")}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaCheckCircle className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Order</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isGuest ? "Complete your order as a guest" : "Please complete your order details"}
          </p>
          {isGuest && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              No account required - you can order as a guest!
            </p>
          )}
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Column - Customer Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                  <p className="text-gray-600">Please provide your delivery details</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <InputField
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={onChangeHandler}
                error={errors.name}
                icon={FaUser}
                required
              />
              <InputField
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={onChangeHandler}
                error={errors.email}
                icon={FaEnvelope}
                required
              />
              <InputField
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={onChangeHandler}
                error={errors.phone}
                icon={FaPhone}
                required
              />
              <InputField
                name="address"
                placeholder="Complete Address"
                value={formData.address}
                onChange={onChangeHandler}
                error={errors.address}
                icon={FaMapMarkerAlt}
                required
              />
              <InputField
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={onChangeHandler}
                error={errors.city}
                icon={FaCity}
                required
              />
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-8">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaCreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                  <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your order</p>
                </div>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {currency} {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span className="text-green-600">{currency} {calculateTotal().toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Free delivery included</p>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaCreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-gray-600">Choose your preferred payment option</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <PaymentOption
                  selected={method === "cod"}
                  onClick={() => setMethod("cod")}
                  icon="💳"
                  label="Cash on Delivery"
                  description="Pay when you receive your order"
                />
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrderClick}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Review & Place Order"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Popup for Order Review */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-fadeInUp">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Review Your Order</h2>
                <button
                  className="text-gray-400 hover:text-gray-700 text-2xl font-bold p-1"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 space-y-6">
              {/* Delivery Information */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 text-sm md:text-base">Delivery Information</h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-gray-600">
                    <span className="font-medium min-w-[60px] sm:min-w-[80px]">Name:</span>
                    <span className="break-words">{formData.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-gray-600">
                    <span className="font-medium min-w-[60px] sm:min-w-[80px]">Email:</span>
                    <span className="break-all">{formData.email}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-gray-600">
                    <span className="font-medium min-w-[60px] sm:min-w-[80px]">Phone:</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start text-xs md:text-sm text-gray-600">
                    <span className="font-medium min-w-[60px] sm:min-w-[80px] mt-1 sm:mt-0">Address:</span>
                    <span className="break-words">{formData.address}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-gray-600">
                    <span className="font-medium min-w-[60px] sm:min-w-[80px]">City:</span>
                    <span>{formData.city}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 text-sm md:text-base">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-gray-700 font-semibold text-sm md:text-base">
                          {currency} {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-base md:text-lg">Total:</span>
                  <span className="text-green-600 font-bold text-base md:text-lg">
                    {currency} {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 text-sm md:text-base">Payment Method</h3>
                <div className="flex items-center gap-2 p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-green-700 font-medium text-sm md:text-base">
                    {method === 'cod' ? 'Cash on Delivery' : method}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer - Sticky */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 md:px-6 py-4 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    "Confirm Order"
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeInUp text-center">
            <div className="p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-green-700">Order Placed Successfully!</h2>
              <p className="mb-4 text-gray-700 text-sm md:text-base">Your order has been placed. You can track your order using the Order ID below:</p>
              <div className="mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-1 sm:gap-2">
                  <span className="font-semibold text-gray-900 text-sm md:text-base">Order ID:</span>
                  <span className="text-green-700 font-mono text-sm md:text-lg break-all">{orderSuccess.orderId}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  navigate(`/track-order?orderId=${orderSuccess.orderId}&email=${orderSuccess.email}`);
                }}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm md:text-base"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required,
}) => (
  <div>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full pl-10 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      />
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <span>⚠</span>
        {error}
      </p>
    )}
  </div>
);

const PaymentOption = ({ selected, onClick, icon, label, description }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
      selected
        ? "border-green-600 bg-green-50 shadow-lg"
        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
    }`}
  >
    <span className="text-2xl">{icon}</span>
    <div className="flex-1">
      <span className="font-semibold text-gray-900">{label}</span>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
    {selected && (
      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    )}
  </div>
);

export default PlaceOrder;
