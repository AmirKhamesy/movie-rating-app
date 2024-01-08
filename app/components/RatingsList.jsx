"use client";
import AddListRating from "./AddListRating";
import EditList from "./EditList";
import Rating from "./Rating";
import React, { useEffect, useState } from "react";

const RatingsList = (params) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [collaborators, setCollaborators] = useState([]);

  const { ListName } = params;

  const setRating = (rating, idx) => {
    setRatings((prevRatings) => {
      if (rating === null) {
        delete prevRatings[idx];
      } else {
        if (idx === undefined || idx === null) {
          const existingIndex = prevRatings.findIndex(
            (oldRating) => oldRating.id === rating.id
          );

          if (existingIndex === -1) {
            prevRatings.push(rating);
          } else {
            prevRatings = prevRatings.map((oldRating) =>
              oldRating.id === rating.id ? rating : oldRating
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
          `${process.env.NEXT_PUBLIC_API}/api/lists/${ListName}`,
          {
            credentials: "include",
            next: { revalidate: 0 },
          }
        );
        if (!res.ok) {
          window.location.href = "/rate";
        }

        const data = await res.json();
        const { ratings, collaborators, ...listData } = data;
        setCollaborators(collaborators);
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
              <AddListRating listName={ListName} setRating={setRating} />
              <EditList
                listName={ListName}
                publicHash={list.publicHash}
                listPublic={list.public}
                listId={list.id}
                setList={setList}
                collaborators={collaborators}
                setCollaborators={setCollaborators}
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

export default RatingsList;
