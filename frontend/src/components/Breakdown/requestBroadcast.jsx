// RequestBroadcast.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap,Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./requestBroadcast.css"; // Additional custom styles
import { Polyline } from "react-leaflet";
// Import animated lines data
const BroadcastMap = ({ center, garages }) => {
  const map = useMap();
    const [animatedLines, setAnimatedLines] = useState([]); 
  useEffect(() => {
    map.setView(center, 13);
    setAnimatedLines(garages.map(g => ({
      from: center,
      to: [g.location.coordinates[1], g.location.coordinates[0]]
    })));
  }, [center, map]);

  return (
    <>
      {/* User Location Marker */}
      <Marker
        position={center}
        icon={L.icon({
          iconUrl: "/car.png",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })}
      />
      <Circle center={center} radius={5000} pathOptions={{ color: 'secondary-200', fillOpacity: 0.2 }} />

      {/* Nearby Garage Markers */}
      {Array.isArray(garages) &&
        garages.map((g, i) => {
          const [lng, lat] = g.location.coordinates || [];
          if (!lat || !lng) return null;

          return (
            <Marker
              key={g._id || i}
              position={[lat, lng]}
            >
                {/* Animated beams */}
      {animatedLines.map((line, i) => (
        <Polyline
          key={i}
          positions={[line.from, line.to]}
          pathOptions={{ className: 'garage-beam' }}
        />
      ))}
              <Popup>
                <div>
                  <strong>{g.name}</strong>
                  <br />
                  {g.location.address || "No address"}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
};

const RequestBroadcast = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const defaultLocation = { lat: 12.9716, lng: 77.5946 }; // Bangalore
const defaultRadius = 50000; // in meters (5km)

const location = state?.location || defaultLocation;
const radius = state?.radius || defaultRadius;
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyGarages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/garages/nearbygarages?lat=${location.lat}&lng=${location.lng}`
        );
        const data = await res.json();
        setGarages(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch nearby garages", err);
      }
    };

    if (location) fetchNearbyGarages();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#fcfaf8] font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif] flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-2 text-center text-[#1c140d] animate-fadeIn">Sending Breakdown Request...</h2>
      <p className="text-[#9c7349] text-md text-center mb-4 animate-slideUp">Notifying nearby garages based on your location</p>

      <div className="rounded-xl overflow-hidden shadow-xl w-[90%] max-w-5xl h-[500px] border-2 border-[#e5dbd0] animate-zoomIn">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <BroadcastMap center={[location.lat, location.lng]} garages={garages} />
        </MapContainer>
      </div>

      <div className="mt-8 flex justify-center gap-4 animate-fadeIn">
        <button
          onClick={() => navigate("/")}
          className="bg-[#f4ede7] text-[#1c140d] font-semibold px-5 py-2 rounded-full hover:bg-[#e9e0d6] shadow-md transition-all duration-300"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate("/mybookings")}
          className="bg-secondary-200 text-white font-semibold px-6 py-2 rounded-full hover:bg-[#4f46e5] shadow-lg transition-all duration-300"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default RequestBroadcast;
