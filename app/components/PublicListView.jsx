"use client";

import PublicRating from "./PublicRating";
import React, { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import FilterModal from "./FilterModal";

const PublicListView = ({ hash }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    scary: "",
    story: "",
    acting: "",
    sort: "newest",
    search: "",
  });

  const fetchLists = useCallback(
    async (page) => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          ...filters,
        }).toString();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/publicList/${hash}?${queryParams}`,
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
          if (page === 1) {
            return fetchedRatings;
          } else {
            const newRatings = [...prevRatings];
            fetchedRatings.forEach((rating) => {
              if (!newRatings.some((r) => r.id === rating.id)) {
                newRatings.push(rating);
              }
            });
            return newRatings;
          }
        });
        setLoading(false);
        setCurrentPage(page + 1);
      } catch (error) {
        setLoading(false);
      }
    },
    [hash, filters]
  );

  useEffect(() => {
    setRatings([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchLists(1);
  }, [filters, fetchLists]);

  const fetchMoreData = () => {
    if (hasMore) {
      fetchLists(currentPage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      {loading ? (
        <div className="mx-auto spinner"></div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{list.name}</h1>
          <div className="mb-4">
            <FilterModal filters={filters} setFilters={setFilters} />
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <InfiniteScroll
              dataLength={ratings.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex gap-2 justify-center py-4">
                  <div className="h-5 w-5 bg-gray-600 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="h-5 w-5 bg-gray-600 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="h-5 w-5 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              }
            >
              {ratings &&
                ratings.map((rating) => (
                  <PublicRating key={rating.id} rating={rating} />
                ))}
            </InfiniteScroll>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PublicListView;
