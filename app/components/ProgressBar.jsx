import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ title, score, mobileView = false }) => {
  const progressPercentage = (score / 10) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <p
          className={`text-sm font-semibold ${
            mobileView ? "text-white md:text-gray-700" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-sm font-medium ${
            mobileView ? "text-white md:text-gray-700" : "text-gray-700"
          }`}
        >
          {score}
        </p>
      </div>
      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${
            progressPercentage > 70
              ? "bg-green-500"
              : progressPercentage > 30
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
