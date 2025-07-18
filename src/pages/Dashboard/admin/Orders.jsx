import React, { useState, useEffect } from "react";
import { FaShoppingBag, FaSearch } from "react-icons/fa";
import { format, isValid } from "date-fns";
import { toast } from "react-hot-toast";
import { backendUrl, currency } from "../../../App";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/order/list`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const ordersList = data.orders || [];
        setOrders(ordersList);
        setFilteredOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterOrders(query, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterOrders(search, status);
  };

  const filterOrders = (searchQuery, status) => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchQuery) ||
          order.address?.firstName?.toLowerCase().includes(searchQuery) ||
          order.address?.lastName?.toLowerCase().includes(searchQuery) ||
          order.address?.email?.toLowerCase().includes(searchQuery)
      );
    }

    if (status !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === status
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/order/status`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders(
        filteredOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, "MMM dd, yyyy");
      }
      return "N/A";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const TrackingModal = ({ order, onClose, onUpdate }) => {
    const [status, setStatus] = useState("");
    const [comment, setComment] = useState("");
    const [estimatedDelivery, setEstimatedDelivery] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication required");
          return;
        }

        console.log("Making request with token:", token);

        const response = await fetch(
          `${backendUrl}/api/order/tracking/${order._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status,
              comment,
              estimatedDelivery,
            }),
          }
        );

        const data = await response.json();
        console.log("Response:", {
          status: response.status,
          data,
        });

        if (!response.ok) {
          throw new Error(data.message || "Failed to update tracking");
        }

        toast.success("Tracking updated successfully");
        onUpdate();
        onClose();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Failed to update tracking");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Update Tracking</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Estimated Delivery
              </label>
              <input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaShoppingBag className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Orders Management
              </h2>
              <p className="text-gray-500 text-sm">Manage customer orders</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by order ID, customer name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="min-w-[150px] px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.address?.firstName} {order.address?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.address?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currency} {order.amount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowTrackingModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Update Status
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <TrackingModal
          order={selectedOrder}
          onClose={() => {
            setShowTrackingModal(false);
            setSelectedOrder(null);
          }}
          onUpdate={() => {
            // Refresh orders
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
