"use client";

import { useState } from "react";
import moment from "moment";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Lists = ({ lists, userId }) => {
  const userLists = lists.filter((list) => list.userId === userId);
  const collaboratedLists = lists.filter((list) => list.userId !== userId);

  const ListItem = ({ list, isCollaborated = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Link
          href={
            isCollaborated
              ? `/rate/${list.name}/${list.userId}`
              : `/rate/${list.name}`
          }
          className="block w-full"
        >
          <motion.div
            className="py-4 px-4 sm:py-6 sm:px-6 border-b border-gray-700 last:border-b-0"
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <div className="flex items-center">
              <div className="flex-grow pr-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {list.name}
                </h3>
                <p className="text-sm text-gray-300">
                  {list.RatingsCount ? list.RatingsCount : "No"} Rating
                  {list.RatingsCount !== 1 && "s"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isCollaborated
                    ? `By: ${list.user.name}`
                    : `Updated ${moment(list.updatedAt).fromNow()}`}
                </p>
              </div>
              <motion.div
                className="w-10 h-10 rounded-full bg-cinema-gold flex items-center justify-center flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                animate={{
                  backgroundColor: isHovered ? "#e6ac00" : "#ffc107",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill={isHovered ? "#0d253f" : "#0d253f"}
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
          Your Lists
        </h2>
        <div className="bg-cinema-blue-light rounded-lg shadow-sm overflow-hidden">
          <AnimatePresence>
            {userLists.map((list) => (
              <ListItem key={list.id} list={list} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {collaboratedLists.length > 0 && (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Collaborated Lists
          </h2>
          <div className="bg-cinema-blue-light rounded-lg shadow-sm overflow-hidden">
            <AnimatePresence>
              {collaboratedLists.map((list) => (
                <ListItem key={list.id} list={list} isCollaborated />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists;
