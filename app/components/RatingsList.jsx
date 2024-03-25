import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AddListRating from "./AddListRating";
import EditList from "./EditList";
import Rating from "./Rating";

const RatingsList = (params) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
            // prevRatings.push(rating);
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

  const fetchLists = async (page) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/lists/${ListName}?page=${page}`,
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

      if (remainingPages === 0) {
        setHasMore(false);
      }

      setCollaborators(collaborators);
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
        <div className="mx-auto spinner"></div>
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
              {ratings.map((rating, idx) => (
                <Rating
                  key={rating.id}
                  idx={idx}
                  rating={rating}
                  setRating={setRating}
                />
              ))}
            </InfiniteScroll>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RatingsList;
