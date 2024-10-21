import React, { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AddListRating from "./AddListRating";
import EditList from "./EditList";
import Rating from "./Rating";
import FilterModal from "./FilterModal";
import Link from "next/link";

const RatingsList = (params) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    scary: "",
    story: "",
    acting: "",
    sort: "newest",
    search: "",
  });

  const { ListName } = params;

  const setRating = useCallback(
    (rating, idx) => {
      setRatings((prevRatings) => {
        const newRatings = [...prevRatings];
        if (rating === null) {
          newRatings.splice(idx, 1);
        } else {
          if (idx === undefined || idx === null) {
            const existingIndex = newRatings.findIndex(
              (oldRating) => oldRating.id === rating.id
            );
            if (existingIndex === -1) {
              if (!hasMore) {
                newRatings.push(rating);
              }
            } else {
              newRatings[existingIndex] = rating;
            }
          } else {
            newRatings[idx] = rating;
          }
        }
        return newRatings;
      });
    },
    [hasMore]
  );

  const fetchLists = useCallback(
    async (page) => {
      try {
        const queryParams = new URLSearchParams({
          page,
          ...filters,
        }).toString();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/lists/${ListName}?${queryParams}`,
          {
            credentials: "include",
            next: { revalidate: 0 },
          }
        );
        if (!res.ok) {
          window.location.href = "/rate";
        }

        const data = await res.json();
        const {
          ratings: fetchedRatings,
          collaborators,
          ...listData
        } = data.ratings;

        const { remainingPages } = data;

        setHasMore(remainingPages > 0);
        setCollaborators(collaborators);
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
        console.error("Error fetching lists:", error);
        setLoading(false);
      }
    },
    [ListName, filters]
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
              href="/rate"
              className="inline-block mb-6 text-lg text-cinema-gold font-medium hover:text-cinema-gold-dark transition-colors duration-200"
            >
              &larr; Back to Lists
            </Link>
            <div className="bg-cinema-blue-light rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-cinema-gold mb-6">
                {ListName}
              </h1>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <AddListRating listName={ListName} setRating={setRating} />
                <div className="flex flex-wrap gap-2">
                  <FilterModal filters={filters} setFilters={setFilters} />
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
                {ratings.map((rating, idx) => (
                  <Rating
                    key={rating.id}
                    idx={idx}
                    rating={rating}
                    setRating={setRating}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsList;
