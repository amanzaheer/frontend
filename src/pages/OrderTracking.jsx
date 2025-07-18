import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaTruck, FaCheckCircle, FaClock, FaBox, FaHome } from "react-icons/fa";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const orderStatuses = [
    { id: "pending", label: "Order Placed", icon: FaClock, color: "text-yellow-600" },
    { id: "confirmed", label: "Order Confirmed", icon: FaCheckCircle, color: "text-blue-600" },
    { id: "processing", label: "Processing", icon: FaBox, color: "text-purple-600" },
    { id: "shipped", label: "Shipped", icon: FaTruck, color: "text-orange-600" },
    { id: "delivered", label: "Delivered", icon: FaHome, color: "text-green-600" }
  ];

  const getStatusIndex = (status) => {
    return orderStatuses.findIndex(s => s.id === status);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderId.trim() && !email.trim()) {
      toast.error("Please enter Order ID or Email");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/order/track`, {
        params: { orderId: orderId.trim(), email: email.trim() }
      });

      if (response.data.success) {
        setOrder(response.data.order);
        setSearched(true);
      } else {
        toast.error(response.data.message || "Order not found");
        setOrder(null);
        setSearched(true);
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error(error.response?.data?.message || "Failed to track order");
      setOrder(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Track Your Order</h1>
          <p className="text-base md:text-lg text-gray-600 px-4">
            Enter your Order ID or Email to track your order status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
          <form onSubmit={handleSearch} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your Order ID"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <FaSearch className="w-4 h-4 md:w-5 md:h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {searched && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
            {order ? (
              <div className="space-y-6 md:space-y-8">
                {/* Order Header */}
                <div className="border-b border-gray-200 pb-4 md:pb-6">
                  <div className="flex flex-col gap-3 md:gap-4">
                    <div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 break-all">
                        Order #{order._id}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xl md:text-2xl font-bold text-green-600">
                        {currency} {order.amount.toFixed(2)}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Order Status</h3>
                  <div className="relative">
                    <div className="absolute left-3 md:left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    {orderStatuses.map((status, index) => {
                      const currentIndex = getStatusIndex(order.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      
                      return (
                        <div key={status.id} className="relative flex items-start md:items-center mb-6 md:mb-8">
                          <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-green-600 border-green-600' 
                              : 'bg-white border-gray-300'
                          }`}>
                            <status.icon className={`w-3 h-3 md:w-4 md:h-4 ${
                              isCompleted ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="ml-4 md:ml-6 flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm md:text-base ${
                              isCompleted ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {status.label}
                            </h4>
                            {isCurrent && (
                              <p className="text-xs md:text-sm text-green-600 font-medium mt-1">
                                Current Status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Order Items</h3>
                  <div className="space-y-3 md:space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">{item.name}</h4>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900 text-sm md:text-base">
                            {currency} {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Delivery Information</h3>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Name</p>
                        <p className="text-gray-900 break-words">{order.address.name}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Email</p>
                        <p className="text-gray-900 break-all">{order.address.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Phone</p>
                        <p className="text-gray-900">{order.address.phone}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="font-medium text-gray-700 mb-1">Address</p>
                        <p className="text-gray-900 break-words">{order.address.address}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">City</p>
                        <p className="text-gray-900">{order.address.city}</p>
                      </div>
                      {order.address.pincode && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Pincode</p>
                          <p className="text-gray-900">{order.address.pincode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Payment Information</h3>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-gray-700">Payment Method</span>
                        <span className="text-gray-900">{order.paymentMethod}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-gray-700">Payment Status</span>
                        <span className={`font-medium ${
                          order.payment ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {order.payment ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="text-gray-400 mb-4">
                  <FaSearch className="w-12 h-12 md:w-16 md:h-16 mx-auto" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
                <p className="text-sm md:text-base text-gray-600 px-4">
                  We couldn't find an order with the provided information. Please check your Order ID or Email and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 