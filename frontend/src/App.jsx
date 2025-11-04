import React, { useState } from "react";
import Dashboard from "./Dashboard";

export default function App() {
  const [auth, setAuth] = useState(null);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow p-6 rounded w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <LoginForm onAuth={(u, p) => setAuth({ user: u, pass: p })} />
        </div>
      </div>
    );
  }

  return <Dashboard auth={auth} />;
}

function LoginForm({ onAuth }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAuth(user, pass);
      }}
    >
      <label className="block mb-2">Username</label>
      <input className="border p-2 mb-4 w-full" value={user} onChange={(e) => setUser(e.target.value)} />
      <label className="block mb-2">Password</label>
      <input type="password" className="border p-2 mb-4 w-full" value={pass} onChange={(e) => setPass(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}
