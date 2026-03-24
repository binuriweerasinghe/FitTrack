import { useState } from "react";
import { api } from "../lib/api";
import { saveUserId } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";


export default function Login() {
  const nav = useNavigate();
  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ---------- LOGIN ----------
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });
      saveUserId(data.id);
      nav("/profile");
    } catch (e) {
      alert(e?.response?.data?.message || "Login failed");
    }
  };

  // ---------- REGISTER ----------
  const submitRegister = async (e) => {
    e.preventDefault();
    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      if (form.age) body.age = Number(form.age);

      const { data } = await api.post("/auth/register", body);
      saveUserId(data.id);
      nav("/profile");
    } catch (e) {
      alert(e?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`tab-btn ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`tab-btn ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {tab === "login" ? (
          <form onSubmit={submitLogin} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
            />
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        ) : (
          // Register Form
          <form onSubmit={submitRegister} className="login-form">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={onChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age (optional)"
              value={form.age}
              onChange={onChange}
            />
            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}



