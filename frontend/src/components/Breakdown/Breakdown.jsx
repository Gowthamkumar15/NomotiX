import { useGSAP } from "@gsap/react";
import { useEffect } from "react";
import gsap from "gsap";
import React, { useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { ServiceSelectionBreakdown } from "./ServiceSelectionBreakdown";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Handler } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from "react-router-dom";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const services=[
	{
		parentName: "Engine Failure",
		childServices: ["Engine Overheating", "Oil leak" , "Crankshaft Issue"],
	},
	{
		parentName:"Flatten Tyre",
		childServices:["Puncture repair", "Tyre Replacement"],
	},
	{
		parentName:"Electrical Issues",
		childServices:["Battery Failure","Starter Problem", "Alternator Problem"],
	},
	{
		parentName:"Overheating",
		childServices:["Coolant Leak","Fan Not Working"],
	},
];
const Breakdown = () => {
	const [activeGarage, setActiveGarage] = useState(null);
	const [location, setlocation] = useState("");
	const [query, setQuery] = useState("");
	const [suggestions, setSuggestions] = useState([]);
	const [selectedServices, setSelectedServices] = useState([]);
	const navigate = useNavigate();
	const handleChange = async (e) => {
		const value = e.target.value;
		setQuery(value);

		if (value.length < 3) return;

		try {
			const res = await fetch(`https://photon.komoot.io/api/?q=${value}&limit=5`);
			const data = await res.json();
			const results = data.features.map((feature) => ({
			  name: feature.properties.name + (feature.properties.city ? `, ${feature.properties.city}` : ""),
			  lat: feature.geometry.coordinates[1],
			  lng: feature.geometry.coordinates[0],
			}));
			setSuggestions(results);
		  } catch (err) {
			console.error("Error fetching suggestions:", err);
		  }
	};
	const onSelectLocation = ({ lat, lng }) => {
		setlocation({ lat, lng });
	  };
	const handleSelect = (place) => {
		setQuery(place.name);
		setSuggestions([]);
		onSelectLocation({ lat: place.lat, lng: place.lng });
	};
	const toggleChildService = (parent, child) => {
		setSelectedServices((prev) => {
			const current = prev[parent] || [];
			const updated = current.includes(child)
			  ? current.filter((c) => c !== child)
			  : [...current, child];
			return { ...prev, [parent]: updated };
		  });
	};
	const RecenterMap = ({ lat, lng }) => {
		const map = useMap();
	  
		useEffect(() => {
		  if (lat && lng) {
			map.setView([lat, lng], map.getZoom(), {
			  animate: true,
			});
		  }
		}, [lat, lng, map]);
	  
		return null;
	  };
	const handlenearbyClick =() =>{

		navigator.geolocation.getCurrentPosition(
			(position) => {
			  const { latitude, longitude } = position.coords;
			  setlocation({ lat: latitude, lng: longitude });
			  setQuery("Current Location");
			},
			(error) => {
			  console.error("Permission denied or unavailable", error);
			}
		  );
	}
	const handleGarageClick = (garageId) => {
		if (garageId === null) {
			gsap.to(".popover", {
				opacity: 0,
				display: "none",
			});
			setActiveGarage(null);
			return;
		}

		if (activeGarage === garageId) {
			gsap.to(".popover", {
				opacity: 0,
				display: "none",
			});
			setActiveGarage(null);
			return;
		}

		setActiveGarage(garageId);
		gsap.to(".popover", {
			opacity: 1,
			display: "block",
			duration: 0.5,
			ease: "power4.inOut",
		});
	};
	return (
		<section className="w-full min-h-screen flex flex-col lg:flex-row">
			<div className="w-full lg:w-3/5 bg-primary-100 p-4">
				<h1 className="font-fraunces font-bold text-4xl text-center text-secondary-200">
					Audio Q3 (2017)
				</h1>
				<div className="w-full flex justify-center items-center">
					<img src="/car.png" alt="car" className="w-[80%] object-cover" />
					{location && (
			<div className="w-full lg:w-[55%] rounded-xl overflow-hidden shadow-lg mt-4">
				<MapContainer
				center={[location.lat, location.lng]}
				zoom={14}
				scrollWheelZoom={false}
				style={{ height: "400px", width: "100%", borderRadius: "12px" }}
				>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker position={[location.lat, location.lng]}>
					<Popup>
					{query}
					</Popup>
				</Marker>
				<RecenterMap lat={location.lat} lng={location.lng}></RecenterMap>
				</MapContainer>
				
			</div>
			)}
				</div>
				
			</div>
			
			<div className="w-full lg:w-2/5 p-4 bg-yellow-900 text-primary-100 flex flex-col justify-between">
				<div>
					<h2 className="font-fraunces font-semibold text-2xl text-center">
						Select Breakdown services
					</h2>
					<div className="mt-4 flex flex-col sm:flex-row items-center gap-2 w-full max-w-2xl">

					<div className="relative w-full max-w-2xl">
						{/* Search Input */}
						<input
							type="text"
							value={query}
							onChange={handleChange}
							placeholder="Search Garages in..."
							className="w-full h-14 px-4 bg-primary-100 text-secondary-200 rounded-md focus:outline-none"
						/>

						{/* Suggestions List */}
						{suggestions.length > 0 && (
							<ul className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
							{suggestions.map((place, i) => (
								<li
								key={i}
								className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
								onClick={() => handleSelect(place)}
								>
								{place.name}
								</li>
							))}
							</ul>
						)}
						</div>
      {/* Nearby Search Button */}
      <button
        className="flex items-center gap-1 h-14 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition" onClick={()=>handlenearbyClick()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.75 17.25L6 21M6 21l-3.75-3.75M6 21V9.75m12.75 0A6.75 6.75 0 1112 3a6.75 6.75 0 016.75 6.75z"
          />
        </svg>
        <span className="text-sm">Nearby</span>
      </button>

      {/* Search Icon Button */}
      <button className="h-14 w-14 flex justify-center items-center bg-primary-100 text-secondary-200 rounded-md hover:bg-primary-200 transition" onClick={() => handleSearchClick(garage.id)}>
        <FiSearch className="text-2xl" />
      </button>
    </div>
	
					<div className="w-full pt-8 flex flex-col gap-6">
					{services.map(({ parentName, childServices }) => (
						<ServiceSelectionBreakdown
						key={parentName}
						parentName={parentName}
						childServices={childServices}
						selectedServices={selectedServices[parentName] || []}
						toggleService={(child) => toggleChildService(parentName, child)}
						/>
					))}
					</div>
				</div>

        <div className="flex justify-end">
          <button
            className="bg-primary-100 text-secondary-200 px-3 py-2 text-sm sm:text-base rounded-sm hover:bg-primary-200 transition"
            onClick={async () => {
              if (!location || Object.keys(selectedServices).length === 0) {
                alert("Please select location and at least one service.");
                return;
              }

              try {
                const servicesArray = Object.entries(selectedServices).flatMap(([parent, children]) =>
                  children.map(child => `${parent} - ${child}`)
                );

                const res = await fetch("http://localhost:5001/api/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    Customer: "666f99c867542b2b5d1aabc3", // replace if dynamic
					serviceType: "breakdown",
                    services: servicesArray,
					breakdownDetails: {
						location: location,
                    	Status: "pending",
					}
                  }),
                });
			
                const data = await res.json();

                if (res.ok) {
                  navigate("/requestBroadcast", {
                    state: {
                      location,
                      radius: 5000,
                      bookingId: data.bookingId,
                    },
                  });
                } else {
                  throw new Error(data.message || "Booking failed");
                }
              } catch (err) {
                console.error("Booking error:", err);
                alert("Something went wrong while sending your request.");
              }
            }}
          >
            Send Request
          </button>
        </div>
			</div>
		</section>
	);
};

export default Breakdown;
