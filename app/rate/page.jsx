import AddRating from "../components/AddRating";
import RatingsList from "../components/RatingsList";
import { cookies } from "next/headers";

async function getLists() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/lists`, {
    next: { revalidate: 0 },
    credentials: "include",
    headers: { Cookie: cookies().toString() }, //HACK: Send cookies to server
  });

  if (!res.ok) {
    throw new Error("Failed to get ratings");
  }

  return res.json();
}

const RatePage = async () => {
  const lists = await getLists();

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <p>{JSON.stringify(lists)}</p>
      {/* <div className="my-5 flex flex-col gap-4">
        <AddRating />
      </div>

      <RatingsList ratings={ratings} /> */}
    </div>
  );
};

export default RatePage;
