import React from "react";
import { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { capitalizeFirstLetter } from "../utils/HelperFunctions";
import { MODE, LINEGRAPH_DATA_API_URL } from "../utils/Constants";

const LineGraph = ({ duration, energyFilter }) => {
  //   const [productionList, setProductionList] = useState([]);
  //   const [consumptionList, setConsumptionList] = useState([]);
  //const [chartKey, setChartKey] = useState(Date.now()); // 1. State to hold the unique key
  const [options, setOption] = useState(null);

  const lineGraphAPI = async () => {
    try {
      const payload = {
        userid: parseInt(localStorage.getItem("userid"), 10),
        duration: duration,
        source: energyFilter,
      };
      const response = await fetch(LINEGRAPH_DATA_API_URL[MODE], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error in fetching line Graph data");
      const data = await response.json();

      let start = 21 - duration + 1;
      //   if (duration === 4) start = 18;
      //   if (duration === 8) start = 14;

      console.log("start :" + start);

      const newOption = {
        chart: {
          type: "spline",
          scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1,
          },
        },
        title: {
          text: capitalizeFirstLetter(energyFilter) + " Line Graph",
          align: "center",
        },
        subtitle: {
          text: `Solar Energy Production vs Consumption -  last ${duration} days`,
          align: "center",
        },
        xAxis: {
          type: "datetime",
          labels: {
            overflow: "justify",
          },
        },
        yAxis: {
          title: {
            text: "Energy (KilloWatts)",
          },
          minorGridLineWidth: 0,
          gridLineWidth: 0,
          alternateGridColor: null,
        },
        tooltip: {
          valueSuffix: "kW",
        },
        plotOptions: {
          spline: {
            lineWidth: 4,
            states: {
              hover: {
                lineWidth: 5,
              },
            },
            marker: {
              enabled: false,
            },
            pointInterval: 3600000, // one hour
            pointStart: Date.UTC(2024, 2, start, 0, 0, 0),
          },
        },
        series: [
          {
            name: "Production",
            data: [],
          },
          {
            name: "Consumption",
            data: [],
          },
        ],
        navigation: {
          menuItemStyle: {
            fontSize: "10px",
          },
        },
      };
      newOption.series[0]["data"] = data.production;
      newOption.series[1]["data"] = data.consumption;

      //setting the range of dates on x-axis

      setOption(newOption);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    lineGraphAPI();
  }, [duration, energyFilter]);

  return (
    options && (
      <div>
        <div>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
    )
  );
};

export default LineGraph;
