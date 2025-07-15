import { IoStar, IoStarOutline } from "react-icons/io5";

const ServiceCard = ({
  service,
  selected,
  onSelect,
  onViewDetails,
}) => {
  const { name, customPrice, durationInMinutes, rating = 4 } = service;

  return (
    <div
      className={`p-4 border rounded-md shadow-sm cursor-pointer transition-all duration-200 ${
        selected ? "border-orange-500 bg-orange-100" : "bg-white"
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{name}</h4>
        <span className="text-sm text-neutral-600">₹{customPrice}</span>
      </div>

      <div className="flex justify-between text-sm mt-2 text-neutral-600">
        <span>{durationInMinutes} mins</span>
        <span className="flex gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) =>
            i < Math.round(rating) ? <IoStar key={i} /> : <IoStarOutline key={i} />
          )}
        </span>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent selection toggle
            onViewDetails();
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;