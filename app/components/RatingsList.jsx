import Rating from "./Rating";

const RatingsList = ({ ratings }) => {
  return (
    <ul>
      {ratings &&
        ratings.map((rating) => <Rating key={rating.id} rating={rating} />)}
    </ul>
  );
};

export default RatingsList;
