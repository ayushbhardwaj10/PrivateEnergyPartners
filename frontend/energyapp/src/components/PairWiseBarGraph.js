import React, { useEffect, useState } from "react";
import { PAIRWISE_BAR_GRAPH_DATA_API_URL, MODE } from "../utils/Constants";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { capitalizeFirstLetter } from "../utils/HelperFunctions";

const PairWiseBarGraph = ({ energyFilter }) => {
  const [option, setOption] = useState(null);
  const pairwiseBarGraphAPI = async () => {
    try {
      const payload = {
        user_id: parseInt(localStorage.getItem("userid"), 10),
        energy_type: energyFilter,
      };
      const response = await fetch(PAIRWISE_BAR_GRAPH_DATA_API_URL[MODE], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Error in fetching Pie Graph data");
      const data = await response.json();

      let OPTION_PAIRWISE_BAR_CHART = {
        chart: {
          type: "column",
        },
        title: {
          text: `${capitalizeFirstLetter(energyFilter)} Energy Produced vs Consumed`,
          align: "center",
        },

        xAxis: {
          categories: ["14th March", "15th March", "16th March", "17th March", "18th March", "19th March", "20th March", "21st March"],
          crosshair: true,
          accessibility: {
            description: "Countries",
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "KilloWatts(kW) of Energy",
          },
        },
        tooltip: {
          valueSuffix: "kW",
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: "Production",
            data: data.production,
          },
          {
            name: "Consumption",
            data: data.consumption,
          },
        ],
      };
      setOption(OPTION_PAIRWISE_BAR_CHART);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    pairwiseBarGraphAPI();
  }, [energyFilter]);

  return (
    option && (
      <div>
        <HighchartsReact highcharts={Highcharts} options={option} />
      </div>
    )
  );
};

export default PairWiseBarGraph;
