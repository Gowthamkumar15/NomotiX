import React, { useEffect, useState } from "react";
import axios from "axios";

const customerId = "665fabc1234567890abcde01"; // Replace with actual customer ID or pass as prop

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/orders/customer/${customerId}`);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Calculate stats
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const averageCost = bookings.length
    ? Math.round(
        bookings.reduce((sum, b) => sum + (b.bill?.total || 0), 0) / bookings.length
      )
    : 0;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fbfaf9] font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl sm:text-3xl font-bold leading-tight">My Bookings</p>
            <p className="text-sm sm:text-base text-[#8c735a]">
              {pendingBookings.length} upcoming bookings | Total: {bookings.length} Bookings | Avg. Cost: ₹{averageCost}
            </p>
          </div>
          <button className="h-8 px-4 rounded-full bg-[#f1ede9] text-sm font-medium whitespace-nowrap text-ellipsis overflow-hidden">Book New Service</button>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 border-b border-[#e3dbd3] pb-3">
          {["pending", "in-progress", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm sm:text-base font-bold ${
                activeTab === tab
                  ? "border-b-[3px] border-[#f3e5d7] text-[#191410]"
                  : "text-[#8c735a]"
              }`}
            >
              {tab === "pending"
                ? "Requested"
                : tab === "in-progress"
                ? "Ongoing"
                : "Completed"}
            </button>
          ))}
        </div>

        <div className="pt-4 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-[#191410] mb-2">
            {activeTab === "pending"
              ? "Requested Bookings"
              : activeTab === "in-progress"
              ? "Ongoing Bookings"
              : "Completed Bookings"}
          </h3>
          {bookings.filter((b) => b.status === activeTab).length === 0 ? (
            <p className="text-sm sm:text-base text-[#8c735a]">No bookings found.</p>
          ) : (
            bookings
              .filter((b) => b.status === activeTab)
              .map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-3 rounded-xl bg-[#fbfaf9] p-3 shadow"
                >
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm sm:text-base text-[#8c735a]">
                        Appointment: {new Date(b.scheduledAt).toLocaleString()}
                      </p>
                      <p className="text-base font-bold text-[#191410]">
                        {b.garage?.name || "Garage N/A"}
                      </p>
                      <p className="text-sm sm:text-base text-[#8c735a]">
                        {b.breakdownDetails?.location?.address ||
                          "Address not available"}
                      </p>
                      <p className="text-sm sm:text-base text-[#8c735a]">
                        Services: {b.services?.join(", ") || "N/A"}
                      </p>
                      <p className="text-sm sm:text-base text-[#8c735a]">
                        Cost: ₹{b.bill?.total ?? "N/A"}
                      </p>
                      <p className="text-sm sm:text-base text-[#8c735a]">
                        Created At: {new Date(b.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button className="w-fit h-7 px-4 rounded-full bg-[#f1ede9] text-sm text-[#191410] font-medium capitalize whitespace-nowrap">
                      {activeTab}
                    </button>
                  </div>
                  <div
                    className="w-full aspect-video min-h-[140px] sm:min-h-[120px] bg-cover bg-center rounded-xl flex-1"
                    style={{
                      backgroundImage: `url(https://source.unsplash.com/featured/?garage,mechanic,car${i})`,
                    }}
                  ></div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
