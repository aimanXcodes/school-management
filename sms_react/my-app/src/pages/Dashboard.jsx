import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaBullhorn,
} from "react-icons/fa";
import CountUp from "react-countup"; 

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    studentsPresent: 0,
    studentsAbsent: 0,
    studentsOnLeave: 0,
  });
  
  const [notices, setNotices] = useState([]);
  const [showPastModal, setShowPastModal] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          studentsRes,
          teachersRes,
          classesRes,
          attendanceRes,
          noticesRes,
        ] = await Promise.all([
          axiosInstance.get("students/"),
          axiosInstance.get("teachers/"),
          axiosInstance.get("classes/"),
          axiosInstance.get("attendance/"),
          axiosInstance.get("notices/"),
        ]);

        const totalStudents = studentsRes.data.length;
        const totalTeachers = teachersRes.data.length;
        const totalClasses = classesRes.data.length;

        const today = new Date().toISOString().split("T")[0];
        const todaysAttendance = attendanceRes.data.filter(
          (a) => a.date === today
        );

        const studentsPresent = todaysAttendance.filter(
          (a) => a.status === "Present"
        ).length;
        const studentsAbsent = todaysAttendance.filter(
          (a) => a.status === "Absent"
        ).length;
        const studentsOnLeave = todaysAttendance.filter(
          (a) => a.status === "Leave"
        ).length;

        setStats({
          totalStudents,
          totalTeachers,
          totalClasses,
          studentsPresent,
          studentsAbsent,
          studentsOnLeave,
        });

        setNotices(noticesRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchStats();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todaysNotices = notices.filter((n) =>
    n.created_at.startsWith(today)
  );
  const pastNotices = notices.filter(
    (n) => !n.created_at.startsWith(today)
  );

  const cards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: <FaUserGraduate className="text-slate-800 text-3xl" />,
      gradient: "bg-slate-700",
    },
    {
      label: "Total Teachers",
      value: stats.totalTeachers,
      icon: <FaChalkboardTeacher className="text-slate-800 text-3xl" />,
      gradient: "bg-slate-700",
    },
    {
      label: "Total Classes",
      value: stats.totalClasses,
      icon: <FaSchool className="text-slate-800 text-3xl" />,
      gradient: "bg-slate-700",
    },
    {
      label: "Students Present",
      value: stats.studentsPresent,
      icon: <FaUserCheck className="text-slate-800 text-3xl" />,
      gradient: "bg-slate-700",
    },
    {
      label: "Students Absent",
      value: stats.studentsAbsent,
      icon: <FaUserTimes className="text-slate-800 text-3xl" />,
      gradient: "bg-slate-700",
    },
    {
      label: "Students on Leave",
      value: stats.studentsOnLeave,
      icon: <FaUserClock className="text-slate-800 text-3xl" />,
      gradient: "bg-slate-700",
    },
  ];



  return (
    <div className="p-1 bg-gradient-to-br from-slate-100 via-gray-100 to-gray-200 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.gradient} text-white p-1 rounded-2xl shadow-xl text-center transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="p-2 rounded-full bg-white/30 backdrop-blur-sm shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold tracking-wide uppercase text-white/90">
                {item.label}
              </h3>
              <p className="text-4xl font-bold drop-shadow-md">
                <CountUp end={item.value} duration={1.2} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Board */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FaBullhorn className="text-teal-700 text-xl" />
            <h3 className="text-xl font-bold text-teal-900">Notice Board</h3>
          </div>
          <button
            onClick={() => setShowPastModal(true)}
            className="bg-gradient-to-r from-zinc-800 to-stone-400 text-white px-4 py-2 rounded-md hover:scale-105 transition"
          >
            View Past Notices
          </button>
        </div>

        {todaysNotices.length > 0 ? (
          <div className="space-y-4">
            {todaysNotices.map((notice) => (
              <div
                key={notice.id}
                className="border-l-4 border-zinc-600 bg-zinc-50 p-4 rounded-lg hover:bg-zinc-200 transition"
              >
                <h4 className="font-semibold text-teal-900 text-lg">
                  {notice.title}
                </h4>
                <p className="text-gray-700 mt-1">{notice.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on: {new Date(notice.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">No notices for today.</p>
        )}
      </div>

    

      {/* Past Notices Modal */}
      {showPastModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300">
            <button
              onClick={() => setShowPastModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold text-teal-900 mb-4 border-b pb-2">
              Past Notices
            </h3>

            {pastNotices.length > 0 ? (
              <div className="space-y-4">
                {pastNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="border-l-4 border-pink-600 bg-pink-50 p-4 rounded-lg hover:bg-pink-100 transition"
                  >
                    <h4 className="text-pink-700 font-semibold">
                      {notice.title}
                    </h4>
                    <p className="text-gray-700 mt-1">{notice.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted on:{" "}
                      {new Date(notice.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No past notices found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;








