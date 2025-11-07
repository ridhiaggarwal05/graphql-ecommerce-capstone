import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_DATA = gql`
  query {
    products {
      id
      name
      price
      inStock
    }
    categories {
      id
      name
      slug
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">Error: {error.message}</p>;

  return (
    <div className="min-h-screen animate-gradient bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 p-10 text-gray-800">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 bg-opacity-90 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
          🛍️ E-Commerce Dashboard
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">📂 Categories</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          {data.categories.map((c) => (
            <span
              key={c.id}
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition"
            >
              {c.name}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">🛒 Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.products.map((p) => (
            <div
              key={p.id}
              className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md hover:shadow-lg transition p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{p.name}</h3>
              <p className="text-gray-500 mb-2">₹{p.price}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {p.inStock ? "✅ In Stock" : "❌ Out of Stock"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
