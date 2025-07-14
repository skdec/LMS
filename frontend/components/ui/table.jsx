"use client";

import { Eye, Trash2, Pencil } from "lucide-react";

export default function ReusableTable({
  columns,
  data,
  onView,
  onUpdate,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-6 text-left">
                {col.label}
              </th>
            ))}
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {data.map((item) => (
            <tr
              key={item._id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-6">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              <td className="py-3 px-6 flex gap-3 items-center">
                {onView && (
                  <button
                    onClick={() => onView(item)}
                    className="text-purple-500 hover:text-purple-700"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                )}
                {onUpdate && (
                  <button
                    onClick={() => onUpdate(item._id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
