import Rating from "./Rating";
import React, { useEffect, useState } from "react";

const RatingsList = ({ ListName }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/lists/${ListName}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to get lists");
        }

        const data = await res.json();
        const { ratings, ...list } = data;
        setRatings(ratings);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLists();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="m-auto spinner"></div>
      ) : (
        <ul>
          {ratings &&
            ratings.map((rating) => <Rating key={rating.id} rating={rating} />)}
        </ul>
      )}
    </div>
  );
};

export default RatingsList;
