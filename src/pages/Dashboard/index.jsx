import React from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function Dashboard({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-8xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
