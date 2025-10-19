"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hospitals`)
      .then(res => res.json())
      .then(data => {
        setHospitals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">LifeBoon</h1>
        <p className="text-sm">Find healthcare services near you</p>
      </header>
      
      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading hospitals...</p>
          </div>
        ) : (
          <MapWithNoSSR hospitals={hospitals} />
        )}
      </div>
    </main>
  );
}