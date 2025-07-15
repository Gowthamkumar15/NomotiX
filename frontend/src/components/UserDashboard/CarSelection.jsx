import React, { useState, useEffect } from "react";
import axios from "axios";
import  AddCar  from "./addCar";
import { useNavigate } from "react-router-dom"; // Uncomment if you need navigation
import api from "../../api"; // Adjust the import path as needed
const CarSelection = () => {
  const [cars, setCars] = useState([]); // Start with empty array
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Log the token for debugging
        if (!token) {
          console.log("No token found, redirecting to login");
          console.error("No token found, redirecting to login");
        };
        const res = await api.get(`/users/cars`, {
          headers: {
            Authorization: `Bearer ${token}` ,
          },
          withCredentials: true, // Ensure cookies are sent with the request
        });
        console.log("Fetched cars:", res.data);
        if (Array.isArray(res.data)) {
          setCars(res.data);
        } else {
          setCars([]); // Fallback to empty array if data is not an array
        }
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setCars([]); // Fallback to empty array on error
      }
    };
    fetchCars();
  }, []);

  const handleAddCarSubmit = async (newCarData) => {
    try {
      const res = await axios.post('/api/cars', newCarData);
      setCars((prev) => [...prev, res.data]);
      // setShowAddCarForm(false);
    } catch (err) {
      console.error("Failed to add car:", err);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-secondary-200 px-8 py-12 text-white font-['Plus_Jakarta_Sans']">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Choose Your Car</h2>

        {cars.length === 0 ? (
          <div className="flex flex-col items-center gap-6 mt-12">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-xl aspect-video w-full max-w-[400px]"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuATubp8TUo33XqwGGe1szuNRd9k52FqECwfa2kvdanEOmJe1GKxCuhfXek3giupDaHXTQoCE2Sn0k-HjPCkXRWvQFp-u0hPMbRaEllv41NI1D7SO0JEtZujD7p69KRb3YOZGNc-CDdBzYpe5ylAI5ylMunnx0RwUt_RvZo5-34OyUxr0kSDzwQckRCJbAtBZBX-ebb2t6rHQzz3dcwWYgcgIeETjmQWdxzMtFiqfmXPQIING1ER8BYwvngdWhMd8vSQGu6sbe4suoPJ")',
              }}
            />
            <p className="text-lg font-bold">No cars added yet</p>
            <p className="text-sm text-[#99a0c2] text-center">Add your first car to start enjoying our services.</p>
            <button
              onClick={() => navigate('/addcar')}
              className="bg-[#282d43] text-white text-sm font-bold py-2 px-6 rounded-full"
            >
              Add Car
            </button>
          </div>
        ) : cars.length === 1 ? (
          <div className="flex justify-center">
            <div
              className={`flex flex-col gap-3 text-center p-4 rounded-lg border aspect-video max-w-[400px] w-full ${
                selectedCar === cars[0]._id ? "border-[#cdd4f3]" : "border-transparent"
              } hover:border-[#cdd4f3] transition`}
              onClick={() => {
                setSelectedCar(cars[0]._id);
                localStorage.setItem("selectedCar", JSON.stringify(cars[0]));
                navigate("/services");
              }}
            >
              <img
                src={`https://via.placeholder.com/150x100?text=${cars[0].model}`}
                alt={cars[0].model}
                onError={(e) => {
                  if (!e.target.dataset.fallback) {
                    e.target.dataset.fallback = true;
                    e.target.src = '/fallback-car.png';
                  }
                }}
                className="w-full h-full object-cover rounded-xl"
              />
              <div>
                <p className="text-base font-medium">{cars[0].model}</p>
                <p className="text-sm text-[#99a0c2]">Registration: {cars[0].licensePlate}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
          <div className="flex justify-center">
            {cars.length === 1 ? (
              <div
                className={`flex flex-col gap-3 text-center p-4 rounded-lg border ${
                  selectedCar === cars[0]._id ? "border-[#cdd4f3]" : "border-transparent"
                } hover:border-[#cdd4f3] transition w-full max-w-2xl h-[200px]`}
                onClick={() => {
                  setSelectedCar(cars[0]._id);
                  localStorage.setItem("selectedCar", JSON.stringify(cars[0]));
                  navigate("/services");
                }}
              >
                <img
                  src={`https://via.placeholder.com/150x100?text=${cars[0].model}`}
                  alt={cars[0].model}
                  onError={(e) => {
                    if (!e.target.dataset.fallback) {
                      e.target.dataset.fallback = true;
                      e.target.src = '/fallback-car.png';
                    }
                  }}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div>
                  <p className="text-base font-medium">{cars[0].model}</p>
                  <p className="text-sm text-[#99a0c2]">Registration: {cars[0].licensePlate}</p>
                </div>
              </div>
            ) : (
              <div
                className={`${
                  cars.length === 2
                    ? "flex justify-between gap-8 px-10"
                    : cars.length === 3
                    ? "grid-cols-3 gap-4 justify-center"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                } w-full px-4 ${cars.length === 2 ? "" : "grid"}`}
              >
                {Array.isArray(cars) && cars.map((car) => (
                  <div
                    key={car._id}
                    className={`flex flex-col gap-3 text-center p-2 rounded-lg border ${
                      selectedCar === car._id ? "border-[#cdd4f3]" : "border-transparent"
                    } hover:border-[#cdd4f3] transition aspect-square w-full max-w-xs ${cars.length === 2 ? "max-w-sm" : ""}`}
                    onClick={() => {
                      setSelectedCar(car._id);
                      localStorage.setItem("selectedCar", JSON.stringify(car));
                      navigate("/services");
                    }}
                  >
                    <img
                      src={`https://via.placeholder.com/150x100?text=${car.model}`}
                      alt={car.model}
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.dataset.fallback = true;
                          e.target.src = '/car.png';
                        }
                      }}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div>
                      <p className="text-base font-medium">{car.model}</p>
                      <p className="text-sm text-[#99a0c2]">Registration: {car.licensePlate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>

            {cars.length > 0 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/addcar')}
                  className="flex items-center gap-2 justify-center bg-[#cdd4f3] text-[#131520] font-bold px-6 py-2 rounded-full hover:bg-[#b5c2e8] transition"
                >
                  Add Car
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default CarSelection;