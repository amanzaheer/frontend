import { StarIcon } from "@heroicons/react/24/solid";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((star, index) => {
        const className =
          index < Math.floor(rating) ? "text-yellow-500" : "text-gray-300";
        return <StarIcon key={index} className={"h-5 " + className} />;
      })}
    </div>
  );
};

export default StarRating;
