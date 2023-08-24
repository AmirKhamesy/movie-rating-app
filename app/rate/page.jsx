import AddRating from "../components/AddRating";
import RatingsList from "../components/RatingsList";

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

async function getRatings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/ratings`, {
    next: { revalidate: 0 },
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
