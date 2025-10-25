// frontend/app/page.js - WITH AUTO-ZOOM, SPECIALTY CHIPS, BIG MODAL, HEADER SPACING
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AuthProvider, useAuth } from "../components/AuthProvider";
import {
  MapPin,
  Phone,
  Bed,
  Filter,
  Search,
  Calendar,
  X,
  Navigation,
  Heart,
  Eye,
  Stethoscope,
  Activity,
  Hospital,
} from "lucide-react";
import dynamic from "next/dynamic";

// Import Leaflet dynamically
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Normalize a specialty string for matching
const norm = s => (s || "").toString().trim().toLowerCase();

function HomeContent() {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [viewMode, setViewMode] = useState("map");

  const [radius, setRadius] = useState(10);
  const [specialty, setSpecialty] = useState("");                // current selected specialty (chips or dropdown)
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetchHospitals();
      fetchSpecialties();
    }
  }, [user]);

  const fetchSpecialties = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hospitals/meta/specialties`);
      const data = await res.json();
      if (Array.isArray(data) && data.length) {
        setAvailableSpecialties(data.map(s => norm(s)));
      }
    } catch {
      // If API fails, we'll fall back to unique specialties from hospitals (computed later)
    }
  };

  const fetchHospitals = async () => {
    if (!user?.address) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hospitals`);
      const data = await res.json();

      const hospitalsWithDistance = (data || []).map(h => {
        const distance = calculateDistance(
          user.address.lat, user.address.lon,
          h.lat, h.lon
        );

        const insuranceCovered = h.acceptsInsurance?.some(
          ins => norm(ins) === norm(user?.insurance?.provider)
        );

        return {
          ...h,
          specialties: (h.specialties || []).map(norm),
          acceptsInsurance: (h.acceptsInsurance || []),
          distance: Math.round(distance * 10) / 10,
          insuranceCovered
        };
      }).sort((a, b) => a.distance - b.distance);

      setHospitals(hospitalsWithDistance);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Build a fallback unique specialty list from fetched hospitals
  const fallbackSpecialties = useMemo(() => {
    const s = new Set();
    hospitals.forEach(h => (h.specialties || []).forEach(sp => sp && s.add(sp)));
    return Array.from(s).sort();
  }, [hospitals]);

  // Use API list if available, else fallback
  const chipSpecialties = (availableSpecialties?.length ? availableSpecialties : fallbackSpecialties);

  // Apply filters
  const filteredHospitals = hospitals.filter(h => {
    if (h.distance > radius) return false;

    if (specialty && !(h.specialties || []).includes(norm(specialty))) return false;

    if (searchTerm) {
      const t = norm(searchTerm);
      const name = norm(h.name);
      const addr = norm(h.address);
      if (!name.includes(t) && !addr.includes(t)) return false;
    }
    return true;
  });

  const getDirections = (hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${user.address.lat},${user.address.lon}&destination=${hospital.lat},${hospital.lon}`;
    window.open(url, "_blank");
  };

  const HospitalCard = ({ hospital, compact = false, onOpen }) => {
    const isCovered = hospital.insuranceCovered;

    return (
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          compact ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'
        } ${isCovered ? 'border-2 border-green-400' : 'border border-gray-200'} rounded-2xl ${
          compact ? 'p-4' : 'p-6'
        } hover:shadow-2xl hover:-translate-y-1 group cursor-pointer`}
        onClick={() => onOpen?.(hospital)}
      >
        {isCovered && (
          <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-green-600 text-white text-xs font-black px-4 py-2 rounded-bl-2xl">
            ✓ COVERED
          </div>
        )}

        <h3 className={`${compact ? 'text-lg' : 'text-2xl'} font-black text-gray-900 mb-2 tracking-tight`}>
          {hospital.name}
        </h3>

        <div className={`space-y-2 ${compact ? 'text-xs' : 'text-sm'} mb-4`}>
          <div className="flex items-start gap-2">
            <MapPin className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mt-0.5 flex-shrink-0 text-gray-400`} />
            <span className="text-gray-600">{hospital.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <Navigation className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-blue-500`} />
            <span className="font-bold text-blue-600">{hospital.distance} miles away</span>
          </div>

          <div className="flex items-center gap-2">
            <Bed className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} flex-shrink-0 text-gray-400`} />
            <span className="font-semibold text-gray-900">{hospital.services?.beds || 0} beds</span>
          </div>
        </div>

        {!compact && hospital.specialties?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.slice(0, 3).map((spec, i) => (
                <span key={i} className="text-xs bg-black text-white px-3 py-1 rounded-full capitalize font-semibold">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {!compact && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Insurance</p>
            <div className="flex flex-wrap gap-2">
              {hospital.acceptsInsurance?.slice(0, 4).map((ins, i) => {
                const isUserInsurance = norm(ins) === norm(user.insurance.provider);
                return (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      isUserInsurance
                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ins}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); getDirections(hospital); }}
            className={`flex-1 ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} bg-black text-white rounded-full hover:bg-gray-800 font-bold tracking-wide transition-all uppercase`}
          >
            Directions
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedHospital(hospital);
              setShowBooking(true);
            }}
            className={`flex-1 ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'} bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-2`}
          >
            <Calendar className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
            Book
          </button>
        </div>
      </div>
    );
  };

  const MapView = ({ radiusMiles, hospitals, onOpenHospital }) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [L, setL] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        import('leaflet/dist/leaflet.css');
        import('leaflet').then((leaflet) => {
          setL(leaflet.default);
          setMapLoaded(true);
        });
      }
    }, []);

    // Fit map to current radius & visible markers
    useEffect(() => {
      if (!L || !mapRef.current || !user) return;

      const map = mapRef.current;
      const bounds = L.latLngBounds([]);
      // Always include user location
      const userLL = L.latLng(user.address.lat, user.address.lon);
      bounds.extend(userLL);

      // Include all filtered hospitals (within radius already)
      hospitals.forEach(h => bounds.extend([h.lat, h.lon]));

      // If only user is present (no hospitals), create a pseudo circle bounds from radius
      if (hospitals.length === 0) {
        const m = radiusMiles * 1609.34;
        const dummyCircle = L.circle(userLL, { radius: m });
        map.fitBounds(dummyCircle.getBounds(), { padding: [40, 40] });
      } else {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }, [L, radiusMiles, hospitals, user]);

    if (!mapLoaded || !L) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-2xl">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold">Loading Map...</p>
          </div>
        </div>
      );
    }

    // Create custom icons for hospitals
    const createHospitalIcon = (specialty) => {
      const iconColors = {
        cardiology: '#d71515ff',
        eye: '#000000ff',
        dental: '#8acbe3ff',
        orthopedics: '#f59e0b',
        pediatrics: '#e883b6ff',
        trauma: '#18c50fff',
        general: '#6366f1',
        default: '#8b5cf6'
      };
      const color = iconColors[specialty] || iconColors.default;

      return L.divIcon({
        html: `
          <div style="
            background: ${color};
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            transform: rotate(-45deg);
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              color: white;
              font-size: 18px;
              transform: rotate(45deg);
            ">🏥</span>
          </div>
        `,
        className: 'custom-hospital-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });
    };

    // User location icon
    const userIcon = L.divIcon({
      html: `
        <div style="
          background: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          animation: pulse 2s infinite;
        "></div>
      `,
      className: 'custom-user-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    return (
      <MapContainer
        center={[user.address.lat, user.address.lon]}
        zoom={11}
        whenCreated={(map) => (mapRef.current = map)}
        className="h-full w-full rounded-2xl shadow-2xl"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* User location marker */}
        <Marker position={[user.address.lat, user.address.lon]} icon={userIcon}>
          <Popup>
            <div className="text-center p-2">
              <p className="font-bold text-blue-600">📍 Your Location</p>
              <p className="text-sm">{user.address.city}, {user.address.state}</p>
            </div>
          </Popup>
        </Marker>

        {/* Hospital markers */}
        {filteredHospitals.map(hospital => (
          <Marker
            key={hospital._id}
            position={[hospital.lat, hospital.lon]}
            icon={createHospitalIcon(hospital.specialties?.[0])}
            eventHandlers={{
              click: () => {
                setSelectedHospital(hospital);
                setShowHospitalModal(true);
              }
            }}
          >
            <Popup maxWidth={340}>
              <HospitalCard hospital={hospital} compact={true} onOpen={(h) => {
                setSelectedHospital(h);
                setShowHospitalModal(true);
              }} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  const HospitalModal = ({ hospital, onClose }) => {
    if (!hospital) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4">
                <Hospital className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight">{hospital.name}</h2>
                <p className="text-sm text-white/80 mt-1">{hospital.address}</p>
                <p className="text-sm font-semibold mt-1">{hospital.distance} mi • {hospital.services?.beds || 0} beds</p>
              </div>
              <button onClick={onClose} className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 rounded-full p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {(hospital.specialties || []).map((s, i) => (
                    <span key={i} className="text-xs bg-black text-white px-3 py-1 rounded-full capitalize font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Insurance</p>
                <div className="flex flex-wrap gap-2">
                  {(hospital.acceptsInsurance || []).map((ins, i) => {
                    const isUserInsurance = norm(ins) === norm(user.insurance?.provider);
                    return (
                      <span key={i}
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          isUserInsurance
                            ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {ins}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => getDirections(hospital)}
                className="w-full px-5 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 font-bold tracking-wide transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" /> Directions
              </button>
              <button
                onClick={() => {
                  setSelectedHospital(hospital);
                  setShowBooking(true);
                  onClose();
                }}
                className="w-full px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 font-bold tracking-wide transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" /> Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingModal = ({ hospital, onClose }) => {
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [notes, setNotes] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
      if (appointmentDate) fetchAvailableSlots();
    }, [appointmentDate]);

    const fetchAvailableSlots = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments/available/${hospital._id}/${appointmentDate}`
        );
        const data = await res.json();
        setAvailableSlots(data.availableSlots || []);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setBookingLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            hospitalId: hospital._id,
            patientName: user.name,
            appointmentDate,
            appointmentTime,
            serviceType,
            specialty: selectedSpecialty,
            notes
          })
        });
        const data = await res.json();
        if (data.conflict) {
          alert("This time slot is already booked. Please choose another time.");
        } else if (res.ok) {
          alert("Appointment booked successfully!");
          onClose();
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        alert("Error: " + err.message);
      } finally {
        setBookingLoading(false);
      }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Book Now</h2>
              <p className="text-gray-600 text-sm mt-1">{hospital.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={today}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-black focus:outline-none transition"
                required
              />
            </div>

            {appointmentDate && (
              <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Time</label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-black focus:outline-none transition"
                  required
                >
                  <option value="">Select Time</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {availableSlots.length === 0 && (
                  <p className="text-sm text-red-600 mt-2 font-semibold">No available slots</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-black focus:outline-none transition"
                required
              >
                <option value="">Select Specialty</option>
                {hospital.specialties?.map((spec, i) => (
                  <option key={i} value={spec} className="capitalize">{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Service</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-black focus:outline-none transition"
                required
              >
                <option value="">Select Service</option>
                <option value="consultation">Consultation</option>
                <option value="checkup">General Checkup</option>
                <option value="emergency">Emergency</option>
                <option value="surgery">Surgery Consultation</option>
                <option value="followup">Follow-up</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-black focus:outline-none transition resize-none"
                rows="3"
                placeholder="Additional information..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 font-bold uppercase tracking-wide transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={bookingLoading || !availableSlots.length}
                className="flex-1 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-300 font-bold uppercase tracking-wide transition"
              >
                {bookingLoading ? "Booking..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top spacer to separate Find Care / Bookings / Profile headers if present */}
      <div className="h-4 md:h-6" />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">
            FIND CARE
          </h1>
          <p className="text-xl text-gray-300 font-light">
            {user.address.city}, WA | <span className="font-semibold text-orange-400">{user.insurance.provider}</span> Insurance
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-black focus:outline-none transition font-medium"
                />
              </div>
            </div>

            {/* Specialty dropdown (still kept), but chips below are the primary UX */}
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-full focus:border-black focus:outline-none transition font-bold capitalize"
            >
              <option value="">All Specialties</option>
              {chipSpecialties.map(spec => (
                <option key={spec} value={spec} className="capitalize">{spec}</option>
              ))}
            </select>

            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="px-4 py-3 border-2 border-gray-200 rounded-full focus:border-black focus:outline-none transition font-bold"
            >
              <option value="5">Within 5 mi</option>
              <option value="10">Within 10 mi</option>
              <option value="15">Within 15 mi</option>
              <option value="25">Within 25 mi</option>
              <option value="50">Within 50 mi</option>
              <option value="100">Within 100 mi</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("map")}
                className={`flex-1 px-4 py-3 rounded-full font-bold transition uppercase tracking-wide ${
                  viewMode === "map"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 px-4 py-3 rounded-full font-bold transition uppercase tracking-wide ${
                  viewMode === "list"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Specialty CHIPS row */}
          {!!chipSpecialties.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSpecialty("")}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                  specialty === "" ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              {chipSpecialties.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpecialty(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize border ${
                    norm(specialty) === s
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <p className="text-lg font-bold">
          <span className="text-3xl">{filteredHospitals.length}</span>
          <span className="text-gray-600 ml-2">facilities found</span>
          {specialty && <span className="text-gray-600"> • <span className="text-orange-500 capitalize">{specialty}</span> specialty</span>}
          <span className="text-gray-600"> • Within {radius} miles</span>
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl font-bold">Loading...</p>
            </div>
          </div>
        ) : viewMode === "map" ? (
          <div className="h-[calc(100vh-360px)] min-h-[520px]">
            <MapView
              radiusMiles={radius}
              hospitals={filteredHospitals}
              onOpenHospital={(h) => { setSelectedHospital(h); setShowHospitalModal(true); }}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map(hospital => (
              <HospitalCard
                key={hospital._id}
                hospital={hospital}
                onOpen={(h) => { setSelectedHospital(h); setShowHospitalModal(true); }}
              />
            ))}
          </div>
        )}

        {!loading && filteredHospitals.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl">
            <p className="text-2xl font-black text-gray-800 mb-4">No hospitals found</p>
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSpecialty("");
                setRadius(25);
              }}
              className="px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 font-bold uppercase tracking-wide transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Large Hospital Details Modal */}
      {showHospitalModal && selectedHospital && (
        <HospitalModal
          hospital={selectedHospital}
          onClose={() => {
            setShowHospitalModal(false);
            setSelectedHospital(null);
          }}
        />
      )}

      {/* Booking Modal */}
      {showBooking && selectedHospital && (
        <BookingModal
          hospital={selectedHospital}
          onClose={() => {
            setShowBooking(false);
            setSelectedHospital(null);
          }}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
