"use client";
import AddListRating from "./AddListRating";
import Rating from "./Rating";
import React, { useEffect, useState } from "react";

const RatingsList = (params) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { ListName } = params;

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/lists/${ListName}`,
          {
            credentials: "include",
            next: { revalidate: 0 },
          }
        );
        if (!res.ok) {
          window.location.href = "http://localhost:3000/rate";
        }

        const data = await res.json();
        const { ratings, ...list } = data;
        setRatings(ratings);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchLists();
  }, []);

  return (
    <div className="max-w-4xl mt-4">
      {loading ? (
        <div className=" mx-auto  spinner"></div>
      ) : (
        <div>
          <h1 className="text-3xl font-extrabold">{ListName}</h1>
          <div className="my-5 flex flex-col gap-4">
            <AddListRating listName={ListName} />
          </div>
          <ul>
            {ratings &&
              ratings.map((rating) => (
                <Rating key={rating.id} rating={rating} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RatingsList;
