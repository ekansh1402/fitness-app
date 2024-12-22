// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./Workout.css"; // Make sure the path to your CSS is correct

// const Workout = () => {
//   const { id } = useParams(); // Extract the 'id' from the URL
//   const [workout, setWorkout] = useState(null);

//   const getWorkout = async () => {
//     // Simulated data for different workouts based on 'id'
//     const workoutData = {
//       Chest: {
//         type: "Chest",
//         imageUrl:
//           "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
//         durationInMin: 30,
//         exercises: [
//           {
//             exercise: "Flat Bench Press",
//             videoUrl: "https://gymvisual.com/img/p/1/7/5/5/2/17552.gif",
//             sets: 3,
//             reps: 10,
//             rest: 60,
//             description:
//               "Perform a flat bench press to target the pectoral muscles effectively.",
//           },
//           {
//             exercise: "Incline Bench Press",
//             videoUrl: "https://gymvisual.com/img/p/1/0/3/9/8/10398.gif",
//             sets: 3,
//             reps: 10,
//             rest: 60,
//             description:
//               "Perform an incline bench press to emphasize the upper chest.",
//           },
//           {
//             exercise: "Decline Bench Press",
//             videoUrl: "https://gymvisual.com/img/p/6/5/2/3/6523.gif",
//             sets: 3,
//             reps: 10,
//             rest: 60,
//             description:
//               "Perform a decline bench press to emphasize the lower chest.",
//           },
//         ],
//       },
//       2: {
//         type: "Back",
//         imageUrl:
//           "https://images.unsplash.com/photo-1579751627032-72fcaf3944c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
//         durationInMin: 40,
//         exercises: [
//           {
//             exercise: "Pull-Ups",
//             videoUrl: "https://gymvisual.com/img/p/7/5/0/4/7504.gif",
//             sets: 4,
//             reps: 8,
//             rest: 90,
//             description: "Perform pull-ups to target your lats and upper back.",
//           },
//           {
//             exercise: "Barbell Row",
//             videoUrl: "https://gymvisual.com/img/p/1/5/0/2/1502.gif",
//             sets: 3,
//             reps: 10,
//             rest: 60,
//             description: "Perform barbell rows for overall back development.",
//           },
//           {
//             exercise: "Deadlift",
//             videoUrl: "https://gymvisual.com/img/p/2/3/8/9/2389.gif",
//             sets: 3,
//             reps: 5,
//             rest: 120,
//             description:
//               "Deadlifts are great for lower back and hamstring strength.",
//           },
//         ],
//       },
//     };

//     // Fetch data based on ID or show empty fallback
//     setWorkout(workoutData[id] || null);
//   };

//   useEffect(() => {
//     getWorkout();
//   }, [id]); // Re-run when 'id' changes

//   return (
//     <div className="workout">
//       {workout ? (
//         <>
//           <h1 className="mainhead1">{workout.type} Day</h1>
//           <div className="workout__exercises">
//             {workout.exercises.map((item, index) => (
//               <div
//                 key={index}
//                 className={
//                   index % 2 === 0
//                     ? "workout__exercise"
//                     : "workout__exercise workout__exercise--reverse"
//                 }
//               >
//                 <h3>{index + 1}</h3>
//                 <div className="workout__exercise__image">
//                   <img src={item.videoUrl} alt={item.exercise} />
//                 </div>
//                 <div className="workout__exercise__content">
//                   <h2>{item.exercise}</h2>
//                   <span>
//                     {item.sets} sets X {item.reps} reps
//                   </span>
//                   <p>{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <h2>No workout data available for ID: {id}</h2>
//       )}
//     </div>
//   );
// };

// export default Workout;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getWorkoutsByLimit } from "../../store/slices/WorkoutSlice";
import moment from "moment";
import "./Workout.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Workout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const [timeRange, setTimeRange] = useState("week");
  const [workoutData, setWorkoutData] = useState(null);

  const preprocessData = (data, range) => {
    const groupedData = {};
    const processedData = [];

    data.forEach((item) => {
      const totalVolume = item.sets.reduce(
        (sum, set) => sum + set.weight * set.reps,
        0
      );

      if (range === "week") {
        const dateKey = moment(item.date).format("YYYY-MM-DD");
        groupedData[dateKey] = (groupedData[dateKey] || 0) + totalVolume;
      } else if (range === "month") {
        const weekKey = moment(item.date).week();
        groupedData[weekKey] = (groupedData[weekKey] || 0) + totalVolume;
      } else if (range === "year") {
        const monthKey = moment(item.date).format("MMMM");
        groupedData[monthKey] = (groupedData[monthKey] || 0) + totalVolume;
      }
    });

    for (const [label, volume] of Object.entries(groupedData)) {
      processedData.push({ label, volume });
    }

    return processedData;
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        let response = await dispatch(
          getWorkoutsByLimit({
            id,
            limit: timeRange === "week" ? 7 : 30,
          })
        );

        if (response?.payload) {
          const preprocessedData = preprocessData(response.payload, timeRange);
          setWorkoutData(preprocessedData);
        } else {
          setWorkoutData(null);
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

  const chartData = workoutData
    ? {
        labels: workoutData.map((entry) => entry.label),
        datasets: [
          {
            label: "Workout Volume",
            data: workoutData.map((entry) => entry.volume),
            backgroundColor: "rgba(54, 162, 235, 0.4)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <div className="workout-report">
      <h2>Workout Report for {id}</h2>

      <div className="time-range-buttons">
        {["week", "month", "year"].map((range) => (
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

      {chartData ? (
        <div className="chart-wrapper">
          <Line
            key={timeRange}
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
              scales: {
                x: { title: { display: true, text: "Time Range" } },
                y: { title: { display: true, text: "Workout Volume" } },
              },
            }}
          />
        </div>
      ) : (
        <p>No data available for this report.</p>
      )}
    </div>
  );
};

export default Workout;
