"use client";
import AddListRating from "./AddListRating";
import Rating from "./Rating";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ColabRatingsList = ({ ListName, userId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
            //Add rating to list if has more if there is no more pages to fetch
            if (!hasMore) {
              prevRatings.push(rating);
            }
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

  const fetchLists = async (page) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/colab/${userId}/${ListName}?page=${page}`,
        {
          credentials: "include",
          next: { revalidate: 0 },
        }
      );
      if (!res.ok) {
        window.location.href = "/rate";
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
          <a
            className="cursor-pointer text-lg text-blue-600 font-medium"
            href="/rate"
          >
            &lt; BACK TO LISTS
          </a>
          <h1 className="text-3xl my-2 font-extrabold">{ListName}</h1>

          <p className="text-sm text-gray-600">List owner: {list.user.name}</p>
          <div className="my-5 flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <AddListRating
                listName={ListName}
                setRating={setRating}
                userId={userId}
              />
            </div>
          </div>
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
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default ColabRatingsList;
