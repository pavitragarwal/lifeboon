"use client";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../../components/AuthProvider";
import { Calendar, Clock, MapPin, X, CheckCircle, Trash2, Navigation } from "lucide-react";

function BookingsContent() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/user/${user._id}`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!confirm("Cancel this appointment?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("✅ Appointment cancelled");
        fetchAppointments();
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  const upcomingAppointments = appointments.filter(apt => 
    isUpcoming(apt.appointmentDate) && apt.status === "scheduled"
  );

  const pastAppointments = appointments.filter(apt => 
    !isUpcoming(apt.appointmentDate) || apt.status !== "scheduled"
  );

  const AppointmentCard = ({ appointment, isPast = false }) => (
    <div className={`relative overflow-hidden rounded-3xl p-6 transition-all hover:shadow-2xl hover:-translate-y-1 ${
      isPast 
        ? 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300' 
        : 'bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-1">{appointment.hospitalId?.name}</h3>
          <p className="text-sm text-gray-600 capitalize font-semibold">{appointment.specialty} • {appointment.serviceType}</p>
        </div>
        {!isPast && (
          <span className="bg-green-500 text-white text-xs font-black px-4 py-2 rounded-full">
            CONFIRMED
          </span>
        )}
        {isPast && appointment.status === "cancelled" && (
          <span className="bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full">
            CANCELLED
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 bg-white/50 rounded-2xl p-3">
          <Calendar className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-gray-800">{formatDate(appointment.appointmentDate)}</span>
        </div>
        
        <div className="flex items-center gap-3 bg-white/50 rounded-2xl p-3">
          <Clock className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-gray-800">{appointment.appointmentTime}</span>
        </div>

        <div className="flex items-start gap-3 bg-white/50 rounded-2xl p-3">
          <MapPin className="w-5 h-5 mt-0.5 text-orange-500" />
          <span className="text-sm text-gray-700 font-medium">{appointment.hospitalId?.address}</span>
        </div>
      </div>

      {appointment.notes && (
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl mb-4">
          <p className="text-sm text-gray-800">
            <span className="font-black">Notes:</span> {appointment.notes}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${appointment.hospitalId?.lat},${appointment.hospitalId?.lon}`;
            window.open(url, "_blank");
          }}
          className="flex-1 px-4 py-3 bg-black text-white rounded-full hover:bg-gray-800 font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </button>
        {!isPast && (
          <button
            onClick={() => cancelAppointment(appointment._id)}
            className="px-4 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 font-black text-sm uppercase tracking-wide flex items-center gap-2 transition-all hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">MY BOOKINGS</h1>
          <p className="text-xl text-white/90 font-medium">Manage your appointments</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Upcoming Appointments */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-4xl font-black">Upcoming</h2>
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-black">
              {upcomingAppointments.length}
            </span>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border-4 border-dashed border-gray-300">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl font-black text-gray-800 mb-3">No upcoming appointments</p>
              <p className="text-gray-600 mb-6 font-medium">Book your first appointment today</p>
              <a
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-2xl hover:scale-105 font-black uppercase tracking-wider transition-all"
              >
                Find Hospitals
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingAppointments.map(apt => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-4xl font-black mb-6 text-gray-700">Past Appointments</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pastAppointments.map(apt => (
                <AppointmentCard key={apt._id} appointment={apt} isPast={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AuthProvider>
      <BookingsContent />
    </AuthProvider>
  );
}