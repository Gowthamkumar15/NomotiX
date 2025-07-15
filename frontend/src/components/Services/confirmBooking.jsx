// ConfirmBooking.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setBookingDetails } from "../../redux/bookingSlice"; // adjust path as needed
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ConfirmBooking = () => {
  const params = useParams();
  const booking = useSelector(state => state.booking);
  console.log("Booking details from Redux in confirm booking:", booking);
  const dispatch = useDispatch();
  // Restore booking from localStorage if not present in Redux
  useEffect(() => {
    if (!booking || !booking.garage) {
      const stored = localStorage.getItem("bookingData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          dispatch(setBookingDetails({
            garage: parsed.garage,
            services: parsed.services,
            customer: null,
            bookingTime: null
          }));
        } catch (err) {
          console.error("Failed to restore booking from localStorage", err);
        }
      }
    }
  }, [booking]);
  if (!booking || !booking.garage) {
    return <div className="p-4 text-center">Loading booking details...</div>;
  }
  const garageId = booking.garage?._id || params.garageId;
  const navigate = useNavigate();

  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [status, setStatus] = useState("idle"); // idle, requesting, waiting, confirmed, rejected

  useEffect(() => {
    // Fetch time slots from backend for the selected garage
    const fetchSlots = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/garages/${garageId}/slots`);
        const data = await res.json();
        setAvailableSlots(data);
        if (data.length > 0 && !selectedTime) {
          setSelectedTime(new Date(data[0]));
        } else if (data.length === 0 && !selectedTime) {
          const fallbackTime = new Date();
          fallbackTime.setMinutes(fallbackTime.getMinutes() + 30); // fallback: 30 min later
          setAvailableSlots([fallbackTime.toISOString()]);
          setSelectedTime(fallbackTime);
        }
      } catch (err) {
        console.error("Failed to fetch slots", err);
        if (!selectedTime) {
          const fallbackTime = new Date();
          fallbackTime.setMinutes(fallbackTime.getMinutes() + 30); // fallback: 30 min later
          setAvailableSlots([fallbackTime.toISOString()]);
          setSelectedTime(fallbackTime);
        }
      }
    };

    if (garageId) {
      fetchSlots();
    }
  }, [garageId]);
  const totalCost = booking.services.reduce(
    (sum, s) => sum + (s.service?.basePrice || s.customPrice || 0),
    0
  );

  const handleConfirm = async () => {
    if (!selectedTime) return alert("Please select a time slot.");

    setStatus("requesting");

    try {
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Customer: booking.customer?._id || "665fabc1234567890abcde01",
          serviceType: "normal",
          services: booking.services.map(s => s.service.name),
          garage: garageId,
          scheduledAt: selectedTime.toISOString(),
          bill: {
            total: totalCost,
            breakdown: booking.services.map(s => ({
              Service: s.service.name,
              Cost: s.service.basePrice || s.customPrice || 0,
            })),
            paid: false,
          },
        })
      });

      const data = await res.json();

      if (data._id) {
        dispatch(setBookingDetails({
          ...booking,
          bookingTime: selectedTime.toISOString()
        }));
        setStatus("confirmed");
        // navigate(`/bookings/`);
      } else {
        console.error("Error creating booking:", data);
        alert("Booking failed.");
        setStatus("idle");
      }
    } catch (err) {
      console.error("Booking failed", err);
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf8] font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <div className="px-40 py-10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center pb-5">Confirm Booking</h2>

        {/* Garage Details */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold">{booking.garage.name}</h3>
            <p className="text-[#9c7349]">{booking.garage.location?.address}</p>
          </div>
          <div className="w-48 h-28 bg-cover bg-center rounded-xl border border-gray-300"  style={{
            backgroundImage: `url("/Users/mohnish/OG/frontend/public/car.png")`,
          }} />
        </div>

        {/* Services List */}
        <h3 className="text-lg font-bold pt-4 pb-2">Selected Services</h3>
        {booking.services.map((s, i) => (
          <div key={i} className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 border rounded mb-2">
            <div className="text-[#1c140d] bg-[#f4ede7] size-12 rounded-lg flex justify-center items-center">
              🛠️
            </div>
            <div className="flex flex-col">
              <p className="font-medium">₹{s.service?.basePrice || s.customPrice}</p>
              <p className="text-[#9c7349]">{s.service?.name}</p>
            </div>
          </div>
        ))}

        {/* Time Slot */}
        <h3 className="text-lg font-bold pt-4 pb-2">Appointment Time</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSelectedTime(new Date(slot))}
              className={`px-4 py-2 rounded-full border ${
                selectedTime?.toISOString() === new Date(slot).toISOString()
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {new Date(slot).toLocaleString()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 border rounded">
          <div className="text-[#1c140d] bg-[#f4ede7] size-10 rounded-lg flex justify-center items-center">
            ⏰
          </div>
          <p>{selectedTime ? new Date(selectedTime).toLocaleString() : "Not Selected"}</p>
        </div>

        {/* Cost Summary */}
        <h3 className="text-lg font-bold pt-4 pb-2">Total</h3>
        <div className="flex items-center gap-4 bg-[#fcfaf8] px-4 py-2 border rounded">
          <div className="text-[#1c140d] bg-[#f4ede7] size-12 rounded-lg flex justify-center items-center">
            💰
          </div>
          <div className="flex flex-col">
            <p className="text-base font-medium">₹{totalCost}</p>
            <p className="text-[#9c7349] text-sm">Including all selected services</p>
          </div>
        </div>

        {/* Mechanic Response Awaiting */}
        {booking.bookingTime &&(<div className="mt-6 p-6 bg-gradient-to-t from-black/80 to-black/20 text-white rounded-xl"
     style={{
       backgroundImage:
         'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(https://source.unsplash.com/mechanic)',
       backgroundSize: 'cover',
       backgroundPosition: 'center',
     }}>
  <h3 className="text-xl font-bold">Booking Awaiting Confirmation</h3>
  <p className="text-sm">Your booking is awaiting confirmation from the mechanic. We’ll notify you once it’s accepted.</p>
</div>)}

        
        {/* Back Button */}
        <div className="mt-6 grid grid-cols-2 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-[#f4ede7] text-[#1c140d] font-bold py-2 px-6 rounded-full hover:bg-[#e5dbd0] transition"
          >
            Go Back
          </button>
        
        {/* Book Now Button */}
        
          <button
            onClick={handleConfirm}
            disabled={!!booking.bookingTime || status === "confirmed" || status === "booked"}
            className={`${
              !!booking.bookingTime || status === "confirmed" || status === "booked"
                ? "bg-secondary-400 cursor-not-allowed"
                : "bg-secondary-200 hover:bg-secondary-300"
            } text-white font-bold py-2 px-6 rounded-full transition`}
          >
            {!!booking.bookingTime || status === "confirmed" || status === "booked" ? "Booked" : "Book Now"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmBooking;