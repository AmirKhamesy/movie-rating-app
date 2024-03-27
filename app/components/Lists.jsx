"use client";

import moment from "moment";

const navigateToList = (listName) => {
  window.location.href = `/rate/${listName}`;
};

const Lists = async ({ lists, userId }) => {
  const userLists = lists.filter((list) => list.userId === userId);
  const collaboratedLists = lists.filter((list) => list.userId !== userId);

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Your Lists</h2>
        {userLists.map((list) => (
          <div
            key={list.id}
            className="bg-white shadow-md p-4 mb-4 hover:cursor-pointer hover:shadow-lg"
            onClick={() => navigateToList(list.name)}
          >
            <div className="flex justify-between">
              <h3 className=" font-semibold text-gray-800">{list.name}</h3>
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

      {collaboratedLists.length > 0 && (
        <div>
          <hr className="my-8" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Collaborated Lists
          </h2>
          {collaboratedLists.map((list) => (
            <div
              key={list.id}
              className="bg-white shadow-md p-4 mb-4 hover:cursor-pointer hover:shadow-lg"
              onClick={() => navigateToList(`${list.name}/${list.userId}`)}
            >
              <div className="flex justify-between">
                <h3 className=" font-semibold text-gray-800">{list.name}</h3>
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

export default Lists;
