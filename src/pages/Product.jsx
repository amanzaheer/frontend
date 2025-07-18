import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaHeart,
  FaShare,
  FaLeaf,
  FaCheckCircle,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";
import RelatedProducts from "../components/RelatedProducts";
import { backendUrl, currency } from "../App";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { slug } = useParams();
  const { addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    if (!productData) {
      toast.error("Product not available");
      return;
    }

    if (productData.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    // Add the product to cart with the selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id);
    }
    
    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/${slug}`);
      if (response.data.status) {
        setProductData(response.data.product);
        console.log(response.data.product);
        setImage(response.data.product.image[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error loading product details");
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  return productData?.name ? (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Hero Section with Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button className="hover:text-green-600 transition-colors">
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <span>/</span>
            <span className="text-green-600 font-medium">{productData.category}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{productData.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div 
              className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={image}
                alt={productData.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
              
              {/* Overlay with Quick Actions */}
              <div className={`absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ${
                isHovered ? 'bg-opacity-20' : ''
              }`}>
                <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}>
                  <button
                    onClick={handleWishlist}
                    className={`p-3 rounded-full shadow-lg transition-all ${
                      isWishlisted 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <FaHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white text-gray-700 shadow-lg hover:bg-green-500 hover:text-white transition-all">
                    <FaShare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  productData.stock > 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {productData.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productData.image.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setImage(item)}
                  className={`flex-shrink-0 border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                    image === item
                      ? "border-green-500 shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <img
                    src={item}
                    alt={`${productData.name} - view ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  {productData.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.8)</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3">
                {productData.organic && (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                    <FaLeaf className="w-4 h-4" />
                    100% Organic
                  </div>
                )}
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Premium Quality
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-5xl font-bold text-gray-900">
                {currency} {productData.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${
                  productData.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="text-sm text-gray-600">
                  {productData.stock > 0 
                    ? `${productData.stock} units available` 
                    : 'Currently unavailable'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={productData.stock === 0}
                className={`flex-1 py-4 px-8 rounded-xl flex items-center justify-center gap-3 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  productData.stock > 0
                    ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <FaShoppingCart className="w-5 h-5" />
                {productData.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="py-4 px-6 rounded-xl border-2 border-green-600 text-green-600 font-semibold hover:bg-green-600 hover:text-white transition-all duration-300">
                <FaEye className="w-5 h-5" />
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-4">Select Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-3 border-x border-gray-200 font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    disabled={quantity >= productData.stock}
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Max: {productData.stock} units</p>
                  <p className="font-semibold text-green-600">
                    Total: {currency} {(productData.price * quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500 font-medium">Category</p>
                  <p className="text-gray-900">{productData.category}</p>
                </div>
                {productData.subCategory && (
                  <div className="space-y-1">
                    <p className="text-gray-500 font-medium">Sub Category</p>
                    <p className="text-gray-900">{productData.subCategory}</p>
                  </div>
                )}
                {productData.sizes?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-gray-500 font-medium">Available Sizes</p>
                    <p className="text-gray-900">{productData.sizes.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features/Guarantees */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaTruck className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">For orders above {currency} 5000</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUndo className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-sm text-gray-600">7 days return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaShieldAlt className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Secure Shopping</p>
                  <p className="text-sm text-gray-600">100% Protected & Safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-8 py-6 font-semibold transition-all duration-300 ${
                  activeTab === "description"
                    ? "border-b-2 border-green-500 text-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-8 py-6 font-semibold transition-all duration-300 ${
                  activeTab === "reviews"
                    ? "border-b-2 border-green-500 text-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Reviews (0)
              </button>
            </div>

            <div className="p-8">
              {activeTab === "description" ? (
                <div className="prose max-w-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
                      <div className="space-y-3">
                        {productData.description.split('\r\n').map((line, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600">{line}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Premium quality materials</li>
                        <li>• Eco-friendly packaging</li>
                        <li>• Long-lasting durability</li>
                        <li>• Easy maintenance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaStar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500">Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <RelatedProducts category={productData.category} currentProductId={productData._id} />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    </div>
  );
};

export default Product;
