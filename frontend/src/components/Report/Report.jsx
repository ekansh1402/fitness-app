import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "./Report.css";
import { AiFillEdit } from "react-icons/ai";
import ReportPopup from "../ReportPopup/ReportPopup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCaloriesByLimit } from "../../store/slices/CalorieSlice";
import moment from "moment";

const Report = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const [showPopup, setShowPopup] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [timeRange, setTimeRange] = useState("today");

  const preprocessData = (data, range) => {
    const groupedData = {};
    const processedData = [];

    if (range === "today") {
      data.forEach((item) => {
        const timeKey = moment(item.date).format("HH:00");
        groupedData[timeKey] = (groupedData[timeKey] || 0) + item.calorieIntake;
      });
    } else if (range === "week") {
      data.forEach((item) => {
        const dateKey = moment(item.date).format("YYYY-MM-DD");
        groupedData[dateKey] = (groupedData[dateKey] || 0) + item.calorieIntake;
      });
    } else if (range === "month") {
      data.forEach((item) => {
        const weekKey = moment(item.date).week();
        groupedData[weekKey] = (groupedData[weekKey] || 0) + item.calorieIntake;
      });
    } else if (range === "year") {
      data.forEach((item) => {
        const monthKey = moment(item.date).format("MMMM");
        groupedData[monthKey] =
          (groupedData[monthKey] || 0) + item.calorieIntake;
      });
    }

    for (const [label, calories] of Object.entries(groupedData)) {
      processedData.push({ label, calories });
    }

    return processedData;
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        let response;
        if (id === "calories") {
          response = await dispatch(
            fetchCaloriesByLimit({
              limit: timeRange === "today" ? 1 : timeRange === "week" ? 7 : 30,
            })
          );
        }

        if (response?.payload) {
          const preprocessedData = preprocessData(response.payload, timeRange);
          setReportData(preprocessedData);
        } else {
          setReportData(null);
        }
      };

      fetchData();
    }
  }, [id, timeRange, isAuthenticated, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view reports.</div>;
  }

  const chartData = reportData
    ? {
        labels: reportData.map((entry) => entry.label),
        datasets: [
          {
            label: "Calories Intake",
            data: reportData.map((entry) => entry.calories),
            backgroundColor: "rgba(75, 192, 192, 0.4)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <div className="reportpage">
      <h2>Report for {id}</h2>

      {/* Time Range Buttons */}
      <div className="time-range-buttons">
        {["today", "week", "month", "year"].map((range) => (
          <button
            key={range}
            className={`time-range-button ${
              timeRange === range ? "active" : ""
            }`}
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)} Report
          </button>
        ))}
      </div>

      {/* Line Chart */}
      {chartData ? (
        <div className="chart-wrapper">
          <div className="chart-container">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  x: { title: { display: true, text: "Time Range" } },
                  y: { title: { display: true, text: "Calories" } },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <p>No data available for this report.</p>
      )}

      {/* Edit Button */}
      <button className="editbutton" onClick={() => setShowPopup(true)}>
        <AiFillEdit />
      </button>

      {/* Popup */}
      {showPopup && <ReportPopup id={id} setShowPopup={setShowPopup} />}
    </div>
  );
};

export default Report;
