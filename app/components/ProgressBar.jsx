import React from "react";

const ProgressBar = ({ title, score, color }) => {
  const progress = (score / 10) * 100;

  return (
    <div className="flex mt-2">
      <div className="relative pt-1 w-full">
        <div className="flex mb-2 items-center justify-between">
          <div className="text-right">
            <span
              className={`text-md font-semibold inline-block text-${color}-600`}
            >
              {title}
            </span>
          </div>
          <div>
            <span
              className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-${color}-600 bg-${color}-200`}
            >
              {score}/10
            </span>
          </div>
        </div>
        <div
          className={`overflow-hidden h-2 mb-4 text-xs flex rounded bg-${color}-200`}
        >
          <div
            style={{ width: `${progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
