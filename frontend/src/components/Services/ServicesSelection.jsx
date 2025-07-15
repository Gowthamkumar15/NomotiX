import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaAngleDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { FiFilter ,FiCheck} from "react-icons/fi";
import { IoStar, IoStarOutline } from "react-icons/io5";
import { MdGpsFixed } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Map from "./Map";
import { useDispatch } from "react-redux";
import { setBookingDetails } from "../../redux/bookingSlice"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import {store} from "../../store";
const ServicesSelection = () => {
	const [garages, setGarages] = useState([]);
	const [activeGarage, setActiveGarage] = useState(null);
	const [selectedService, setSelectedService] = useState(null);
	const [selectedServices, setSelectedServices] = useState([]);
	const [selectionHistory, setSelectionHistory] = useState([]);
	const [searchLocation, setSearchLocation] = useState("");
	const [mapCenter, setMapCenter] = useState(null); // for recentering
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showFilters, setShowFilters] = useState(false);

	// Restore state from localStorage, including selectionHistory and activeGarage if needed
	useEffect(() => {
	  const storedServices = localStorage.getItem("selectedServices");
	  const storedMapCenter = localStorage.getItem("mapCenter");
	  const storedSelectionHistory = localStorage.getItem("selectionHistory");
	  const storedActiveGarage = localStorage.getItem("activeGarage");

	  let parsedActiveGarage = null;

	  if (storedServices) {
	    try {
	      const parsed = JSON.parse(storedServices);
	      setSelectedServices(parsed);
	      dispatch(setBookingDetails({
	        garage: null,
	        services: parsed,
	        customer: null,
	        bookingTime: null,
	      }));
	    } catch (e) {
	      console.error("Failed to parse stored services", e);
	    }
	  }

	  if (storedMapCenter) {
	    try {
	      setMapCenter(JSON.parse(storedMapCenter));
	    } catch (e) {
	      console.error("Failed to parse map center", e);
	    }
	  }

	  if (storedSelectionHistory) {
	    try {
	      setSelectionHistory(JSON.parse(storedSelectionHistory));
	    } catch (e) {
	      console.error("Failed to parse selection history", e);
	    }
	  }

	  if (storedActiveGarage) {
	    try {
	      parsedActiveGarage = JSON.parse(storedActiveGarage);
	      setActiveGarage(parsedActiveGarage);
	    } catch (e) {
	      console.error("Failed to parse active garage", e);
	    }
	  }

	  const handler = (e) => {
	    if (e.detail) {
	      setSelectedServices(e.detail);
	    }
	  };
	  window.addEventListener("updateSelectedServices", handler);
	  return () => window.removeEventListener("updateSelectedServices", handler);
	}, []);
	const handleGoBack = () => {
		const last = selectionHistory.pop();
		if (last) {
			setSelectedService(last.service);
			setActiveGarage(last.garageIndex);
			fetchReviews(garages[last.garageIndex]._id, last.service.service._id);
			setSelectionHistory([...selectionHistory]);
			// Persist selectionHistory and activeGarage
			localStorage.setItem("selectionHistory", JSON.stringify([...selectionHistory]));
			localStorage.setItem("activeGarage", JSON.stringify(last.garageIndex));
		}
	};
	const handleGarageClick = (index) => {
		if (index === activeGarage) {
			gsap.to(".popover", { opacity: 0, display: "none" });
			setActiveGarage(null);
			localStorage.setItem("activeGarage", JSON.stringify(null));
			return;
		}
		setActiveGarage(index);
		localStorage.setItem("activeGarage", JSON.stringify(index));
		gsap.to(".popover", {
			opacity: 1,
			display: "block",
			duration: 0.5,
			ease: "power4.inOut"
		});
	};
	const fetchReviews = async (garageId,serviceId) => {
		try{
			const res =await fetch(`http://localhost:5001/api/reviews/garage/${garageId}/service/${serviceId}`);
			const data=await res.json();
			console.log("Reviews fetched",data);
			setSelectedService((prev) =>({
				...prev,
				customerReviews:data.filter(r => r.source === 'customer'),
				teamReviews: data.filter(r => r.source === 'team'),
			})
			);
		}
		catch(err){
			console.error("Error fetching reviews",err);
		}
	};
	// Handles toggling selection of a service
	const handleBookService = () => {
		const exists = selectedServices.some(s => s._id === selectedService._id);
		let updatedServices;

		if (exists) {
			// Deselect the service
			updatedServices = selectedServices.filter(s => s._id !== selectedService._id);
		} else {
			// Select the service and attach the garage info
			const serviceWithGarage = {
				...selectedService,
				garage: garages[activeGarage]
			};
			updatedServices = [...selectedServices, serviceWithGarage];
		}

		setSelectedServices(updatedServices);
		localStorage.setItem("selectedServices", JSON.stringify(updatedServices));

		// No Redux dispatch here; handled per-garage in summary

		setSelectedService(null); // Close modal
	};

	return (
		<section className="w-full h-[90vh] flex">
			{/* Sidebar */}
			<div className="hidden sm:block sm:w-1/3 md:w-1/4 h-full bg-orange-100 relative z-10">
				<div className="m-2 px-2 flex justify-between items-center rounded-md bg-primary-100">
					<input
						type="text"
						value={searchLocation}
						onChange={(e) => setSearchLocation(e.target.value)}
						placeholder="Search Location"
						className="w-full h-14 p-2 rounded-tl-md rounded-bl-md bg-primary-100 focus:outline-none"
					/>
					<button
						className="w-12 flex justify-center items-center"
						onClick={async () => {
							try {
								const res = await fetch(`https://photon.komoot.io/api/?q=${searchLocation}&limit=1`);
								const data = await res.json();
								const coords = data?.features?.[0]?.geometry?.coordinates;
								if (coords) {
									const center = { lat: coords[1], lng: coords[0] };
									setMapCenter(center);
									localStorage.setItem("mapCenter", JSON.stringify(center));
								}
							} catch (err) {
								console.error("Location search failed", err);
							}
						}}
					>
						<FiSearch className="text-xl" />
					</button>
				</div>
				<div className="w-full p-2 pt-0 gap-2 flex justify-center items-center flex-col md:flex-row">
					<button
						className="w-full md:w-1/2 py-3 rounded-md bg-primary-100 flex justify-center items-center gap-2"
						onClick={() => {
							navigator.geolocation.getCurrentPosition(
								(position) => {
									const { latitude, longitude } = position.coords;
									const center = { lat: latitude, lng: longitude };
									setMapCenter(center);
									localStorage.setItem("mapCenter", JSON.stringify(center));
								},
								(err) => {
									console.error("GPS error:", err.message);
								}
							);
						}}
					>
						<span>Use GPS</span>
						<MdGpsFixed />
					</button>
					<div className="w-full md:w-1/2 relative">
					<button
						className="w-full py-3 rounded-md bg-secondary-200 text-white flex justify-center items-center gap-2"
						onClick={() => setShowFilters(!showFilters)}
					>
						<FiFilter />
						Use Filter
					</button>
					
					{showFilters && (
						<div className="absolute top-14 left-0 z-50 bg-white shadow-md rounded-md w-full text-sm">
						{[
							{ label: "Highest Rating", value: "rating" },
							{ label: "Most Services", value: "services" },
							{ label: "Preferred", value: "preferred" },
							{ label: "Most Completed", value: "completed" },
						].map(({ label, value }) => (
							<button
							key={value}
							onClick={() => {
								setGarages(prev =>
								[...prev].sort((a, b) => {
									switch (value) {
									case "rating":
										return (b.ratingsSummary?.customer?.average || 0) - (a.ratingsSummary?.customer?.average || 0);
									case "services":
										return (b.services?.length || 0) - (a.services?.length || 0);
									case "preferred":
										return (b.preferredScore || 0) - (a.preferredScore || 0);
									case "completed":
										return (b.totalCompletedServices || 0) - (a.totalCompletedServices || 0);
									default:
										return 0;
									}
								})
								);
								setShowFilters(false);
							}}
							className="w-full text-left px-4 py-2 hover:bg-gray-100"
							>
							{label}
							</button>
						))}
						</div>
					)}
					</div>
				</div>
				<div className="mt-4 flex flex-col gap-2 px-2 overflow-y-auto h-[calc(100vh-200px)]">
					{garages.map((garage, i) => (
						<Garage
							key={garage._id}
							handleClick={() => handleGarageClick(i)}
							isActive={activeGarage === i}
							garage={garage}
						/>
					))}
				</div>
			</div>

			{/* Map */}
			<div className="w-full sm:w-2/3 md:w-3/4 h-full bg-neutral-600 relative">
				<div className="popover z-[999999] hidden sm:w-2/3 md:w-1/3 h-[95%] p-3 bg-white absolute rounded-md left-4 top-4 opacity-0 overflow-y-scroll">
					<div className="w-full mb-2 flex justify-end">
						<button className="bg-neutral-100 rounded-sm p-1">
							<IoMdClose onClick={() => handleGarageClick(null)} />
						</button>
					</div>
					{activeGarage !== null && (
						<>
							<div className="w-full h-1/3 bg-neutral-400 rounded-md"></div>
							<h1 className="text-3xl mt-4 font-bold">{garages[activeGarage]?.name}</h1>
							<p className="text-sm mt-2 text-neutral-600">
								{garages[activeGarage]?.location?.address}
							</p>
							<h1 className="text-xl mt-6 font-semibold">Services Offered</h1>
							<div className="mt-4 flex flex-col gap-2">
								{garages[activeGarage]?.services.map((s, i) => (
									<Service
										key={i}
										serviceName={s.service?.name}
										rating={Math.round(garages[activeGarage]?.ratingsSummary?.customer?.average || 4)}
										isSelected={selectedServices.some(sel => sel.service._id === s.service._id)}
								onViewDetails={() => {
									setSelectedService(s);
									fetchReviews(garages[activeGarage]._id,s.service._id);
								}}
									/>
								))}
							</div>
						</>
					)}
				</div>

				{/* Selected Services Summary */}
				<div className="absolute right-4 bottom-4 z-[999999] w-80">
					<SelectedServicesSummary
						selectedServices={selectedServices}
						onClear={() => {
							setSelectedServices([]);
							localStorage.setItem("selectedServices", JSON.stringify([]));
							// Removed dispatch as bookings are managed per garage
						}}
					/>
				</div>

				<Map
					activeMarker={activeGarage}
					setGarages={setGarages}
					garages={garages}
					center={mapCenter}
				/>

				{/* Modal for service details */}
				{selectedService && (
					<div className="fixed inset-0 bg-black bg-opacity-40 z-[1000000] flex items-center justify-center">
						<div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-lg z-50">
							<ServiceDetailsModal
								service={selectedService}
								selectedServices={selectedServices}
								allGarages={garages}
								activeGarage={activeGarage}
								setActiveGarage={setActiveGarage}
								selectionHistory={selectionHistory}
								onGoBack={handleGoBack}
								onSelectService={(newService, garageIndex) => {
									const newHistory = [...selectionHistory, { service: selectedService, garageIndex: activeGarage }];
									setSelectionHistory(newHistory);
									localStorage.setItem("selectionHistory", JSON.stringify(newHistory));
									setSelectedService(newService);
									setActiveGarage(garageIndex);
									localStorage.setItem("activeGarage", JSON.stringify(garageIndex));
									fetchReviews(garages[garageIndex]._id, newService.service._id);
								}}
								onClose={() => setSelectedService(null)}
								onBook={handleBookService}
							/>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default ServicesSelection;

// Garage card
export const Garage = ({ handleClick, isActive, garage }) => {
	const arrow = useRef(null);

	useGSAP(() => {
		gsap.to(arrow.current, {
			rotate: isActive ? -90 : 0,
			duration: 0.2,
			ease: "power4.inOut"
		});
	}, [isActive]);

	const rating = garage.ratingsSummary?.customer?.average || 4;

	return (
		<div
			className="garage w-full px-2 py-4 gap-2 flex justify-between items-center hover:bg-orange-200 cursor-pointer"
			onClick={handleClick}
		>
			<div className="w-full flex flex-col">
				<h4 className="font-semibold">{garage.name}</h4>
				<p className="text-sm text-neutral-500">{garage.location.address}</p>
				<div className="flex gap-2 items-center text-neutral-800 text-sm">
					<div>{rating.toFixed(1)}</div>
					<div className="flex">
						{[...Array(5)].map((_, i) =>
							i < Math.round(rating) ? <IoStar key={i} /> : <IoStarOutline key={i} />
						)}
					</div>
					<div>({garage.ratingsSummary?.customer?.totalReviews || 0})</div>
				</div>
			</div>
			<div className="text-neutral-800">
				<button ref={arrow}>
					<FaAngleDown className="text-lg" />
				</button>
			</div>
		</div>
	);
};

export const Service = ({ serviceName = "Service", rating = 4, onViewDetails, isSelected }) => {
  return (
    <div className="w-full p-3 border rounded-md bg-white shadow-sm relative">
      <div className="flex justify-between items-center">
        <h5 className="text-lg font-semibold text-neutral-800">{serviceName}</h5>
        <div className="flex items-center text-neutral-800 gap-2">
          <span>{rating}</span>
          <span className="flex">
            {[...Array(5)].map((_, i) =>
              i < rating ? <IoStar key={i} /> : <IoStarOutline key={i} />
            )}
          </span>
        </div>
      </div>
      <button
        onClick={onViewDetails}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        View Details
      </button>
      {isSelected && (
        <span className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full shadow">
          <FiCheck size={16} />
        </span>
      )}
    </div>
  );
};

// ServiceDetailsModal component
const ServiceDetailsModal = ({
	service,
	selectedServices,
	allGarages = [],
	activeGarage,
	setActiveGarage,
	selectionHistory,
	onGoBack,
	onSelectService,
	onClose,
	onBook
}) => {
	const isSelected = selectedServices?.some(
		s => s.service._id === service.service._id
	);

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white max-w-lg w-full p-6 rounded-md relative max-h-[90vh] overflow-y-auto">
				{selectionHistory.length > 0 && (
					<button
						onClick={onGoBack}
						className="absolute top-3 left-3 text-sm text-blue-600 hover:underline"
					>
						← Back
					</button>
				)}
				<button onClick={onClose} className="absolute top-3 right-3 text-xl text-gray-500">×</button>
				<h2 className="text-2xl font-bold mb-2">{service?.service?.name || "Service Name not available "}</h2>
				<p className="text-sm text-gray-700 mb-4">{service?.description ?? service?.service?.description ?? "N/A"}</p>
				<div className="flex justify-between mb-2 text-sm text-gray-600">
					<span>₹{service?.customPrice ?? service?.service.basePrice ?? "N/A"}</span>
					<span>{service?.durationInMinutes ?? service?.service?.defaultDuration ?? "Unknown"} mins</span>
				</div>

				<h3 className="font-semibold mt-4 mb-1">Customer Reviews</h3>
				{(service.customerReviews || []).map((r, i) => (
					<div key={i} className="mb-2 p-2 border rounded bg-gray-50">
						<div className="flex justify-between text-sm font-medium">
							<span>{r.reviewdBy}</span>
							<span className="flex text-yellow-500">
								{[...Array(5)].map((_, i) => i < r.rating ? <IoStar key={i}/> : <IoStarOutline key={i}/>)}
							</span>
						</div>
						<p className="text-sm text-gray-600">{r.comment}</p>
					</div>
				))}

				<h3 className="font-semibold mt-4 mb-1">Team Reviews</h3>
				{(service.teamReviews || []).map((r, i) => (
					<div key={i} className="mb-2 p-2 border rounded bg-gray-100">
						<div className="flex justify-between text-sm font-medium">
							<span>{r.reviewedBy}</span>
							<span className="flex text-yellow-500">
								{[...Array(5)].map((_, i) => i < r.rating ? <IoStar key={i}/> : <IoStarOutline key={i}/>)}
							</span>
						</div>
						<p className="text-sm text-gray-600">{r.comment}</p>
					</div>
				))}

				<button
					onClick={onBook}
					className={`mt-4 w-full py-3 rounded-md text-sm font-semibold transition-all shadow ${
						isSelected
							? 'bg-green-600 text-white hover:bg-green-700'
							: 'bg-secondary-200 text-white hover:bg-primary-600'
					}`}
				>
					{isSelected ? 'Selected' : 'Select Service'}
				</button>

				<div className="mt-6">
					<h3 className="font-semibold text-lg mb-2">Available in Other Garages</h3>
					{allGarages
						.map((g, idx) => {
							const match = g.services.find(s => s.service._id === service.service._id);
							if (!match || idx === activeGarage) return null;
							const avgRating = g.ratingsSummary?.customer?.average || 0;
							const totalReviews = g.ratingsSummary?.customer?.totalReviews || 0;
							return (
								<div key={g._id} className="border p-3 rounded mt-2 flex justify-between items-center">
									<div>
										<h4 className="font-semibold">{g.name}</h4>
										<p className="text-sm text-gray-500">₹{match.customPrice ?? match.service.basePrice} • ⭐ {avgRating.toFixed(1)} • {totalReviews} reviews</p>
									</div>
									<button
										onClick={() => {
											onSelectService(match, idx);
											setActiveGarage(idx);
										}}
										className="text-blue-600 hover:underline text-sm"
									>
										View in this Garage
									</button>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};

// SelectedServicesSummary component

const SelectedServicesSummary = ({ selectedServices, onClear }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Group services by garage
  const groupedByGarage = selectedServices.reduce((acc, service) => {
    const garageId = service.garage?._id || "unknown";
    if (!acc[garageId]) {
      acc[garageId] = {
        garage: service.garage,
        services: [],
      };
    }
    acc[garageId].services.push(service);
    return acc;
  }, {});

  const handleBookGarage = (garageId) => {
    const group = groupedByGarage[garageId];
    if (group) {
      dispatch(setBookingDetails({
        garage: group.garage,
        services: group.services,
        customer: null,
        bookingTime: null,
      }));
	  setTimeout(() => {
  console.log("Redux state after dispatch:", store.getState().booking);
}, 100);
	  console.log("Dispatching booking:", group);
      navigate(`/confirmBooking`);
    }
  };
  return (
    <div className="w-full p-4 bg-white shadow-md mt-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Selected Services</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>
      {Object.keys(groupedByGarage).length === 0 ? (
        <p className="text-sm text-gray-500">No services selected.</p>
      ) : (
        Object.entries(groupedByGarage).map(([garageId, group]) => (
          <div key={garageId} className="mb-4 border-b pb-2">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-md font-semibold">{group.garage?.name || "Unknown Garage"}</h4>
              <button
                onClick={() => handleBookGarage(garageId)}
                className="px-4 py-2 bg-secondary-200 text-white font-semibold rounded-md text-sm shadow hover:bg-secondary-300 transition-all"
              >
                Book Garage
              </button>
            </div>
            <ul className="text-sm text-gray-700 list-disc ml-5 space-y-1">
              {group.services.map((s, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{s.service?.name}</span>
                  <button
                    onClick={() => {
                      const updated = selectedServices.filter(
                        (item) => item._id !== s._id
                      );
                      localStorage.setItem("selectedServices", JSON.stringify(updated));
                      // Directly update state without full clear or reload
                      const event = new CustomEvent("updateSelectedServices", { detail: updated });
                      window.dispatchEvent(event);
                    }}
                    className="text-xs text-red-500 hover:underline ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};