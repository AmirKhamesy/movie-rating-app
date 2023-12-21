"use client";
import ColabRatingsList from "@/app/components/ColabRatingsList";
import { useParams } from "next/navigation";

const RatePage = () => {
  const params = useParams();
  const { listName, userId } = params;
  return (
    <ColabRatingsList ListName={decodeURIComponent(listName)} userId={userId} />
  );
};

export default RatePage;
