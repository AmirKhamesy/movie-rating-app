"use client";

import Link from "next/link";
import { FaGlobe } from "react-icons/fa";
import { motion } from "framer-motion";
import { LogoutButton } from "../auth";

const HomeContent = ({ userName, publicLists }) => {
  const handleOpenPublicList = (publicHash) => {
    window.open(
      `${process.env.NEXT_PUBLIC_API}/public-list/${publicHash}`,
      "_blank"
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-cinema-blue ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cinema-blue dark:text-cinema-gold">
            Welcome, {userName}
          </h1>
          <LogoutButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-cinema-blue dark:text-white mb-4">
            <FaGlobe
              className="inline-block mr-2 text-cinema-gold"
              aria-hidden="true"
            />
            Explore Public Lists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicLists.map((list) => (
              <div
                key={list.id}
                onClick={() => handleOpenPublicList(list.publicHash)}
                className="bg-white dark:bg-cinema-blue-light p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                tabIndex={0}
                role="button"
                aria-label={`Open ${list.name} public list`}
              >
                <h3 className="text-xl font-semibold text-cinema-blue dark:text-cinema-gold mb-2">
                  {list.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Created by: {list.userName}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Movies: {list.movieCount}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  Last updated: {new Date(list.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center text-sm text-cinema-blue dark:text-cinema-gold"
        >
          <p>Start exploring your personalized movie experience!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeContent;
