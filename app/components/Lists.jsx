"use client";

import moment from "moment";

const navigateToList = (listName) => {
  window.location.href = `/rate/${listName}`;
};

const Lists = ({ lists }) => {
  return (
    <div>
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
  );
};

export default Lists;
