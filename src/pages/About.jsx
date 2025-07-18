import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { FaCheckCircle, FaTruck, FaHeadset, FaShieldAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Title text1={"ABOUT"} text2={"US"} />
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our story and commitment to bringing you the finest products
        </p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
        <div className="relative">
          <img
            className="w-full rounded-lg shadow-lg"
            src={assets.about_img}
            alt="About Bagh-e-Stan"
          />
          <div className="absolute -bottom-6 -right-6 bg-green-50 rounded-lg p-6 shadow-lg hidden lg:block">
            <div className="text-4xl font-bold text-green-600">10+</div>
            <div className="text-gray-600">Years of Excellence</div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Your Trusted Shopping Destination
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Bagh-e-Stan was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>

          <div className="pt-6 border-t">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our mission at Bagh-e-Stan is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaCheckCircle className="text-4xl text-green-500" />,
              title: "Quality Assurance",
              description:
                "We meticulously select and vet each product to ensure it meets our stringent quality standards.",
            },
            {
              icon: <FaTruck className="text-4xl text-green-500" />,
              title: "Fast Delivery",
              description:
                "With our user-friendly interface and hassle-free ordering process, shopping has never been easier.",
            },
            {
              icon: <FaHeadset className="text-4xl text-green-500" />,
              title: "24/7 Support",
              description:
                "Our team of dedicated professionals is here to assist you every step of the way.",
            },
            {
              icon: <FaShieldAlt className="text-4xl text-green-500" />,
              title: "Secure Shopping",
              description:
                "Your security is our priority. Shop with confidence knowing your data is protected.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-50 rounded-2xl p-12 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { number: "10K+", label: "Happy Customers" },
            { number: "5K+", label: "Products Available" },
            { number: "15+", label: "Categories" },
            { number: "24/7", label: "Customer Support" },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
    </div>
  );
};

export default About;
