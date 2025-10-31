import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../api"; // 👈 your axios instance

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("bg-amber-50");
    return () => document.body.classList.remove("bg-amber-50");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 👇 call your FastAPI backend
      const response = await API.post("/users/login", {
        email,
        password,
        role: selectedRole,
      });

      // Expected backend response: { access_token, user_id, role }
      const { access_token, user_id, role } = response.data;

      // Store token & user info locally
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("role", role);

      toast.success("Login successful!", { position: "top-center" });

      // Navigate based on role
      setTimeout(() => {
        if (role === "artisan") {
          navigate("/upload");
        } else {
          navigate("/explore");
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Invalid credentials or server error.",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.h1
                className="text-4xl font-serif font-bold text-amber-900 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Welcome Back
              </motion.h1>
              <p className="text-amber-700">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 text-amber-900"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/50 text-amber-900"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-amber-800">
                  I am a
                </label>
                <select
                  className="px-3 py-2 rounded-lg border border-amber-200 bg-white/50 text-amber-900"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="buyer">Buyer</option>
                  <option value="artisan">Artisan</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors shadow-md ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <ToastContainer />

            <div className="mt-6 text-center text-sm">
              <span className="text-amber-700">Don’t have an account? </span>
              <button
                onClick={() => navigate("/register")}
                className="font-medium text-amber-800 hover:text-amber-900"
              >
                Sign up
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
