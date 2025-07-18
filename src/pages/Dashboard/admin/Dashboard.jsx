import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaStore,
  FaChartLine,
  FaPlus,
} from "react-icons/fa";
import { backendUrl } from "../../../App";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch products count
      const productsResponse = await fetch(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const productsData = await productsResponse.json();
      
      // Fetch orders count
      const ordersResponse = await fetch(`${backendUrl}/api/order/list`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const ordersData = await ordersResponse.json();
      
      // Calculate revenue
      const totalRevenue = ordersData.orders?.reduce((sum, order) => {
        return sum + (order.amount || 0);
      }, 0) || 0;

      setStats({
        totalProducts: productsData.products?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalUsers: 0, // We'll implement this later
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link to={link} className="block">
      <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading ? "..." : value}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );

  const QuickActionCard = ({ title, description, icon, link, color }) => (
    <Link to={link} className="block">
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Amana Organics Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<FaBox className="text-2xl text-blue-600" />}
          color="border-blue-500"
          link="/dashboard/products"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingBag className="text-2xl text-green-600" />}
          color="border-green-500"
          link="/dashboard/orders"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="text-2xl text-purple-600" />}
          color="border-purple-500"
          link="/dashboard/users"
        />
        <StatCard
          title="Total Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={<FaChartLine className="text-2xl text-orange-600" />}
          color="border-orange-500"
          link="/dashboard/orders"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Add New Product"
            description="Add a new natural product to the store"
            icon={<FaPlus className="text-xl text-white" />}
            link="/dashboard/add"
            color="bg-green-500"
          />
          <QuickActionCard
            title="Manage Products"
            description="View and edit existing products"
            icon={<FaBox className="text-xl text-white" />}
            link="/dashboard/products"
            color="bg-blue-500"
          />
          <QuickActionCard
            title="View Orders"
            description="Check and manage customer orders"
            icon={<FaShoppingBag className="text-xl text-white" />}
            link="/dashboard/orders"
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaBox className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Products Management</p>
              <p className="text-sm text-gray-600">Manage your natural products inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaShoppingBag className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Order Management</p>
              <p className="text-sm text-gray-600">Track and manage customer orders</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaUsers className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">User Management</p>
              <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 