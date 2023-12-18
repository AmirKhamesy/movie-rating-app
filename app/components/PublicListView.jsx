"use client";

import PublicRating from "./PublicRating";
import React, { useEffect, useState } from "react";

const PublicListView = (params) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});

  const { hash } = params;

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/publicList/${hash}`,
          {
            credentials: "include",
            next: { revalidate: 0 },
          }
        );
        if (!res.ok) {
          window.location.href = "/";
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
          <h1 className="text-3xl my-2 font-extrabold">{list.name}</h1>
          <div className="my-5 flex flex-col gap-4"></div>
          <ul>
            {ratings &&
              ratings.map((rating, idx) => (
                <PublicRating key={rating.id} rating={rating} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PublicListView;
