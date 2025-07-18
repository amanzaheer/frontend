import React from "react";
import { FiPackage, FiCreditCard, FiHeadphones } from "react-icons/fi";

const policies = [
  {
    icon: <FiPackage className="w-12 h-12 text-green-600" />,
    title: "Receive Parcel, Then Cash",
    desc: "Pay only after your parcel arrives at your doorstep.",
  },
  {
    icon: <FiCreditCard className="w-12 h-12 text-green-600" />,
    title: "Open Parcel, Then Pay",
    desc: "Inspect your order before making payment for complete peace of mind.",
  },
  {
    icon: <FiHeadphones className="w-12 h-12 text-green-600" />,
    title: "24/7 Customer Support",
    desc: "Our team is always here to help you, day or night.",
  },
];

const OurPolicy = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {policies.map((policy, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 transition-transform hover:-translate-y-2 hover:shadow-2xl border border-green-100"
          >
            <div className="bg-green-100 rounded-full p-4 mb-5 flex items-center justify-center shadow">
              {policy.icon}
            </div>
            <p className="font-bold text-green-700 text-lg mb-2 text-center">
              {policy.title}
            </p>
            <p className="text-gray-500 text-center text-base">
              {policy.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPolicy;
