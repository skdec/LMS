"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReturnItems, SidebarItems } from "./sidebarData";
import {
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${
        isExpanded ? "w-64" : "w-16"
      } bg-white shadow-sm border-r border-gray-200 transition-all duration-300 h-screen flex flex-col`}
    >
      {/* Header */}
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
        {SidebarItems.map((item, index) => {
          const isActive = pathname === item.href;
          const isSubmenuExpanded = expandedSubmenu === item.label;

          const handleItemClick = () => {
            if (item.hasSubmenu) {
              setExpandedSubmenu(isSubmenuExpanded ? null : item.label);
            }
          };

          return (
            <div key={index}>
              {item.hasSubmenu ? (
                <div
                  onClick={handleItemClick}
                  className={`flex items-center ${
                    isExpanded ? "justify-between" : "justify-center"
                  } px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      isExpanded ? "space-x-3" : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {isExpanded && <span>{item.label}</span>}
                  </div>
                  {isExpanded &&
                    item.hasSubmenu &&
                    (isSubmenuExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    ))}
                </div>
              ) : (
                <Link href={item.href}>
                  <div
                    className={`flex items-center ${
                      isExpanded ? "justify-between" : "justify-center"
                    } px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                      isActive
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        isExpanded ? "space-x-3" : ""
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {isExpanded && <span>{item.label}</span>}
                    </div>
                  </div>
                </Link>
              )}

              {/* Submenu */}
              {item.hasSubmenu && isSubmenuExpanded && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subItem, subIndex) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link key={subIndex} href={subItem.href}>
                        <div
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                            isSubActive
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
