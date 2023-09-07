import AddRating from "../components/AddRating";
import RatingsList from "../components/RatingsList";
import { cookies } from "next/headers";
import moment from "moment";
import AddList from "../components/AddList";

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
      <div className="my-5">
        <AddList />
      </div>
      {lists &&
        lists.map((list) => (
          <div key={list.id} className="bg-white shadow-lg rounded-lg p-4 mb-4">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">
                {list.name}
              </h1>
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-600">
                  {list.RatingsCount ? list.RatingsCount : "No"} Rating
                  {list.RatingsCount !== 1 && "s"}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated {moment(list.updatedAt).fromNow()}
                </p>
              </div>
            </div>
          </div>
        ))}
      {/* <div className="my-5 flex flex-col gap-4">
        <AddRating />
      </div>

      <RatingsList ratings={ratings} /> */}
    </div>
  );
};

export default RatePage;
