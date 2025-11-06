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

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6">
          🛍️ My Beautiful E-Commerce Store
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 mb-3">📂 Categories</h2>
        <div className="flex flex-wrap gap-3 mb-8">
          {data.categories.map((c) => (
            <span
              key={c.id}
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full shadow-sm hover:bg-purple-200 transition"
            >
              {c.name}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">🛒 Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.products.map((p) => (
            <div
              key={p.id}
              className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md hover:shadow-xl transition p-5"
            >
              <h3 className="text-xl font-semibold text-gray-800">{p.name}</h3>
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
