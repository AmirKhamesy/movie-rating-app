"use client";

import React, { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import AddList from "../components/AddList";

const RatePage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { push } = useRouter();

  useEffect(() => {
    async function fetchLists() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/lists`, {
          credentials: "include",
          headers: { Cookie: document.cookie }, // Send cookies to server
        });

        if (!res.ok) {
          throw new Error("Failed to get lists");
        }

        const data = await res.json();
        setLists(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLists();
  }, []);

  const navigateToList = (listName) => {
    push(`/rate/${listName}`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-4">
      {loading ? (
        <div className="m-auto spinner"></div>
      ) : (
        <div>
          <div className="my-5">
            <AddList />
          </div>
          {lists &&
            lists.map((list) => (
              <div
                key={list.id}
                className="bg-white shadow-md rounded-lg p-4 mb-4 hover:cursor-pointer hover:shadow-lg"
                onClick={() => navigateToList(list.name)}
              >
                <div className="flex justify-between">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {list.name}
                  </h1>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-600">
                      {list.RatingsCount ? list.RatingsCount : "No"} Rating
                      {list.RatingsCount !== 1 && "s"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last updated {moment(list.updatedAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RatePage;
