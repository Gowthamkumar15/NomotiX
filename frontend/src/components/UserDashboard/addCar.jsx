import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../api";
import axios from "axios";
const AddCar = () => {
    const [formData, setFormData] = useState({
        customName: "",
        make: "",
        model: "",
        year: "",
        color: "",
        licensePlate: "",
    });
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const carData = {
      Maruti: ["Swift", "Baleno", "Dzire", "WagonR", "Alto"],
      Hyundai: ["i20", "Creta", "Venue", "Verna"],
      Honda: ["City", "Amaze", "Jazz"],
      Tata: ["Nexon", "Punch", "Harrier"],
    };
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
        await api.post("/users/car/", formData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        });
        alert("Car added successfully!");
        navigate("/"); // Redirect to dashboard or another page
        } catch (error) {
        console.error("Error adding car:", error);
        alert("Failed to add car. Please try again.");
        }
    };
    
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white p-6 shadow-lg overflow-y-auto h-screen">
          <h2 className="text-xl font-bold mb-4">Car Models</h2>
          <label className="block font-semibold mb-2">Choose Brand</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setFormData({ ...formData, make: e.target.value, model: "" });
              setSelectedModel("");
            }}
          >
            <option value="">Select a brand</option>
            {Object.keys(carData).map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {selectedBrand && (
            <>
              <label className="block font-semibold mt-4 mb-2">Choose Model</label>
              <div className="grid grid-cols-1 gap-4 overflow-y-auto">
                {carData[selectedBrand].map((model) => (
                  <div
                    key={model}
                    className={`cursor-pointer border rounded-lg p-3 shadow-md text-center ${
                      selectedModel === model ? 'border-blue-600' : 'border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedModel(model);
                      setFormData({
                        ...formData,
                        model
                      });
                    }}
                  >
                    <img
                      src={`https://via.placeholder.com/100x60?text=${encodeURIComponent(model)}`}
                      alt={model}
                      className="mx-auto mb-2"
                    />
                    <span className="font-medium">{model}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Your Car</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Custom Name"
                name="customName"
                type="text"
                value={formData.customName}
                onChange={handleChange}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
              />
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="License Plate"
                name="licensePlate"
                type="text"
                value={formData.licensePlate}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 font-semibold text-base"
              >
                Add Car
              </button>
            </form>
            <p className="text-center text-sm mt-6">
              Already have a car? <a href="/" className="text-blue-600 hover:underline">Go to Dashboard</a>
            </p>
          </div>
        </div>
      </div>
    );
};  

export default AddCar;