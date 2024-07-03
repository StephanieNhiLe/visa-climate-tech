import React, { useEffect, useState } from "react";
import "../styles/recombox.css"; // Import the custom CSS file
import axios from "axios";

// Sample data structure (adjust based on your actual data)
const sampleData = [
  {
    id: 1,
    name: "Chic Cycle",
    description:
      "A trendy and stylish cycling boutique offering the latest gear and accessories for passionate cyclists.",
  },
  {
    id: 2,
    name: "Glam Exchange",
    description:
      "A chic marketplace where fashion enthusiasts can buy, sell, and trade high-end clothing and accessories",
  },
  {
    id: 3,
    name: "Revive Retail",
    description:
      "A vibrant retail store dedicated to rejuvenating your wardrobe with the latest in fashion trends and timeless classics",
  },
  // Add more items as needed
];

function DataList() {
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     // Simulate fetching data from an API
    //     // Replace this with your actual data fetching logic
    setData(sampleData);
    setIsVisible(true);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };
  }, []);

  return (
    <div className="flex flex-col flex-wrap gap-4 p-5 min-h-max w-full">
      {data.map((item, index) => (
        <div
          key={item.id}
          className={`flex-grow max-w-lg p-4 border rounded-lg shadow-md bg-white transition-opacity ${
            isVisible ? `slide-in-right delay-${index}` : "hidden"
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default DataList;
