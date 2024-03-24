import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState, useEffect } from "react";
import { MODE, GLOBAL_ENERGY_DATA_API_URL } from "../utils/Constants";
import { refreshAccessToken } from "../utils/HelperFunctions";
import useLogout from "../utils/useLogout";

const GlobalBar = () => {
  const [option, setOption] = useState(null);
  const logoutFromApp = useLogout();
  let data = null;
  const callGlobalEnergyAPI = async () => {
    try {
      let accessToken = localStorage.getItem("token");
      const response = await fetch(GLOBAL_ENERGY_DATA_API_URL[MODE], {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 401) {
        console.log("refreshing global bar chart graph api..");
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          const response2 = await fetch(GLOBAL_ENERGY_DATA_API_URL[MODE], {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          data = await response2.json();
        } else {
          console.log("logging out");
          alert("Session is expired. Please login again");
          logoutFromApp();
          return;
        }
      } else if (!response.ok) {
        throw new Error("Error in calling Global Bar API, loggin out the user...");
      } else data = await response.json();

      const globalEnergyOption = {
        chart: {
          type: "bar",
          height: window.innerWidth < 1200 ? "100%" : "50%",
        },
        title: {
          text: "Global Energy Production",
          align: "center",
        },
        subtitle: {
          text: "Compares the overall Energy produced and consumed by everyone",
          align: "center",
        },
        xAxis: {
          categories: ["Production", "Consumption"],
          title: {
            text: null,
          },
          gridLineWidth: 1,
          lineWidth: 0,
        },
        yAxis: {
          min: 0,
          title: {
            text: "Energy (kW)",
            align: "high",
          },
          labels: {
            overflow: "justify",
          },
          gridLineWidth: 0,
        },
        tooltip: {
          valueSuffix: " millions",
        },
        plotOptions: {
          bar: {
            borderRadius: "50%",
            dataLabels: {
              enabled: true,
            },
            groupPadding: 0.1,
          },
        },
        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "top",
          x: -5,
          y: 45,
          floating: true,
          borderWidth: 1,
          backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
          shadow: true,
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: "Solar",
            data: [data["production"]["solar"], data["consumption"]["solar"]],
          },
          {
            name: "Wind",
            data: [data["production"]["wind"], data["consumption"]["wind"]],
          },
          {
            name: "Hydro",
            data: [data["production"]["hydro"], data["consumption"]["hydro"]],
          },
        ],
      };
      setOption(globalEnergyOption);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callGlobalEnergyAPI();
    window.addEventListener("resize", () => {
      // setWidth(window.innerWidth);
      if (option) {
        console.log("new width::::");
        console.log(window.innerWidth);
        const newOption = JSON.parse(JSON.stringify(option));
        newOption["chart"]["height"] = window.innerWidth < 1200 ? "100%" : "50%";
        setOption(newOption);
      }
    });
  }, []);

  return (
    option && (
      <div className="lg:flex lg:justify-center">
        <div className="lg:pt-6 pt-2 lg:w-[80%]">
          <HighchartsReact highcharts={Highcharts} options={option} />
        </div>
      </div>
    )
  );
};

export default GlobalBar;
