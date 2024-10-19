"use client";
import RatingsList from "@/app/components/RatingsList";
import { useParams } from "next/navigation";

const RatePage = () => {
  const params = useParams();
  const { listName } = params;
  return <RatingsList ListName={decodeURIComponent(listName)} />;
};

export default RatePage;

