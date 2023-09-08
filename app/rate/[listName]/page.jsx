"use client";
import AddListRating from "@/app/components/AddListRating";
import RatingsList from "@/app/components/RatingsList";
import { useParams } from "next/navigation";

const RatePage = async () => {
  const params = useParams();
  const { listName } = params;
  return (
    <div className="max-w-4xl mx-auto mt-4">
      {JSON.stringify(params)}

      <div className="my-5 flex flex-col gap-4">
        <AddListRating listName={listName} />
      </div>

      <RatingsList ListName={listName} />
    </div>
  );
};

export default RatePage;
