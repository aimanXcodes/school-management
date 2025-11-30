import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function Accounts() {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "admin",
  });
  const [currentUserId, setCurrentUserId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const fetchUsers = () => {
    axiosInstance
      .get("accounts/")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("accounts/", formData);
      fetchUsers();
      setIsAddModalOpen(false);
      setFormData({ first_name: "", last_name: "", email: "", role: "admin" });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Edit User
  const openEditModal = (user) => {
    setCurrentUserId(user.id);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`accounts/${currentUserId}/`, formData);
      fetchUsers();
      setIsEditModalOpen(false);
      setFormData({ first_name: "", last_name: "", email: "", role: "admin" });
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Delete User
  const openDeleteModal = (userId) => {
    setCurrentUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axiosInstance.delete(`accounts/${currentUserId}/`);
      fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // --- Pagination Logic ---
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="p-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Accounts Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
        >
          + Add User
        </button>
      </div>

      {/* Table */}
     <div className="overflow-x-auto">
  <table className="min-w-full bg-white rounded-lg shadow-md">
    <thead className="bg-gradient-to-r from-slate-900 to-slate-300 text-white">
      <tr>
        <th className="py-3 px-6 text-left rounded-tl-lg">First Name</th>
        <th className="py-3 px-6 text-left">Last Name</th>
        <th className="py-3 px-6 text-left">Email</th>
        <th className="py-3 px-6 text-left">Role</th>
        <th className="py-3 px-6 text-center rounded-tr-lg">Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentUsers.length > 0 ? (
        currentUsers.map((user, index) => (
          <tr
            key={user.id}
            className={`transition hover:bg-gray-200 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <td className="py-4 px-6">{user.first_name}</td>
            <td className="py-4 px-6">{user.last_name}</td>
            <td className="py-4 px-6">{user.email}</td>
            <td className="py-4 px-6 capitalize">{user.role}</td>
            <td className="py-4 px-6 text-center space-x-2">
              <button
                onClick={() => openEditModal(user)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(user.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center py-6 text-gray-400">
            No users found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      {/* Pagination */}
     {/* Pagination */}
<div className="flex justify-end items-center mt-4 space-x-2">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition ${
      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    Previous
  </button>

  {/* Page numbers */}
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1 rounded-md border ${
        currentPage === page
          ? "bg-zinc-800 text-white border-zinc-700"
          : "border-gray-300 hover:bg-gray-100"
      } transition`}
    >
      {page}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className={`px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition ${
      currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    Next
  </button>
</div>


      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-none-900 bg-opacity-20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="flex flex-col gap-4">
              <label className="font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <label className="font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <label className="font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-pink-800"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-none-900 bg-opacity-20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>
            <form onSubmit={handleEditUser} className="flex flex-col gap-4">
              <label className="font-medium">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <label className="font-medium">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <label className="font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-700 text-white rounded hover:bg-pink-800"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-none-900 bg-opacity-20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 relative text-center">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;

