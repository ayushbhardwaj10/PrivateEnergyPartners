import React from "react";
import { useState, useEffect } from "react";
import { MODE, PIECHART_DATA_API_URL } from "../utils/Constants";
import Highcharts from "highcharts";
import PieChart from "highcharts-react-official";
import { capitalizeFirstLetter, refreshAccessToken } from "../utils/HelperFunctions";

const PieChartGraph = ({ duration, energyFilter, isProduction }) => {
  const [option, setOption] = useState(null);
  const type = isProduction ? "production" : "consumption";
  let data = null;
  const pieChartAPI = async () => {
    try {
      const payload = {
        userid: parseInt(localStorage.getItem("userid"), 10),
        energy_type: energyFilter,
        duration: duration,
      };
      let accessToken = localStorage.getItem("token");
      const response = await fetch(PIECHART_DATA_API_URL[MODE], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        console.log("refreshing pie chart graph api..");
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          const response2 = await fetch(PIECHART_DATA_API_URL[MODE], {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
            body: JSON.stringify(payload),
          });
          data = await response2.json();
        } else {
          //loggin out from LineGraph.js
          return;
        }
      } else if (!response.ok) {
        throw new Error("Error in calling Pie chart API, loggin out the user...");
      } else data = await response.json();

      let OPTIONS_PIE_CHART = {
        chart: {
          type: "pie",
        },
        title: {
          text: ` ${capitalizeFirstLetter(type)} of ${capitalizeFirstLetter(energyFilter)}`,
        },
        tooltip: {
          valueSuffix: "%",
        },
        subtitle: {
          text: "You vs Others",
        },
        plotOptions: {
          series: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: [
              {
                enabled: true,
                distance: 20,
              },
              {
                enabled: true,
                distance: -40,
                format: "{point.percentage:.1f}%",
                style: {
                  fontSize: "1.2em",
                  textOutline: "none",
                  opacity: 0.7,
                },
                filter: {
                  operator: ">",
                  property: "percentage",
                  value: 10,
                },
              },
            ],
          },
        },
        series: [
          {
            name: "Percentage",
            colorByPoint: false, // Set to false to manually set colors
            data: [
              {
                name: "You",
                y: data[type]["Yours"],
                selected: true,
                color: "#FFA500", // Orange in hex code
              },
              {
                name: "Others",
                sliced: true,
                y: data[type]["Others"],
                color: "#90EE90", // Light green in hex code
              },
            ],
          },
        ],
      };

      setOption(OPTIONS_PIE_CHART);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    pieChartAPI();
  }, [duration, energyFilter]);
  return (
    option && (
      <div>
        <PieChart highcharts={Highcharts} options={option} />
      </div>
    )
  );
};

export default PieChartGraph;
