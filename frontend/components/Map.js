"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map({ hospitals }) {
  const [pos, setPos] = useState([47.6062, -122.3321]);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((p) => {
        setPos([p.coords.latitude, p.coords.longitude]);
      });
    }
  }, []);

  return (
    <MapContainer center={pos} zoom={12} className="h-full w-full">
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {hospitals.map(h => (
        <Marker key={h._id} position={[h.lat, h.lon]}>
          <Popup>
            <div className="w-64">
              <h3 className="font-bold text-lg">{h.name}</h3>
              <p className="text-sm mt-1">{h.address}</p>
              <p className="text-xs mt-1">📞 {h.phone}</p>
              <p className="text-xs">🛏️ {h.services?.beds ?? 0} beds</p>
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                  Directions
                </button>
                <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                  Book
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}