// src/pages/Students.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]); // For selecting student user
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user: "",
    roll_number: "",
    grade: "",
  });
  const [currentStudentId, setCurrentStudentId] = useState(null);

  // Fetch students
  const fetchStudents = () => {
    axiosInstance
      .get("students/")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  // Fetch all users with role student for dropdown
  const fetchUsers = () => {
    axiosInstance
      .get("accounts/")
      .then((res) =>
        setUsers(res.data.filter((u) => u.role === "student"))
      )
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("students/", formData);
      fetchStudents();
      setIsAddModalOpen(false);
      setFormData({ user: "", roll_number: "", grade: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit student
  const openEditModal = (student) => {
    setCurrentStudentId(student.id);
    setFormData({
      user: student.user,
      roll_number: student.roll_number,
      grade: student.grade,
    });
    setIsEditModalOpen(true);
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`students/${currentStudentId}/`, formData);
      fetchStudents();
      setIsEditModalOpen(false);
      setFormData({ user: "", roll_number: "", grade: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete student
  const openDeleteModal = (id) => {
    setCurrentStudentId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStudent = async () => {
    try {
      await axiosInstance.delete(`students/${currentStudentId}/`);
      fetchStudents();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Students Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gradient-to-r from-slate-900 to-slate-300 text-white rounded-t-lg">
      <tr>
        <th className="py-3 px-6 text-left uppercase text-sm font-medium">Full Name</th>
        <th className="py-3 px-6 text-left uppercase text-sm font-medium">Email</th>
        <th className="py-3 px-6 text-left uppercase text-sm font-medium">Roll Number</th>
        <th className="py-3 px-6 text-left uppercase text-sm font-medium">Grade</th>
        <th className="py-3 px-6 text-center uppercase text-sm font-medium">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {students.length > 0 ? (
        students.map((student) => (
          <tr
            key={student.id}
            className="hover:bg-zinc-200 transition cursor-pointer"
          >
            <td className="py-4 px-6">{student.full_name}</td>
            <td className="py-4 px-6">{student.email}</td>
            <td className="py-4 px-6">{student.roll_number}</td>
            <td className="py-4 px-6">{student.grade}</td>
            <td className="py-4 px-6 text-center space-x-2">
              <button
                onClick={() => openEditModal(student)}
                className="text-blue-600 hover:underline font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(student.id)}
                className="text-red-600 hover:underline font-medium"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center py-6 text-gray-400">
            No students found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {/* Add/Edit/Delete Modals */}
      {isAddModalOpen || isEditModalOpen || isDeleteModalOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-none bg-opacity-20 backdrop-blur-sm z-50">
          {/* Add Student Modal */}
          {isAddModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <h3 className="text-xl font-bold mb-4">Add Student</h3>
              <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
                <label className="font-medium">User</label>
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Student</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </option>
                  ))}
                </select>

                <label className="font-medium">Roll Number</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <label className="font-medium">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
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

          {/* Edit Student Modal */}
          {isEditModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
              <h3 className="text-xl font-bold mb-4">Edit Student</h3>
              <form
                onSubmit={handleEditStudent}
                className="flex flex-col gap-4"
              >
                <label className="font-medium">User</label>
                <select
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Student</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </option>
                  ))}
                </select>

                <label className="font-medium">Roll Number</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />

                <label className="font-medium">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
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

          {/* Delete Student Modal */}
          {isDeleteModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-sm p-6 relative text-center">
              <h3 className="text-lg font-bold mb-4">
                Are you sure you want to delete this student?
              </h3>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Students;
