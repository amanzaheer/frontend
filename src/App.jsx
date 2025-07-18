import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import OrderTracking from "./pages/OrderTracking";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";

// Admin Dashboard Components
import DashboardLayout from "./pages/Dashboard";
import AdminDashboard from "./pages/Dashboard/admin/Dashboard";
import AdminProducts from "./pages/Dashboard/admin/Products";
import AdminOrders from "./pages/Dashboard/admin/Orders";
import AdminUsers from "./pages/Dashboard/admin/Users";
import AdminStores from "./pages/Dashboard/admin/Stores";
import AddProduct from "./pages/Dashboard/Add";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "Rs.";

// Log the backend URL for debugging
console.log("Backend URL configured as:", backendUrl);

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const { pathname } = useLocation();

  // Check if the current path starts with "/dashboard"
  const isDashboardPath = pathname.startsWith("/dashboard");

  // Only show Navbar/Footer if you're NOT on a dashboard route
  const shouldShowNavbar = !isDashboardPath;
  const shouldShowFooter = !isDashboardPath;

  return (
    <div className="bg-gray-50">
      <ToastContainer />

      {/* Conditional Navbar */}
      {shouldShowNavbar && <Navbar />}

      <SearchBar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/verify" element={<Verify />} />

        {/* Admin Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            user?.role === "admin" ? (
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard/products"
          element={
            user?.role === "admin" ? (
              <DashboardLayout>
                <AdminProducts />
              </DashboardLayout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            user?.role === "admin" ? (
              <DashboardLayout>
                <AdminOrders />
              </DashboardLayout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard/users"
          element={
            user?.role === "admin" ? (
              <DashboardLayout>
                <AdminUsers />
              </DashboardLayout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard/stores"
          element={
            user?.role === "admin" ? (
              <DashboardLayout>
                <AdminStores />
              </DashboardLayout>
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard/add"
          element={
            user?.role === "admin" ? (
              <DashboardLayout>
                <AddProduct />
              </DashboardLayout>
            ) : (
              <Login />
            )
          }
        />
      </Routes>

      {/* Conditional Footer */}
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default App;
