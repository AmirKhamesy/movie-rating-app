"use client";
import { useParams } from "next/navigation";

const RatePage = async () => {
  const params = useParams();
  console.log(params);

  return <div className="max-w-4xl mx-auto mt-4">{JSON.stringify(params)}</div>;
};

export default RatePage;
