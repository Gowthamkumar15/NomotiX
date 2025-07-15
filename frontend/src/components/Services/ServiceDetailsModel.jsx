import { IoStar, IoStarOutline } from "react-icons/io5";

const ReviewCard = ({ review, team }) => (
  <div className="mb-3 p-3 border rounded bg-gray-50">
    <div className="flex justify-between items-center">
      <span className="font-semibold text-sm">{team ? "OGExpress Team" : review.customerName}</span>
      <span className="flex text-yellow-500">
        {[...Array(5)].map((_, i) =>
          i < review.rating ? <IoStar key={i} /> : <IoStarOutline key={i} />
        )}
      </span>
    </div>
    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
  </div>
);

const ServiceDetailsModal = ({ service, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white max-w-lg w-full rounded-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 text-xl">×</button>
        <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
        <p className="text-sm text-gray-700 mb-4">{service.description}</p>

        <div className="flex justify-between mb-4 text-sm text-gray-600">
          <span>₹{service.customPrice}</span>
          <span>{service.durationInMinutes} mins</span>
        </div>

        <h3 className="text-lg font-semibold mb-1">Customer Reviews</h3>
        {service.customerReviews?.length ? (
          service.customerReviews.map((rev, i) => (
            <ReviewCard key={i} review={rev} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No customer reviews.</p>
        )}

        <h3 className="text-lg font-semibold mt-4 mb-1">OGExpress Team Reviews</h3>
        {service.teamReviews?.length ? (
          service.teamReviews.map((rev, i) => (
            <ReviewCard key={i} review={rev} team />
          ))
        ) : (
          <p className="text-sm text-gray-500">No team reviews.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsModal;