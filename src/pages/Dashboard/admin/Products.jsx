import React, { useState, useEffect } from "react";
import { FaBox, FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { backendUrl, currency } from "../../../App";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockFilter, setStockFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/product/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data?.products || []);
        setFilteredProducts(data?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];
    setCategories(uniqueCategories);
  }, [products]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/product/remove`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        const data = await response.json();

        if (data.success) {
          setProducts(products.filter((product) => product._id !== id));
          setFilteredProducts(filteredProducts.filter((product) => product._id !== id));
        } else {
          throw new Error(data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterProducts(query, categoryFilter, priceRange, stockFilter);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    filterProducts(search, category, priceRange, stockFilter);
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    filterProducts(search, categoryFilter, newPriceRange, stockFilter);
  };

  const handleStockFilter = (stock) => {
    setStockFilter(stock);
    filterProducts(search, categoryFilter, priceRange, stock);
  };

  const filterProducts = (searchQuery, category, price, stock) => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
      );
    }

    if (category !== "all") {
      filtered = filtered.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (price.min !== "") {
      filtered = filtered.filter(
        (product) => product.price >= Number(price.min)
      );
    }
    if (price.max !== "") {
      filtered = filtered.filter(
        (product) => product.price <= Number(price.max)
      );
    }

    if (stock !== "all") {
      if (stock === "inStock") {
        filtered = filtered.filter((product) => product.stock > 0);
      } else if (stock === "outOfStock") {
        filtered = filtered.filter((product) => product.stock === 0);
      }
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-5 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaBox className="text-green-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Amana Organics - Products Management
              </h2>
              <p className="text-gray-500 text-sm">Manage natural products inventory</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/add")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaPlus className="text-lg" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="min-w-[150px] px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Filters Row */}
        <div className="flex flex-wrap gap-4 items-center border-t border-gray-100 pt-4">
          {/* Price Range Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Price:</span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => handleStockFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.image?.[0] || "/placeholder-image.jpg"}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currency} {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/edit/${product._id}`)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
