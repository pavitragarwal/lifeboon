// frontend/app/register/page.js - RETRO NIKE STYLE
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, User, MapPin, Shield } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "WA",
    zipCode: "",
    insuranceProvider: "",
    policyNumber: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cityCoordinates = {
        "Seattle": { lat: 47.6062, lon: -122.3321 },
        "Spokane": { lat: 47.6588, lon: -117.4260 },
        "Tacoma": { lat: 47.2529, lon: -122.4443 },
        "Bellevue": { lat: 47.6101, lon: -122.2015 },
        "Vancouver": { lat: 45.6387, lon: -122.6615 },
        "Everett": { lat: 47.9790, lon: -122.2021 },
        "Olympia": { lat: 47.0379, lon: -122.9007 },
        "Yakima": { lat: 46.6021, lon: -120.5059 },
        "Bellingham": { lat: 48.7519, lon: -122.4787 },
        "Renton": { lat: 47.4829, lon: -122.2171 }
      };

      const coords = cityCoordinates[formData.city] || { lat: 47.6062, lon: -122.3321 };

      const requestBody = {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          lat: coords.lat,
          lon: coords.lon
        },
        insurance: {
          provider: formData.insuranceProvider,
          policyNumber: formData.policyNumber
        }
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      alert("✅ Account created! Please login.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.username || !formData.password || !formData.name)) {
      setError("Please fill in all fields");
      return;
    }
    if (step === 2 && (!formData.street || !formData.city || !formData.zipCode)) {
      setError("Please fill in all address fields");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-black/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Zap className="w-16 h-16 text-white mx-auto mb-3 animate-bounce" />
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">LIFEBOON</h1>
          <p className="text-white/90 font-medium text-lg">Join the future of healthcare</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                    step >= s 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-110' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-2 mx-2 rounded-full transition-all ${
                      step > s ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-600">
              <span>Account</span>
              <span>Location</span>
              <span>Insurance</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Info */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 mx-auto text-orange-500 mb-2" />
                  <h2 className="text-3xl font-black">Create Account</h2>
                  <p className="text-gray-600 mt-1">Let&apos;s get you started</p>
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <MapPin className="w-12 h-12 mx-auto text-pink-500 mb-2" />
                  <h2 className="text-3xl font-black">Your Location</h2>
                  <p className="text-gray-600 mt-1">Where are you based?</p>
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-all text-lg font-medium"
                    placeholder="123 Main St"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                      City
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-all text-lg font-medium"
                      required
                    >
                      <option value="">Select City</option>
                      <option value="Seattle">Seattle</option>
                      <option value="Spokane">Spokane</option>
                      <option value="Tacoma">Tacoma</option>
                      <option value="Bellevue">Bellevue</option>
                      <option value="Vancouver">Vancouver</option>
                      <option value="Everett">Everett</option>
                      <option value="Olympia">Olympia</option>
                      <option value="Yakima">Yakima</option>
                      <option value="Bellingham">Bellingham</option>
                      <option value="Renton">Renton</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-all text-lg font-medium"
                      placeholder="98101"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 text-lg font-medium"
                    readOnly
                  />
                </div>
              </div>
            )}

            {/* Step 3: Insurance */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 mx-auto text-purple-500 mb-2" />
                  <h2 className="text-3xl font-black">Insurance Info</h2>
                  <p className="text-gray-600 mt-1">Almost done!</p>
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    Insurance Provider
                  </label>
                  <select
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all text-lg font-medium"
                    required
                  >
                    <option value="">Select Provider</option>
                    <option value="Aetna">Aetna</option>
                    <option value="BlueCross">BlueCross</option>
                    <option value="Cigna">Cigna</option>
                    <option value="Medicare">Medicare</option>
                    <option value="Medicaid">Medicaid</option>
                    <option value="UnitedHealthcare">UnitedHealthcare</option>
                    <option value="Kaiser">Kaiser</option>
                    <option value="Premera">Premera</option>
                    <option value="Humana">Humana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-all text-lg font-medium"
                    placeholder="Policy #"
                    required
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-full font-black text-lg uppercase tracking-wider hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-4 rounded-full font-black text-lg uppercase tracking-wider hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  Next
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-4 rounded-full font-black text-lg uppercase tracking-wider hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-orange-500 hover:text-orange-600 font-black underline decoration-2 underline-offset-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}