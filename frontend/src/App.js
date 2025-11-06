import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Login from "./Login";

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
  const [user, setUser] = useState(null);
  const { loading, error, data } = useQuery(GET_DATA);

  if (!user) return <Login onLogin={setUser} />;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.name || "User"} 👋</h1>
      <h2>🛍️ Product List</h2>
      <ul>
        {data.products.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> — ₹{p.price}{" "}
            {p.inStock ? "✅ In Stock" : "❌ Out of Stock"}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: "2rem" }}>📂 Categories</h2>
      <ul>
        {data.categories.map((c) => (
          <li key={c.id}>
            {c.name} ({c.slug})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
