import React from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowLeftStartOnRectangleIcon,
  InboxStackIcon,
  ListBulletIcon,
  PlusCircleIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { FaBox, FaBoxesPacking, FaShop } from "react-icons/fa6";

const linkBaseClass =
  "flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300";
const activeLinkClass =
  "bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-primary/20";
const inactiveLinkClass =
  "text-gray-600 hover:bg-gray-100/50 hover:scale-[1.02]";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <Squares2X2Icon className="w-5 h-5" />,
    roles: ["admin", "vendor"],
  },
  {
    to: "/dashboard/add",
    label: "Add Product",
    icon: <PlusCircleIcon className="w-5 h-5" />,
    roles: ["vendor"],
  },
  {
    to: "/dashboard/list",
    label: "List Items",
    icon: <ListBulletIcon className="w-5 h-5" />,
    roles: ["vendor"],
  },
  {
    to: "/dashboard/orders",
    label: "Orders",
    icon: <InboxStackIcon className="w-5 h-5" />,
    roles: ["vendor"],
  },
  {
    to: "/dashboard/customers",
    label: "Customers",
    icon: <UsersIcon className="w-5 h-5" />,
    roles: ["vendor"],
  },
  {
    to: "/dashboard/users",
    label: "Users",
    icon: <UsersIcon className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    to: "/dashboard/stores",
    label: "Stores",
    icon: <FaShop className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    to: "/dashboard/products",
    label: "Products",
    icon: <FaBox className="w-5 h-5" />,
    roles: ["admin"],
  },
  {
    to: "/dashboard/orders",
    label: "Orders",
    icon: <FaBoxesPacking className="w-5 h-5" />,
    roles: ["admin"],
  },
];

export default function DashboardSidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Reusable NavLink class helper
  const navLinkClass = ({ isActive, isPending }) =>
    isActive
      ? `${linkBaseClass} ${activeLinkClass}`
      : `${linkBaseClass} ${inactiveLinkClass}`;

  return (
    <div className="w-[280px] h-screen sticky top-0 bg-gradient-to-b flex flex-col justify-between p-6 from-white to-gray-50 border-r border-gray-100">
      {/* User Info */}
      <div>
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {user?.name}
          </h1>
          <p className="font-medium text-gray-700 mt-1">
            {user?.role === "admin" ? "Admin" : "Store"} Dashboard
          </p>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back!</p>
        </div>

        {/* Navigation Items - Updated with role filter */}
        {navItems
          .filter((item) => item.roles.includes(user?.role))
          .map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end className={navLinkClass}>
              {icon}
              <p className="hidden md:block font-medium">{label}</p>
            </NavLink>
          ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={`mt-auto ${linkBaseClass} bg-gradient-to-r from-secondary to-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]`}
      >
        <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
        <p className="hidden md:block font-medium">Logout</p>
      </button>
    </div>
  );
}
