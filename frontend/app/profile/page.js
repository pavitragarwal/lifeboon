"use client";
import { AuthProvider, useAuth } from "../../components/AuthProvider";
import { User, MapPin, Shield, Calendar, Edit2, Save, X } from "lucide-react";
import { useState } from "react";

function ProfileContent() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    zipCode: user?.address?.zipCode || "",
    insuranceProvider: user?.insurance?.provider || "",
    policyNumber: user?.insurance?.policyNumber || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const coords = cityCoordinates[formData.city] || user.address;

      const updateData = {
        name: formData.name,
        address: {
          street: formData.street,
          city: formData.city,
          state: "WA",
          zipCode: formData.zipCode,
          lat: coords.lat,
          lon: coords.lon
        },
        insurance: {
          provider: formData.insuranceProvider,
          policyNumber: formData.policyNumber
        }
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await res.json();
      login(updatedUser);
      setEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">MY PROFILE</h1>
          <p className="text-xl text-white/90 font-medium">Manage your information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-200">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black mb-1">{user.name}</h2>
                  <p className="text-orange-400 font-bold">@{user.username}</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100 font-black uppercase tracking-wide flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {!editing ? (
              <div className="space-y-8">
                {/* Personal Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-orange-500" />
                    <h3 className="text-2xl font-black">Personal Info</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-5 rounded-2xl border-2 border-orange-200">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                      <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-5 rounded-2xl border-2 border-orange-200">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Date of Birth</p>
                      <p className="font-bold text-gray-900 text-lg">{formatDate(user.dateOfBirth)}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-pink-500" />
                    <h3 className="text-2xl font-black">Address</h3>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-200">
                    <p className="font-bold text-gray-900 text-lg mb-2">{user.address.street}</p>
                    <p className="text-gray-700 font-semibold">
                      {user.address.city}, {user.address.state} {user.address.zipCode}
                    </p>
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-purple-500" />
                    <h3 className="text-2xl font-black">Insurance</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-2xl border-2 border-purple-200">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Provider</p>
                      <p className="font-black text-green-600 text-lg">{user.insurance.provider}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-2xl border-2 border-purple-200">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Policy Number</p>
                      <p className="font-bold text-gray-900 text-lg">{user.insurance.policyNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <h3 className="text-2xl font-black">Account</h3>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
                    <p className="font-bold text-gray-900 text-lg">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-3xl font-black mb-6">Edit Profile</h3>
                
                <div className="space-y-5">
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
                      required
                    />
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
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
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
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
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
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase tracking-wider text-gray-700">
                        Insurance Provider
                      </label>
                      <select
                        name="insuranceProvider"
                        value={formData.insuranceProvider}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
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
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all text-lg font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user.name,
                        street: user.address.street,
                        city: user.address.city,
                        zipCode: user.address.zipCode,
                        insuranceProvider: user.insurance.provider,
                        policyNumber: user.insurance.policyNumber
                      });
                    }}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 font-black uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white rounded-full hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 font-black uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <ProfileContent />
    </AuthProvider>
  );
}