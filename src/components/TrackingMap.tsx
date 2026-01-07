"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; items-center; justify-center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const bakeryIcon = L.divIcon({
  className: "bakery-icon",
  html: `<div style="font-size: 24px; filter: drop-shadow(0 0 5px rgba(201,169,98,0.8))">🍫</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const deliveryIcon = L.divIcon({
  className: "delivery-icon",
  html: `<div style="font-size: 24px; filter: drop-shadow(0 0 5px rgba(201,169,98,0.8))">📍</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const truckIcon = L.divIcon({
  className: "truck-icon",
  html: `<div style="font-size: 28px; filter: drop-shadow(0 0 8px rgba(212,165,116,0.6)); animation: bounce 1s infinite alternate">🚚</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to handle map center updates
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface TrackingMapProps {
  bakeryPos: [number, number];
  deliveryPos: [number, number];
  driverPos: [number, number];
  status: string;
}

export default function TrackingMap({ bakeryPos, deliveryPos, driverPos, status }: TrackingMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-[#0F0A07] animate-pulse" />;

  // Default coordinates if none provided (NYC)
  const defaultBakery: [number, number] = bakeryPos[0] !== 0 ? bakeryPos : [40.7128, -74.0060];
  const defaultDelivery: [number, number] = deliveryPos[0] !== 0 ? deliveryPos : [40.7306, -73.9352];
  const currentDriver: [number, number] = driverPos[0] !== 0 ? driverPos : defaultBakery;

  return (
    <div className="w-full h-full relative group">
      <MapContainer
        center={currentDriver}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <ChangeView center={currentDriver} zoom={14} />
        
        {/* Premium Dark Theme Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Path line */}
        <Polyline 
          positions={[bakeryPos, deliveryPos]} 
          color="#C9A962" 
          weight={3} 
          opacity={0.4} 
          dashArray="10, 10" 
        />
        
        <Polyline 
          positions={[bakeryPos, currentDriver]} 
          color="#C9A962" 
          weight={4} 
          opacity={0.8} 
        />

        {/* Bakery Marker */}
        <Marker position={bakeryPos} icon={bakeryIcon} />

        {/* Delivery Marker */}
        <Marker position={deliveryPos} icon={deliveryIcon} />

        {/* Driver/Truck Marker */}
        {status !== "delivered" && (
          <Marker position={currentDriver} icon={truckIcon} />
        )}

        {/* Custom Overlays for Aesthetic */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-[#0F0A07] z-[1000]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0F0A07] via-transparent to-[#0F0A07] opacity-40 z-[999]" />
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #0F0A07 !important;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
