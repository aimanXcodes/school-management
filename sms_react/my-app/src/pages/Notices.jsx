// src/pages/Notices.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [currentNoticeId, setCurrentNoticeId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 5;

  // Fetch notices
  const fetchNotices = () => {
    axiosInstance
      .get("notices/")
      .then((res) => setNotices(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add notice
  const handleAddNotice = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("notices/", formData);
      fetchNotices();
      setFormData({ title: "", message: "" });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit notice
  const openEditModal = (notice) => {
    setCurrentNoticeId(notice.id);
    setFormData({ title: notice.title, message: notice.message });
    setIsEditModalOpen(true);
  };

  const handleEditNotice = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`notices/${currentNoticeId}/`, formData);
      fetchNotices();
      setIsEditModalOpen(false);
      setFormData({ title: "", message: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete notice
  const openDeleteModal = (id) => {
    setCurrentNoticeId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNotice = async () => {
    try {
      await axiosInstance.delete(`notices/${currentNoticeId}/`);
      fetchNotices();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination logic
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notice Board</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
        >
          + Add Notice
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-slate-900 to-slate-300 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium uppercase">
                Title
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium uppercase">
                Message
              </th>
              <th className="py-3 px-6 text-left text-sm font-medium uppercase">
                Date
              </th>
              <th className="py-3 px-6 text-center text-sm font-medium uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentNotices.length > 0 ? (
              currentNotices.map((notice) => (
                <tr
                  key={notice.id}
                  className="hover:bg-pink-50 transition cursor-pointer"
                >
                  <td className="py-4 px-6 font-medium">{notice.title}</td>
                  <td className="py-4 px-6 text-gray-700 truncate max-w-xs">
                    {notice.message}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(notice.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(notice)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(notice.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-400 italic"
                >
                  No notices available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-3">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {(isAddModalOpen || isEditModalOpen || isDeleteModalOpen) && (
        <div className="fixed inset-0 flex items-center justify-center bg-none bg-opacity-30 backdrop-blur-sm z-50">
          {/* Add Notice Modal */}
          {isAddModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Add Notice</h3>
              <form onSubmit={handleAddNotice} className="flex flex-col gap-3">
                <label className="font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2"
                  required
                />

                <label className="font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2"
                  rows="4"
                  required
                ></textarea>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Notice Modal */}
          {isEditModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Edit Notice</h3>
              <form onSubmit={handleEditNotice} className="flex flex-col gap-3">
                <label className="font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2"
                  required
                />

                <label className="font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2"
                  rows="4"
                  required
                ></textarea>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center">
              <h3 className="text-lg font-bold mb-4">
                Are you sure you want to delete this notice?
              </h3>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteNotice}
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

export default Notices;
