/* eslint-disable react/prop-types */
import React from "react";
import loadingSpinner from "../assets/loading-spinner.svg";
const Loadingbar = ({ height = "32", width = "32" }) => {
    return (
        <div className=" flex justify-center items-center">
            <div>
                <img className={`h-${height} w-${width}`} src={loadingSpinner} alt="loading spinner" />
                <p className="text-xl text-twitter-100 p-5 font-semibold">Loading...</p>
            </div>
        </div>
    );
};

export default Loadingbar;
