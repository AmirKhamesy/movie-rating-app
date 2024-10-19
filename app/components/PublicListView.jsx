"use client";

import PublicRating from "./PublicRating";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const PublicListView = (params) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { hash } = params;

  const fetchLists = async (page) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/publicList/${hash}?page=${page}`,
        {
          credentials: "include",
          next: { revalidate: 0 },
        }
      );
      if (!res.ok) {
        window.location.href = "/";
      }

      const data = await res.json();
      const { remainingPages } = data;
      const { ratings: fetchedRatings, ...listData } = data.ratings;

      if (remainingPages === 0) {
        setHasMore(false);
      }
      setList(listData);
      setRatings((prevRatings) => {
        const uniqueRatings = new Set([...prevRatings, ...fetchedRatings]);
        return [...uniqueRatings];
      });
      setLoading(false);
      setCurrentPage(page + 1);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchLists(1);
  }, []);

  const fetchMoreData = () => {
    fetchLists(currentPage);
  };

  return (
    <div className="max-w-4xl mt-4">
      {loading ? (
        <div className=" mx-auto  spinner"></div>
      ) : (
        <div>
          <h1 className="text-3xl my-2 font-extrabold">{list.name}</h1>
          <div className="my-5 flex flex-col gap-4"></div>
          <ul>
            <InfiniteScroll
              dataLength={ratings.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex gap-2 justify-center">
                  <div className="h-5 w-5 bg-gray-600 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="h-5 w-5 bg-gray-600 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="h-5 w-5 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              }
            >
              {ratings &&
                ratings.map((rating, idx) => (
                  <PublicRating key={rating.id} rating={rating} />
                ))}
            </InfiniteScroll>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PublicListView;
