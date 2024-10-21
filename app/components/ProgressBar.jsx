import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ title, score, mobileView = false }) => {
  const progressPercentage = (score / 10) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-cinema-gold">{title}</p>
        <p className="text-sm font-medium text-cinema-gold">{score}</p>
      </div>
      <div className="w-full bg-cinema-blue-light h-3 rounded-full overflow-hidden">
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
