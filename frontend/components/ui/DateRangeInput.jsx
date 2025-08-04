"use client";

export default function DateRangeInput({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = "",
}) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          From
        </label>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To
        </label>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>
    </div>
  );
}
