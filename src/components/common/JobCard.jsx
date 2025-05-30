// JobCard.jsx
import React from "react";

const JobCard = ({ title, salary, tags, onClick }) => {
  // Fungsi untuk memproses tag yang mungkin berbentuk objek - Perbaikan sedikit
  const processTag = (tagItem) => {
    if (typeof tagItem === 'object' && tagItem !== null) {
      // Coba ekstrak nilai tag dari berbagai kemungkinan properti
      return tagItem.tag || tagItem.name || tagItem.value || JSON.stringify(tagItem).replace(/[{}"]/g, '');
    }
    return tagItem;
  };

  // Pastikan tags adalah array dan proses setiap tag
  const tagArray = Array.isArray(tags) ? tags.map(tag => processTag(tag)) : [];

  return (
    <div
      className="block bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
      onClick={onClick} // Navigasi ke detail job saat diklik
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-600">PT. GoHire</p>
      <p className="text-sm text-gray-500">Jakarta Selatan</p>
      <p className="text-sm font-medium text-green-600">{salary}</p>

      <div className="flex flex-wrap gap-2 mt-2">
        {tagArray.length > 0 ? (
          tagArray.map((tagItem, i) => (
            <span
              key={i}
              className="bg-gray-200 text-sm px-2 py-1 rounded-md"
            >
              {tagItem}
            </span>
          ))
        ) : (
          <span className="text-gray-500">No tags available</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;