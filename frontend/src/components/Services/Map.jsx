import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { IoStar, IoStarOutline } from "react-icons/io5";

// Create a custom icon
const createCustomIcon = (isActive) => {
  return new L.Icon({
    iconUrl: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
    iconSize: isActive ? [42, 42] : [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// ✅ Component to detect map changes and fetch garages in bounds
const MapUpdater = ({ setGarages }) => {
  useMapEvents({
    moveend: async function () {
      const bounds = this.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      try {
        const res = await fetch(
  `http://localhost:5173/api/garages/in-bounds?neLat=${ne.lat}&neLng=${ne.lng}&swLat=${sw.lat}&swLng=${sw.lng}`
);
const data = await res.json();

if (res.ok && Array.isArray(data)) {
  setGarages(data);
} else {
  console.error("Failed to fetch garages:", data.message || data);
  setGarages([]); // fallback to empty array
}
      } catch (err) {
        console.error("Error fetching garages in bounds", err);
      }
    }
  });
  return null;
};

const Map = ({ activeMarker, setGarages, garages  }) => {
  const mapRef = useRef(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  

  // ✅ Recenter when active marker changes
  useEffect(() => {
    if (mapRef.current && garages.length > 0 && activeMarker != null) {
      const selected = garages[activeMarker];
      if (selected) {
        const [lng, lat] = selected.location.coordinates;
        mapRef.current.setView([lat, lng - 0.04], 13, { animate: true });
      }
    }
  }, [activeMarker, garages]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[16.3067, 80.4365]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Fetch garages in map bounds */}
        <MapUpdater setGarages={setGarages} />

        {/* Render markers */}
        {garages.map((garage, index) => {
          const [lng, lat] = garage.location.coordinates;
          return (
            <Marker
              key={garage._id}
              position={[lat, lng]}
              icon={createCustomIcon(index === activeMarker)}
            >
              <Popup>
                <div className="sm:max-w-md w-full max-h-[60vh] pr-1 overflow-y-auto p-2 space-y-2 text-sm sm:text-base">
                  <div className="w-full h-1/3 bg-neutral-400 rounded-md"></div>
                  <h1 className="text-lg sm:text-2xl mt-2 sm:mt-4 font-bold">{garage.name}</h1>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-neutral-600">
                    {garage.location.address}
                  </p>
                  <h2 className="text-base sm:text-lg mt-2 sm:mt-4 font-semibold">Services</h2>
                  <div className="mt-2 flex flex-col gap-2 sm:gap-3">
                    {garage.services?.map((s, i) => (
                      console.log(s.service.name),
                      <Service
                        key={i}
                        serviceName={s.service?.name || "Unknown"}
                        rating={4} // Replace with real rating if available
                      />
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Mobile Bottom Drawer for Services */}
      {isMobile && garages[activeMarker]?.services?.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white z-[1000] shadow-md rounded-t-xl p-4 max-h-[40vh] overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">Services at {garages[activeMarker].name}</h2>
          {garages[activeMarker].services.map((s, i) => (
            <Service key={i} serviceName={s.service?.name || "Unknown"} rating={4} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Map;

// ✅ Service Component
export const Service = ({ serviceName = "Service", rating = 4 }) => {
  return (
    <div className="w-full py-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
      <h5 className="text-xs sm:text-sm font-semibold text-neutral-800">{serviceName}</h5>
      <div className="flex gap-1 items-center text-neutral-800 text-xs sm:text-sm">
        <span>{rating}</span>
        <span className="flex flex-wrap sm:flex-nowrap">
          {[...Array(5)].map((_, i) =>
            i < rating ? <IoStar key={i} /> : <IoStarOutline key={i} />
          )}
        </span>
        <span>(121)</span>
      </div>
    </div>
  );
};