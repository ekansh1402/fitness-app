const express = require("express");
const router = express.Router();

const authTokenHandler = require("../../Middlewares/checkAuthToken");
const errorHandler = require("../../Middlewares/errorMiddleware");
const User = require("../../Models/UserSchema");

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

router.post("/addworkoutentry", authTokenHandler, async (req, res) => {
  const { dateTime, workoutType, duration, sets } = req.body;
  console.log("inside workout", req.body);
  if (!dateTime || !workoutType || !duration || !sets) {
    return res
      .status(400)
      .json(
        createResponse(false, "Please provide date, exercise, and duration")
      );
  }

  const userId = req.userId;
  const user = await User.findById({ _id: userId });

  user.workouts.push({
    date: new Date(dateTime),
    exercise: workoutType,
    durationInMinutes: parseInt(duration),
    sets,
  });

  await user.save();
  res.json(createResponse(true, "Workout entry added successfully"));
});

router.post("/getworkoutsbydate", authTokenHandler, async (req, res) => {
  const { date } = req.body;
  const userId = req.userId;

  const user = await User.findById({ _id: userId });

  if (!date) {
    let date = new Date();
    user.workouts = filterEntriesByDate(user.workouts, date);

    return res.json(
      createResponse(true, "Workout entries for today", user.workouts)
    );
  }

  user.workouts = filterEntriesByDate(user.workouts, new Date(date));
  res.json(createResponse(true, "Workout entries for the date", user.workouts));
});

// has a bug
router.post("/getworkoutsbylimit", authTokenHandler, async (req, res) => {
  const { limit } = req.body;

  const userId = req.userId;
  const user = await User.findById({ _id: userId });

  if (!limit) {
    return res.status(400).json(createResponse(false, "Please provide limit"));
  } else if (limit === "all") {
    return res.json(createResponse(true, "All workout entries", user.workouts));
  } else {
    let date = new Date();
    let currentDate = new Date(
      date.setDate(date.getDate() - parseInt(limit))
    ).getTime();

    user.workouts = user.workouts.filter((item) => {
      return new Date(item.date).getTime() >= currentDate;
    });

    return res.json(
      createResponse(
        true,
        `Workout entries for the last ${limit} days`,
        user.workouts
      )
    );
  }
});

router.delete("/deleteworkoutentry", authTokenHandler, async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json(createResponse(false, "Please provide date"));
  }

  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json(createResponse(false, "User not found"));
  }

  user.workouts = user.workouts.filter(
    (entry) => new Date(entry.date).getTime() !== new Date(date).getTime()
  );

  await user.save();
  res.json(createResponse(true, "Workout entry deleted successfully"));
});

router.get("/getusergoalworkout", authTokenHandler, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    let goal;
    if (user.goal === "weightLoss") {
      goal = 7;
    } else if (user.goal === "weightGain") {
      goal = 4;
    } else {
      goal = 5;
    }

    res.json(createResponse(true, "User goal workout days", { goal }));
  } catch (error) {
    res
      .status(500)
      .json(createResponse(false, "Server error", { error: error.message }));
  }
});

router.use(errorHandler);

function filterEntriesByDate(entries, targetDate) {
  return entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getDate() === targetDate.getDate() &&
      entryDate.getMonth() === targetDate.getMonth() &&
      entryDate.getFullYear() === targetDate.getFullYear()
    );
  });
}

module.exports = router;
