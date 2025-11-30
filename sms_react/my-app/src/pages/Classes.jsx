import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Select from "react-select";
function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    teacher: "",
    students: [],
  });
  const [selectedStudent, setSelectedStudent] = useState("");
  const [currentClassId, setCurrentClassId] = useState(null);
  const [viewStudents, setViewStudents] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 5;

  const fetchClasses = () => {
    axiosInstance
      .get("classes/")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));
  };

  const fetchTeachers = () => {
    axiosInstance
      .get("teachers/")
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error(err));
  };

  const fetchStudents = () => {
    axiosInstance
      .get("students/")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, students: selected }));
  };

  // Add Class
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("classes/", formData);
      fetchClasses();
      setIsAddModalOpen(false);
      setFormData({ name: "", teacher: "", students: [] });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Class
  const openEditModal = (cls) => {
    setCurrentClassId(cls.id);
    setFormData({
      name: cls.name,
      teacher: cls.teacher || "",
      students: cls.students || [],
    });
    setSelectedStudent("");
    setIsEditModalOpen(true);
  };

  const handleEditClass = async (e) => {
    e.preventDefault();

    try {
      let updatedStudents = [...formData.students];
      if (selectedStudent && !updatedStudents.includes(selectedStudent)) {
        updatedStudents.push(selectedStudent);
      }

      await axiosInstance.put(`classes/${currentClassId}/`, {
        ...formData,
        students: updatedStudents,
      });

      fetchClasses();
      setIsEditModalOpen(false);
      setFormData({ name: "", teacher: "", students: [] });
      setSelectedStudent("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Class
  const openDeleteModal = (id) => {
    setCurrentClassId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClass = async () => {
    try {
      await axiosInstance.delete(`classes/${currentClassId}/`);
      fetchClasses();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // View Students
  const openViewModal = (cls) => {
    setViewStudents(cls.student_names || []);
    setIsViewModalOpen(true);
  };

  // Pagination logic
  const indexOfLast = currentPage * classesPerPage;
  const indexOfFirst = indexOfLast - classesPerPage;
  const currentClasses = classes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(classes.length / classesPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Classes Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
        >
          + Add Class
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-slate-900 to-slate-300 text-white">
            <tr>
              <th className="py-3 px-6 text-left uppercase text-sm font-medium">
                Class Name
              </th>
              <th className="py-3 px-6 text-left uppercase text-sm font-medium">
                Teacher
              </th>
              <th className="py-3 px-6 text-center uppercase text-sm font-medium">
                No. of Students
              </th>
              <th className="py-3 px-6 text-center uppercase text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentClasses.length > 0 ? (
              currentClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-zinc-200 transition">
                  <td className="py-4 px-6">{cls.name}</td>
                  <td className="py-4 px-6">{cls.teacher_full_name || "—"}</td>
                  <td className="py-4 px-6 text-center">
                    {cls.student_names?.length || 0}
                  </td>
                  <td className="py-4 px-6 text-center space-x-3">
                    <button
                      onClick={() => openViewModal(cls)}
                      className="text-green-700 hover:underline"
                    >
                      View Students
                    </button>
                    <button
                      onClick={() => openEditModal(cls)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(cls.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>
        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {(isAddModalOpen ||
        isEditModalOpen ||
        isDeleteModalOpen ||
        isViewModalOpen) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          {/* Add Class */}
          {isAddModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Add Class</h3>
              <form onSubmit={handleAddClass} className="flex flex-col gap-3">
                <label className="font-medium">Class Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2"
                  required
                />

                <label className="font-medium">Teacher</label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name}
                    </option>
                  ))}
                </select>
                  {/* add students */}
                <label className="font-medium mt-3">Add Students</label>
      <Select
        isMulti
        isSearchable
        options={students.map((s) => ({
          value: s.id,
          label: s.full_name,
        }))}
        onChange={(selectedOptions) => {
          const newStudentIds = selectedOptions.map((opt) => opt.value);
          setFormData((prev) => ({
            ...prev,
            students: [...new Set([...prev.students, ...newStudentIds])],
          }));
        }}
        placeholder="Search and select students to add..."
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            boxShadow: "none",
            "&:hover": { borderColor: "#9ca3af" },
          }),
        }}
      />
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

          
         {/* Edit Class */}


{isEditModalOpen && (
  <div className="bg-white rounded-lg w-full max-w-md p-6">
    <h3 className="text-xl font-bold mb-4">Edit Class</h3>
    <form onSubmit={handleEditClass} className="flex flex-col gap-3">
      {/* Class Name */}
      <label className="font-medium">Class Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="border border-gray-300 rounded px-3 py-2"
      />

      {/* Teacher Dropdown */}
      <label className="font-medium">Teacher</label>
      <select
        name="teacher"
        value={formData.teacher}
        onChange={handleInputChange}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Select Teacher</option>
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.full_name}
          </option>
        ))}
      </select>

      {/* Add Students Multi-Select */}
      <label className="font-medium mt-3">Add Students</label>
      <Select
        isMulti
        isSearchable
        options={students.map((s) => ({
          value: s.id,
          label: s.full_name,
        }))}
        onChange={(selectedOptions) => {
          const newStudentIds = selectedOptions.map((opt) => opt.value);
          setFormData((prev) => ({
            ...prev,
            students: [...new Set([...prev.students, ...newStudentIds])],
          }));
        }}
        placeholder="Search and select students to add..."
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            boxShadow: "none",
            "&:hover": { borderColor: "#9ca3af" },
          }),
        }}
      />

      {/* Remove Students Multi-Select */}
      {formData.students.length > 0 && (
        <>
          <label className="font-medium mt-3">Remove Students</label>
          <Select
            isMulti
            isSearchable
            options={formData.students
              .map((id) => {
                const s = students.find((st) => st.id === id);
                return s ? { value: s.id, label: s.full_name } : null;
              })
              .filter(Boolean)}
            onChange={(selectedOptions) => {
              const removeIds = selectedOptions.map((opt) => opt.value);
              setFormData((prev) => ({
                ...prev,
                students: prev.students.filter((id) => !removeIds.includes(id)),
              }));
            }}
            placeholder="Search and select students to remove..."
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#d1d5db",
                boxShadow: "none",
                "&:hover": { borderColor: "#9ca3af" },
              }),
               menuList: (base) => ({
          ...base,
          maxHeight: "140px", 
          overflowY: "auto", 
        }),
            }}
          />
        </>
      )}

      
    

      {/* Buttons */}
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
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-800"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
)}


           
          {/* View Students Modal */}
          {isViewModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Students in this Class</h3>
              {viewStudents.length > 0 ? (
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {viewStudents.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No students in this class yet.</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {isDeleteModalOpen && (
            <div className="bg-white rounded-lg w-full max-w-sm p-6 text-center">
              <h3 className="text-lg font-bold mb-4">
                Are you sure you want to delete this class?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClass}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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

export default Classes;


