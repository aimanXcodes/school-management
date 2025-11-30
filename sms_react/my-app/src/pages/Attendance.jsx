import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Select from "react-select";

function Attendance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning] = useState("");
  const [pastAttendance, setPastAttendance] = useState([]);
  const [showPastModal, setShowPastModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosInstance.get("classes/");
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // Fetch students of selected class
  const handleClassSelect = async (option) => {
    setSelectedClass(option);
    setWarning("");
    setAttendance({});
    if (!option) return;
    try {
      const res = await axiosInstance.get(`classes/${option.value}/`);
      setStudents(
        res.data.student_names.map((name, i) => ({
          id: res.data.students[i],
          name,
        }))
      );
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Change attendance status for student
  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Submit attendance for today
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) {
      setWarning("Please select a class first.");
      return;
    }

    setIsSubmitting(true);
    setWarning("");

    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await axiosInstance.get("attendance/");
      const existing = res.data.filter(
        (a) => a.date === today && students.some((s) => s.id === a.student)
      );

      if (existing.length > 0) {
        setWarning("⚠️ Attendance for this class has already been marked today.");
        setIsSubmitting(false);
        return;
      }

      const entries = Object.entries(attendance).map(([studentId, status]) => ({
        student: studentId,
        status,
      }));

      await Promise.all(entries.map((entry) => axiosInstance.post("attendance/", entry)));
      setWarning("✅ Attendance marked successfully!");
    } catch (err) {
      console.error("Error submitting attendance:", err);
      setWarning("❌ Error marking attendance. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch past attendance
  const fetchPastAttendance = async () => {
    try {
      const res = await axiosInstance.get("attendance/");
      setPastAttendance(res.data);
      setShowPastModal(true);
    } catch (err) {
      console.error("Error fetching past attendance:", err);
    }
  };

  // Filter past attendance by search
  const filteredPast = pastAttendance.filter((record) => {
    const fullName =
      `${record.student_name} ${record.student_last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">
          Attendance Management
        </h2>
        <button
          onClick={fetchPastAttendance}
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-900"
        >
          View Past Attendance
        </button>
      </div>

      {/* Alert message */}
      {warning && (
        <div
          className={`mb-4 p-3 rounded ${
            warning.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {warning}
        </div>
      )}

      {/* Select Class */}
      <div className="mb-6 w-80">
        <label className="font-semibold text-pink-900 mb-2 block">
          Select Class:
        </label>
        <Select
          options={classes.map((cls) => ({ value: cls.id, label: cls.name }))}
          value={selectedClass}
          onChange={handleClassSelect}
          placeholder="Enter Class..."
          isClearable
        />
      </div>

      {/* Attendance Table */}
      {students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gradient-to-r from-slate-900 to-slate-300 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Student Name</th>
                <th className="py-3 px-4 text-center">Present</th>
                <th className="py-3 px-4 text-center">Absent</th>
                <th className="py-3 px-4 text-center">Leave</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{student.name}</td>
                  {["Present", "Absent", "Leave"].map((status) => (
                    <td key={status} className="py-3 px-4 text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value={status}
                        checked={attendance[student.id] === status}
                        onChange={() => handleStatusChange(student.id, status)}
                        className="accent-pink-700"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-zinc-700 text-white px-6 py-2 rounded hover:bg-zinc-800"
            >
              {isSubmitting ? "Saving..." : "Submit Attendance"}
            </button>
          </div>
        </form>
      )}

      {/* Past Attendance Modal */}
      {showPastModal && (
        <div className="fixed inset-0 bg-none bg-opacity-60 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto relative">
            <h3 className="text-xl font-bold text-pink-900 mb-4">
              Past Attendance Records
            </h3>

            <button
              onClick={() => setShowPastModal(false)}
              className="absolute top-3 right-5 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✖
            </button>

            {/* Search Student */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search student by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Past Attendance Table */}
            {filteredPast.length === 0 ? (
              <p className="text-gray-600 text-center">
                No matching records found.
              </p>
            ) : (
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-maroon-700 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Student</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPast.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-2 px-4 text-gray-800">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-gray-800">
                        {record.student_name} {record.student_last_name}
                      </td>
                      <td
                        className={`py-2 px-4 font-semibold ${
                          record.status === "Present"
                            ? "text-green-600"
                            : record.status === "Absent"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;





    

