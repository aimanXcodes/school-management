import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]); // For selecting teacher users
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    subject: "",
  });
  const [currentTeacherId, setCurrentTeacherId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 5;

  // Fetch teachers
  const fetchTeachers = () => {
    axiosInstance
      .get("teachers/")
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error(err));
  };

  // Fetch users with role = teacher for dropdown
  const fetchUsers = () => {
    axiosInstance
      .get("accounts/")
      .then((res) => setUsers(res.data.filter((u) => u.role === "teacher")))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTeachers();
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("teachers/", formData);
      fetchTeachers();
      setIsAddModalOpen(false);
      setFormData({ user: "", subject: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit teacher
  const openEditModal = (teacher) => {
    setCurrentTeacherId(teacher.id);
    setFormData({
      user: teacher.user,
      subject: teacher.subject,
    });
    setIsEditModalOpen(true);
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`teachers/${currentTeacherId}/`, formData);
      fetchTeachers();
      setIsEditModalOpen(false);
      setFormData({ user: "", subject: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete teacher
  const openDeleteModal = (id) => {
    setCurrentTeacherId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTeacher = async () => {
    try {
      await axiosInstance.delete(`teachers/${currentTeacherId}/`);
      fetchTeachers();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(teachers.length / teachersPerPage);

  return (
    <div className="p-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Teachers Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
        >
          + Add Teacher
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-slate-900 to-slate-300 text-white rounded-t-lg">
            <tr>
              <th className="py-3 px-6 text-left uppercase text-sm font-medium">
                Full Name
              </th>
              <th className="py-3 px-6 text-left uppercase text-sm font-medium">
                Email
              </th>
              <th className="py-3 px-6 text-left uppercase text-sm font-medium">
                Subject
              </th>
              <th className="py-3 px-6 text-center uppercase text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentTeachers.length > 0 ? (
              currentTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-zinc-200 transition cursor-pointer"
                >
                  <td className="py-4 px-6">{teacher.full_name}</td>
                  <td className="py-4 px-6">{teacher.email}</td>
                  <td className="py-4 px-6">{teacher.subject}</td>
                  <td className="py-4 px-6 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(teacher)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(teacher.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1
                  ? "bg-pink-700 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit/Delete Modals */}
      {(isAddModalOpen || isEditModalOpen || isDeleteModalOpen) && (
        <div className="fixed inset-0 flex items-center justify-center bg-none bg-opacity-20 backdrop-blur-sm z-50">
          {/* Add Teacher Modal */}
          {isAddModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <h3 className="text-xl font-bold mb-4">Add Teacher</h3>
              <form onSubmit={handleAddTeacher} className="flex flex-col gap-4">
                <label className="font-medium">User</label>
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Teacher</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </option>
                  ))}
                </select>

                <label className="font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />

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
                    className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-900"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Teacher Modal */}
          {isEditModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <h3 className="text-xl font-bold mb-4">Edit Teacher</h3>
              <form onSubmit={handleEditTeacher} className="flex flex-col gap-4">
                <label className="font-medium">User</label>
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Teacher</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </option>
                  ))}
                </select>

                <label className="font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />

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
                    Update
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Teacher Modal */}
          {isDeleteModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-sm p-6 relative text-center">
              <h3 className="text-lg font-bold mb-4">
                Are you sure you want to delete this teacher?
              </h3>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTeacher}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Teachers;
