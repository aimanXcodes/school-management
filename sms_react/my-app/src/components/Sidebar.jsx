import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaChevronLeft, FaTachometerAlt, FaUser, FaUsers, FaChalkboardTeacher, FaSchool, FaClipboardList, FaBullhorn } from "react-icons/fa";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Accounts", path: "/accounts", icon: <FaUser /> },
    { name: "Students", path: "/students", icon: <FaUsers /> },
    { name: "Teachers", path: "/teachers", icon: <FaChalkboardTeacher /> },
    { name: "Classes", path: "/classes", icon: <FaSchool /> },
    { name: "Attendance", path: "/attendance", icon: <FaClipboardList /> },
    { name: "Notices", path: "/notices", icon: <FaBullhorn /> },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-zinc-500 text-white h-screen flex flex-col transition-all duration-300 shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <h2 className={`${isCollapsed ? "hidden" : "text-2xl font-bold"}`}>Schoolify</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white text-lg focus:outline-none"
        >
          {isCollapsed ? <FaBars /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Scrollable Nav */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-pink-600 hover:scrollbar-thumb-red-800">
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "bg-zinc-400 p-2 rounded shadow-md flex items-center gap-2"
                    : "hover:bg-zinc-400 p-2 rounded transition-colors flex items-center gap-2"
                }`
              }
            >
              {/* Icon */}
              <span className="text-lg">{link.icon}</span>
              {/* Label only when not collapsed */}
              {!isCollapsed && <span>{link.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;

