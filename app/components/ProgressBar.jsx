import React from "react";

const ProgressBar = ({ title, score }) => {
  const progressPercentage = (score / 10) * 100;

  return (
    <div className="flex flex-col gap-1 mt-1">
      <p className="text-md font-semibold">{title}</p>
      <div className="w-full flex items-center text-white">
        <div className="w-full bg-gray-300 h-8 relative">
          <div
            style={{ width: `${progressPercentage}%` }}
            className={`h-full ${
              progressPercentage > 70
                ? "bg-green-400"
                : progressPercentage > 30
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
          >
            <div className="flex justify-start items-center h-full px-2">
              <div className="text-sm">{score}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
