// frontend/components/AuthProvider.js - RETRO NIKE STYLE
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Zap, LogOut, Calendar, User, Home } from "lucide-react";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("lifeboon_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("lifeboon_user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("lifeboon_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lifeboon_user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600">
        <div className="text-center">
          <Zap className="w-20 h-20 text-white animate-bounce mx-auto mb-4" />
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-black text-2xl tracking-wider">LOADING...</p>
        </div>
      </div>
    );
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!isAuthPage && user && (
        <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-2xl sticky top-0 z-50 border-b-4 border-orange-500">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <Zap className="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform" />
                <div>
                  <h1 className="text-3xl font-black tracking-tighter leading-none">LIFEBOON</h1>
                  <p className="text-xs text-gray-400 font-medium">Healthcare Reimagined</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <Link 
                  href="/" 
                  className={`px-6 py-3 rounded-full font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                    pathname === "/" 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Find Care
                </Link>
                <Link 
                  href="/bookings" 
                  className={`px-6 py-3 rounded-full font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                    pathname === "/bookings" 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  Bookings
                </Link>
                <Link 
                  href="/profile" 
                  className={`px-6 py-3 rounded-full font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                    pathname === "/profile" 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
              </div>

              {/* User Info & Logout */}
              <div className="flex items-center gap-4">
                <div className="hidden lg:block text-right">
                  <p className="font-black text-sm">{user?.name}</p>
                  <p className="text-xs text-orange-400 font-semibold">{user?.insurance?.provider}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full font-black uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex justify-around pb-4">
              <Link 
                href="/" 
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  pathname === "/" 
                    ? "text-orange-500" 
                    : "text-gray-400"
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs font-bold">Home</span>
              </Link>
              <Link 
                href="/bookings" 
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  pathname === "/bookings" 
                    ? "text-orange-500" 
                    : "text-gray-400"
                }`}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-xs font-bold">Bookings</span>
              </Link>
              <Link 
                href="/profile" 
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  pathname === "/profile" 
                    ? "text-orange-500" 
                    : "text-gray-400"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-bold">Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
      {children}
    </AuthContext.Provider>
  );
}