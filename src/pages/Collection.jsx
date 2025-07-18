import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { FaFilter, FaChevronDown, FaTimes, FaSearch, FaTh, FaList } from "react-icons/fa";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange({ min: "", max: "" });
    setSortType("relevant");
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Price range filter
    if (priceRange.min !== "" || priceRange.max !== "") {
      productsCopy = productsCopy.filter((item) => {
        const price = parseFloat(item.price);
        const min = priceRange.min !== "" ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max !== "" ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      case "name-asc":
        setFilterProducts(fpCopy.sort((a, b) => a.name.localeCompare(b.name)));
        break;
      case "name-desc":
        setFilterProducts(fpCopy.sort((a, b) => b.name.localeCompare(a.name)));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const activeFiltersCount = category.length + subCategory.length + (priceRange.min !== "" ? 1 : 0) + (priceRange.max !== "" ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium plants and gardening essentials
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All Products
            </h2>
            <p className="text-gray-600">
              {filterProducts.length} of {products.length} products
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-green-100 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-green-100 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaList className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              onChange={(e) => setSortType(e.target.value)}
              value={sortType}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-sm"
            >
              <option value="relevant">Sort by: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <FaFilter className="text-gray-600" />
              <span className="font-medium text-sm">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Active Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {cat}
                  <button
                    onClick={() => toggleCategory({ target: { value: cat } })}
                    className="ml-1 hover:text-green-900"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {subCategory.map((subCat) => (
                <span key={subCat} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {subCat}
                  <button
                    onClick={() => toggleSubCategory({ target: { value: subCat } })}
                    className="ml-1 hover:text-blue-900"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(priceRange.min !== "" || priceRange.max !== "") && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  Price: ${priceRange.min || "0"} - ${priceRange.max || "∞"}
                  <button
                    onClick={() => setPriceRange({ min: "", max: "" })}
                    className="ml-1 hover:text-purple-900"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            {/* Filter Content */}
            <div
              className={`${
                showFilter ? "block" : "hidden"
              } lg:block space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200`}
            >
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="∞"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Categories</h4>
                <div className="space-y-3">
                  {[
                    "Plants",
                    "Gardening Tools",
                    "Pots and Containers",
                    "Soil and Fertilizers",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={category.includes(item)}
                        onChange={toggleCategory}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 flex-1">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Type</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    "Indoor Plants",
                    "Outdoor Plants",
                    "Flowering Plants",
                    "Succulents",
                    "Herbs",
                    "Pruning Tools",
                    "Watering Tools",
                    "Planting Tools",
                    "Plastic Pots",
                    "Ceramic Pots",
                    "Hanging Pots",
                    "Planters",
                    "Potting Soil",
                    "Organic Fertilizers",
                    "Compost",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={subCategory.includes(item)}
                        onChange={toggleSubCategory}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700 group-hover:text-gray-900 flex-1">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filterProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="max-w-md mx-auto">
                  <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {filterProducts.map((item, index) => (
                  <ProductItem
                    key={index}
                    name={item.name}
                    slug={item.slug}
                    price={item.price}
                    image={item.image}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
