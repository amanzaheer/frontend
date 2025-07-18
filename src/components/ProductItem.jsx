import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa";

const ProductItem = ({ slug, image, name, price, discount, rating = 4.5, isNew = false, isBestSeller = false }) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(slug, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const originalPrice = discount ? price / (1 - discount / 100) : price;

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-1"
      to={`/product/${slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
            NEW
          </span>
        )}
        {isBestSeller && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
            BEST SELLER
          </span>
        )}
        {discount && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
          isWishlisted 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white shadow-md'
        }`}
      >
        <FaHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative w-full pb-[120%] overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-50 bg-center bg-cover transform transition-all duration-700 ease-out"
          style={{ 
            backgroundImage: `url(${image[0]})`,
            transform: isHovered ? 'scale(110%) rotate(2deg)' : 'scale(100%) rotate(0deg)'
          }}
        >
          {/* Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Quick Actions - Centered and Stacked */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <FaShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button className="flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                <FaEye className="w-4 h-4" />
                Quick View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({rating})</span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 leading-tight group-hover:text-green-600 transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-gray-900">
            <span className="text-sm font-normal text-gray-500 mr-1">
              {currency}
            </span>
            {price.toFixed(2)}
          </p>
          {discount && (
            <p className="text-sm text-gray-500 line-through">
              {currency}{originalPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-green-600 font-medium">In Stock</span>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
        isHovered ? 'border-green-200 opacity-100' : 'border-transparent opacity-0'
      }`} />
    </Link>
  );
};

export default ProductItem;
