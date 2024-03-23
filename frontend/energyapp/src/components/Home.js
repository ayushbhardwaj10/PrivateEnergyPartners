import Header from "./Header";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useEffect } from "react";
import LineGraph from "./LineGraph";
import PieChartGraph from "./PieChartGraph";
import PairWiseBarGraph from "./PairWiseBarGraph";
import GlobalBar from "./GlobalBar";
const Home = () => {
  const [energyFilter, setEnergyFilter] = useState("solar");
  const [duration, setDuration] = useState(2);
  const [showDropDown, setShowDropDown] = useState(false);

  const changeEnergyFilter = (filterName) => {
    setEnergyFilter(filterName);
  };
  const graphKey = `${duration}`;
  const pie1Key = `${duration} pie1`;
  const pie2Key = `${duration} pie2`;
  return (
    <div>
      <Header />
      <div className="bg-[#F6F6F6] md:p-10 lg:p-5 px-1">
        <div className="flex pt-1">
          <div className="text-xl font-bold lg:pb-1 pb-2 pr-1">Energy Filter</div>
          <div className="pt-[1px]">
            {" "}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 grid-cols-2 bg-white lg:w-[50%] rounded-lg">
          <div
            className={`p-2 flex justify-center items-center rounded-lg cursor-pointer  ${
              energyFilter === "solar" ? "lg:text-xl bg-green-300 font-bold " : "hover:bg-green-200 hover:font-bold"
            } `}
            onClick={() => {
              changeEnergyFilter("solar");
            }}
          >
            Solar
          </div>
          <div
            className={`p-2 flex justify-center items-center rounded-lg cursor-pointer ${
              energyFilter === "wind" ? "lg:text-xl bg-green-300 font-bold" : "hover:bg-green-200 hover:font-bold"
            } `}
            onClick={() => {
              changeEnergyFilter("wind");
            }}
          >
            Wind
          </div>
          <div
            className={`p-2 flex justify-center items-center rounded-lg cursor-pointer ${
              energyFilter === "hydro" ? "lg:text-xl bg-green-300 font-bold" : "hover:bg-green-200 hover:font-bold"
            } `}
            onClick={() => {
              changeEnergyFilter("hydro");
            }}
          >
            Hydro
          </div>
          <div
            className={`p-2 flex justify-center items-center rounded-lg cursor-pointer  ${
              energyFilter === "comparison" ? "lg:text-xl bg-green-300 font-bold" : "hover:bg-green-200 hover:font-bold"
            } `}
            onClick={() => {
              changeEnergyFilter("comparison");
            }}
          >
            Overall Energy
          </div>
        </div>

        {energyFilter !== "comparison" && (
          <div>
            <div className="text-xl font-bold lg:pb-2 pb-1 pr-1 lg:pt-2 pt-1">Select Duration</div>
            <button
              className=" font-bold bg-green-300 hover:bg-green-200 text-black rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
              type="button"
              data-dropdown-toggle="dropdown"
              onClick={() => {
                setShowDropDown(!showDropDown);
              }}
            >
              last {duration} days
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {showDropDown && (
              <div className="bg-green-300 text-base z-50 absolute list-none divide-y divide-gray-100 rounded shadow my-1 w-[20rem]" id="dropdown">
                <ul className="py-1" aria-labelledby="dropdown">
                  <li
                    className="text-sm hover:bg-green-200 text-gray-700 block px-4 py-2"
                    onClick={() => {
                      setShowDropDown(false);
                      setDuration(2);
                    }}
                  >
                    last 2 Days
                  </li>
                  <li
                    className="text-sm hover:bg-green-200 text-gray-700 block px-4 py-2"
                    onClick={() => {
                      setShowDropDown(false);
                      setDuration(4);
                    }}
                  >
                    Last 4 days
                  </li>
                  <li
                    className="text-sm hover:bg-green-200 text-gray-700 block px-4 py-2"
                    onClick={() => {
                      setShowDropDown(false);
                      setDuration(8);
                    }}
                  >
                    Last 8 days
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {energyFilter !== "comparison" && (
          <div className="Charts pt-4">
            <div className="xl:flex xl:justify-evenly justify-center">
              <div className="xl:flex xl:flex-col xl:items-center xl:px-6 px-2">
                <div>
                  <LineGraph duration={duration} energyFilter={energyFilter} key={graphKey} />
                </div>
                <div className="pt-4">
                  <PairWiseBarGraph energyFilter={energyFilter} />
                </div>
              </div>
              <div className="xl:flex xl:flex-col xl:items-center xl:pt-0 pt-4 justify-center">
                <div>
                  <PieChartGraph duration={duration} energyFilter={energyFilter} isProduction={true} />
                </div>
                <div className="pt-4">
                  <PieChartGraph duration={duration} energyFilter={energyFilter} isProduction={false} />
                </div>
              </div>
            </div>
          </div>
        )}
        {energyFilter === "comparison" && (
          <div>
            <GlobalBar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
