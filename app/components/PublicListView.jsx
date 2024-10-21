"use client";

import PublicRating from "./PublicRating";
import React, { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterModal from "./FilterModal";
import Link from "next/link";

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-cinema-gold border-t-cinema-gold-dark rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            <Link
              href="/"
              className="inline-block mb-6 text-lg text-cinema-gold font-medium hover:text-cinema-gold-dark transition-colors duration-200"
            >
              &larr; Back to Home
            </Link>
            <div className="bg-cinema-blue-light rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-cinema-gold mb-6">
                {list.name}
              </h1>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <FilterModal filters={filters} setFilters={setFilters} />
                </div>
              </div>
            </div>

            <InfiniteScroll
              dataLength={ratings.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex gap-2 justify-center my-4">
                  <div className="h-5 w-5 bg-cinema-gold rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="h-5 w-5 bg-cinema-gold rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="h-5 w-5 bg-cinema-gold rounded-full animate-pulse"></div>
                </div>
              }
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ratings.map((rating) => (
                  <PublicRating key={rating.id} rating={rating} />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicListView;
