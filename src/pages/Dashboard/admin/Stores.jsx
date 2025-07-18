import React, { useState, useEffect } from "react";
import { FaStore, FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { backendUrl } from "../../../App";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/vendor/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }
        const data = await response.json();
        setStores(data?.vendors || []);
        setFilteredStores(data?.vendors || []);
      } catch (error) {
        console.error("Error fetching stores:", error);
        setError("Failed to fetch stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterStores(query, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterStores(search, status);
  };

  const filterStores = (searchQuery, status) => {
    let filtered = stores;

    if (searchQuery) {
      filtered = filtered.filter(
        (store) =>
          store.storeName?.toLowerCase().includes(searchQuery) ||
          store.ownerName?.toLowerCase().includes(searchQuery) ||
          store.email?.toLowerCase().includes(searchQuery)
      );
    }

    if (status !== "all") {
      filtered = filtered.filter(
        (store) => store.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredStores(filtered);
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/vendor/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorId: storeId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete store");
        }

        const data = await response.json();
        if (data.success) {
          setStores(stores.filter((store) => store._id !== storeId));
          setFilteredStores(filteredStores.filter((store) => store._id !== storeId));
          toast.success("Store deleted successfully");
        } else {
          throw new Error(data.message || "Failed to delete store");
        }
      } catch (error) {
        console.error("Error deleting store:", error);
        toast.error("Failed to delete store");
      }
    }
  };

  const handleUpdateStore = async (storeId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/vendor/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendorId: storeId, ...updatedData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update store");
      }

      const data = await response.json();
      if (data.success) {
        setStores(
          stores.map((store) =>
            store._id === storeId ? { ...store, ...updatedData } : store
          )
        );
        setFilteredStores(
          filteredStores.map((store) =>
            store._id === storeId ? { ...store, ...updatedData } : store
          )
        );
        toast.success("Store updated successfully");
        setShowStoreModal(false);
        setSelectedStore(null);
      } else {
        throw new Error(data.message || "Failed to update store");
      }
    } catch (error) {
      console.error("Error updating store:", error);
      toast.error("Failed to update store");
    }
  };

  const StoreModal = ({ store, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      storeName: store?.storeName || "",
      ownerName: store?.ownerName || "",
      email: store?.email || "",
      phone: store?.phone || "",
      address: store?.address || "",
      status: store?.status || "active",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(store._id, formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Edit Store</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Owner Name</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border rounded-lg p-2"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-green-600 rounded-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaStore className="text-orange-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Stores Management
              </h2>
              <p className="text-gray-500 text-sm">Manage partner stores</p>
            </div>
          </div>
          <button
            onClick={() => setShowStoreModal(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaPlus className="text-lg" />
            <span>Add Store</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by store name, owner or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="min-w-[150px] px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStores.map((store) => (
                <tr key={store._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <FaStore className="text-orange-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {store.storeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {store.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {store.ownerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{store.email}</div>
                      <div className="text-sm text-gray-500">{store.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      store.status === 'active' ? 'bg-green-100 text-green-800' :
                      store.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.createdAt ? format(new Date(store.createdAt), "MMM dd, yyyy") : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedStore(store);
                          setShowStoreModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-900"
                        title="Edit store"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete store"
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

        {filteredStores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No stores found</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Store Modal */}
      {showStoreModal && selectedStore && (
        <StoreModal
          store={selectedStore}
          onClose={() => {
            setShowStoreModal(false);
            setSelectedStore(null);
          }}
          onUpdate={handleUpdateStore}
        />
      )}
    </div>
  );
} 