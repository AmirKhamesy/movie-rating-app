"use client";
import AddListRating from "./AddListRating";
import EditList from "./EditList";
import Rating from "./Rating";
import React, { useEffect, useState } from "react";

const ColabRatingsList = ({ ListName, userId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});

  const setRating = (rating, idx) => {
    setRatings((prevRatings) => {
      if (!rating) {
        prevRatings.splice(idx, 1);
      } else {
        if (idx === undefined || idx === null) {
          const existingIndex = prevRatings.findIndex(
            (oldRating) => oldRating.title === rating.title
          );

          if (existingIndex === -1) {
            prevRatings.push(rating);
          } else {
            prevRatings = prevRatings.map((oldRating) =>
              oldRating.title === rating.title ? rating : oldRating
            );
          }
        } else {
          prevRatings[idx] = rating;
        }
      }
      return prevRatings;
    });
  };

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/colab/${userId}/${ListName}`,
          {
            credentials: "include",
            next: { revalidate: 0 },
          }
        );
        if (!res.ok) {
          window.location.href = "/rate";
        }

        const data = await res.json();
        const { ratings, ...listData } = data;
        setList(listData);
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
          <a
            className="cursor-pointer text-lg text-blue-600 font-medium"
            href="/rate"
          >
            &lt; BACK TO LISTS
          </a>
          <h1 className="text-3xl my-2 font-extrabold">{ListName}</h1>
          <div className="my-5 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <AddListRating
                listName={ListName}
                setRating={setRating}
                userId={userId}
              />
            </div>
          </div>
          <ul>
            {ratings &&
              ratings.map((rating, idx) => (
                <Rating
                  key={rating.id}
                  idx={idx}
                  rating={rating}
                  setRating={setRating}
                />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColabRatingsList;
