import AddRating from "../components/AddRating";
import RatingsList from "../components/RatingsList";

async function getRatings() {
  const res = await fetch("http://localhost:3000/api/ratings", {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to get ratings");
  }

  return res.json();
}

const RatePage = async () => {
  const ratings = await getRatings();

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <div className="my-5 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Rating page</h1>
        <AddRating />
      </div>

      <RatingsList ratings={ratings} />
    </div>
  );
};

export default RatePage;
