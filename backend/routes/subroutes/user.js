const express = require("express");
const router = express.Router();
const User = require("../../Models/UserSchema");
const authTokenHandler = require("../../Middlewares/checkAuthToken");
const errorHandler = require("../../Middlewares/errorMiddleware");
require("dotenv").config();
const axios = require("axios");

// Middleware to create response
function createResponse(ok, message, data) {
  return { ok, message, data };
}

// Fetch user profile
router.get("/profile", authTokenHandler, async (req, res, next) => {
  console.log("inside profile");
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    res.json(createResponse(true, "User profile fetched successfully", user));
  } catch (err) {
    next(err);
  }
});

// Update user profile
router.put("/profile", authTokenHandler, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { activityLevel, goal, weight, height } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          activityLevel,
          goal,
        },
        $push: {
          weight,
          height,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json(createResponse(false, "Failed to update user profile"));
    }

    res.json(
      createResponse(true, "User profile updated successfully", updatedUser)
    );
  } catch (err) {
    next(err);
  }
});

// Fetch user statistics
router.get("/stats", authTokenHandler, async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    const stats = {
      steps: user.steps,
      workouts: user.workouts,
      water: user.water,
      sleep: user.sleep,
    };

    res.json(createResponse(true, "User stats fetched successfully", stats));
  } catch (err) {
    next(err);
  }
});

// Update user goal
router.put("/goal", authTokenHandler, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { goal } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { goal },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json(createResponse(false, "Failed to update user goal"));
    }

    res.json(
      createResponse(true, "User goal updated successfully", updatedUser)
    );
  } catch (err) {
    next(err);
  }
});

router.post("/analyze", authTokenHandler, async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is passed in the route parameters
    const user = await User.findById(userId);
    return res.json(hi);
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format data for Weight (kg)
    const weightData = user.weight
      .map((record) => {
        return `${record.date.toLocaleString("default", { month: "short" })}: ${
          record.weight
        }`;
      })
      .join(", ");

    // Format data for Steps (steps/day)
    const stepsData = user.steps
      .map((record) => {
        return `${record.date.toLocaleString("default", { month: "short" })}: ${
          record.steps
        }`;
      })
      .join(", ");

    // Format data for Workouts (days/week)
    const workoutsData = user.workouts
      .map((record) => {
        const exerciseTypes = record.exercise; // Assuming exercise data is available
        return `${record.date.toLocaleString("default", {
          month: "short",
        })}: ${exerciseTypes}`;
      })
      .join(", ");

    // Format data for Calorie Intake (kcal/day)
    const calorieIntakeData = user.calorieIntake
      .map((record) => {
        return `${record.date.toLocaleString("default", { month: "short" })}: ${
          record.calorieIntake
        }`;
      })
      .join(", ");

    // Format data for Sleep (hours/night)
    const sleepData = user.sleep
      .map((record) => {
        return `${record.date.toLocaleString("default", { month: "short" })}: ${
          record.durationInHrs
        }`;
      })
      .join(", ");

    // Build the prompt to send to OpenAI API
    const prompt =
      `Analyze the following data for the user’s performance in 2024:\n\n` +
      `Weight (kg): ${weightData}\n` +
      `Steps (steps/day): ${stepsData}\n` +
      `Workouts (days/week): ${workoutsData}\n` +
      `Calorie Intake (kcal/day): ${calorieIntakeData}\n` +
      `Sleep (hours/night): ${sleepData}\n\n` +
      `Summarize the monthly progress and trends for weight, steps, workouts, calorie intake, and sleep. Provide insights into overall performance over the year.`;

    // Send the prompt to the OpenAI API for analysis
    const openai = new OpenAI({ apiKey: process.env.API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    // Send the response back to the client
    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error("Error analyzing user performance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.use(errorHandler);

module.exports = router;
