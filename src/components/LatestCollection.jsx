import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { FaArrowRight, FaLeaf, FaStar } from "react-icons/fa";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Get the latest 8 products for the collection
    const latest = products.slice(0, 8);
    setLatestProducts(latest);
  }, [products]);

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FaLeaf className="w-4 h-4" />
            <span>Fresh Arrivals</span>
          </div>
          
          <Title text1={"LATEST"} text2={"COLLECTIONS"} />
          
          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Discover our newest arrivals, carefully curated for the modern lifestyle. 
            Each piece tells a story of quality and contemporary design, bringing nature's 
            beauty into your home.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{latestProducts.length}</div>
              <div className="text-sm text-gray-500">New Products</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-500">Organic</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <FaStar className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold text-green-600">4.9</span>
              </div>
              <div className="text-sm text-gray-500">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {latestProducts.map((item, index) => (
            <div 
              key={index}
              className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <ProductItem
                slug={item.slug}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-green-100">
            <span className="text-green-700 font-semibold">View All Collections</span>
            <FaArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default LatestCollection;
