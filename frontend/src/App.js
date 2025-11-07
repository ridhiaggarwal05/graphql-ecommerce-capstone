import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        roles
      }
    }
  }
`;

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
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading: loginLoading, error: loginError }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.token;
      setToken(token);
      localStorage.setItem("token", token);
    },
  });

  const { loading, error, data } = useQuery(GET_DATA, {
    skip: !token, // don’t fetch until logged in
    context: {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  // 🟣 If not logged in, show login screen
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 animate-gradient">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-10 max-w-sm w-full text-center">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">🔐 Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition"
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          {loginError && <p className="text-red-600 mt-3">Invalid credentials</p>}
        </div>
      </div>
    );
  }

  // 🟢 After login, show dashboard
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error.message}</p>;

  return (
    <div className="min-h-screen animate-gradient bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 p-10 text-gray-800">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 bg-opacity-90 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-purple-700">
            🛍️ My Store Dashboard
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

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
