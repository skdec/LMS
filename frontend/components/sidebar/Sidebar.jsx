import { useState } from "react";
import { ReturnItems, SidebarItems } from "./sidebarData";
import { ChevronRight, LayoutDashboard, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Changed to true for default expanded state

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${
        isExpanded ? "w-64" : "w-16"
      } bg-white shadow-sm border-r border-gray-200 transition-all duration-300 h-screen flex flex-col`}
    >
      {/* Header with Logo and Hamburger */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        {isExpanded ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Digitechmate
              </span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 w-full flex justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 flex-1">
        {SidebarItems.map((item, index) => (
          <div key={index} className="mb-1">
            <div
              className={`flex items-center ${
                isExpanded ? "justify-between" : "justify-center"
              } px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                item.active
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div
                className={`flex items-center ${isExpanded ? "space-x-3" : ""}`}
              >
                <item.icon className="w-5 h-5" />
                {isExpanded && <span>{item.label}</span>}
              </div>
              {isExpanded && item.hasSubmenu && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Return to section */}
      {isExpanded && (
        <div className="mt-8 px-3 mb-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
            Return to
          </div>
          {ReturnItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
