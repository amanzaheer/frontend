import React, { useState, useEffect } from "react";
import { FaUsers, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { backendUrl } from "../../../App";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/user/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data?.users || []);
        setFilteredUsers(data?.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    filterUsers(query, roleFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterUsers(search, role);
  };

  const filterUsers = (searchQuery, role) => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery) ||
          user.email?.toLowerCase().includes(searchQuery) ||
          user.phone?.toLowerCase().includes(searchQuery)
      );
    }

    if (role !== "all") {
      filtered = filtered.filter(
        (user) => user.role?.toLowerCase() === role.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/user/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        const data = await response.json();
        if (data.success) {
          setUsers(users.filter((user) => user._id !== userId));
          setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
          toast.success("User deleted successfully");
        } else {
          throw new Error(data.message || "Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendUrl}/api/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ...updatedData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      if (data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, ...updatedData } : user
          )
        );
        setFilteredUsers(
          filteredUsers.map((user) =>
            user._id === userId ? { ...user, ...updatedData } : user
          )
        );
        toast.success("User updated successfully");
        setShowUserModal(false);
        setSelectedUser(null);
      } else {
        throw new Error(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const UserModal = ({ user, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      role: user?.role || "user",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(user._id, formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Edit User</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaUsers className="text-purple-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Users Management
              </h2>
              <p className="text-gray-500 text-sm">Manage user accounts</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, email or phone..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="min-w-[150px] px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
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
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Edit user"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
}
