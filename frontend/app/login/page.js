// frontend/app/login/page.js - RETRO NIKE STYLE
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "../../components/AuthProvider";
import { Zap, ArrowRight, Shield } from "lucide-react";

function LoginContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-orange-400 via-red-500 to-pink-600">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-black/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-64 h-64 bg-yellow-300/10 rounded-full blur-2xl top-1/2 left-1/2 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-xl">
          <div className="mb-8">
            <Zap className="w-20 h-20 text-white mb-4 animate-bounce" />
            <h1 className="text-7xl font-black text-white mb-4 tracking-tighter leading-none">
              LIFE<br/>BOON
            </h1>
            <div className="w-24 h-2 bg-white rounded-full mb-6"></div>
            <p className="text-2xl text-white font-bold mb-2">
              Healthcare Made Simple
            </p>
            <p className="text-lg text-white/90 font-light">
              Find hospitals, book appointments, and manage your health—all in one place.
            </p>
          </div>

          <div className="space-y-4 mt-12">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-white">Secure & Private</p>
                <p className="text-sm text-white/80">Your data is protected</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                🏥
              </div>
              <div>
                <p className="font-bold text-white">20+ Hospitals</p>
                <p className="text-sm text-white/80">Across Washington State</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Zap className="w-16 h-16 text-white mx-auto mb-3" />
            <h1 className="text-5xl font-black text-white tracking-tighter">LIFEBOON</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-gray-600 font-medium">Sign in to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-red-600 font-semibold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-4 rounded-full font-black text-lg uppercase tracking-wider hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  "Signing In..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">
                Don&apos;t have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-orange-500 hover:text-orange-600 font-black underline decoration-2 underline-offset-2"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Test Accounts */}
            <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
              <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">
                Quick Test Login
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsername("john_seattle");
                    setPassword("password123");
                  }}
                  className="w-full text-left px-3 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all border border-gray-200 group"
                >
                  <p className="text-sm font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                    john_seattle
                  </p>
                  <p className="text-xs text-gray-500">Seattle • BlueCross</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsername("sarah_spokane");
                    setPassword("password123");
                  }}
                  className="w-full text-left px-3 py-2 bg-white rounded-xl hover:bg-gray-50 transition-all border border-gray-200 group"
                >
                  <p className="text-sm font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                    sarah_spokane
                  </p>
                  <p className="text-xs text-gray-500">Spokane • Aetna</p>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-white/80 text-sm font-medium">
            © 2025 LifeBoon. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}