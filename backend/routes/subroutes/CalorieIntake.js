const express = require("express");
const router = express.Router();
const authTokenHandler = require("../../Middlewares/checkAuthToken");
const jwt = require("jsonwebtoken");
const errorHandler = require("../../Middlewares/errorMiddleware");
const request = require("request");
const User = require("../../Models/UserSchema");
require("dotenv").config();

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

router.get("/test", authTokenHandler, async (req, res) => {
  res.json(createResponse(true, "Test API works for calorie intake report"));
});

const axios = require("axios");

router.post("/addcalorieintake", authTokenHandler, async (req, res) => {
  console.log("Inside calorie intake route");

  const { foodItems } = req.body;
  if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
    return res
      .status(400)
      .json(createResponse(false, "Please provide valid food items"));
  }

  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    const promises = foodItems.map(async (item) => {
      const { name, amount, dateTime } = item;

      if (!name || !amount || !dateTime) {
        throw new Error("Incomplete item details");
      }

      try {
        // Query Open Food Facts API
        const response = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(
            name
          )}.json`
        );

        let caloriePer100g = 100; // Default calorie value
        if (response.data && response.data.product) {
          const product = response.data.product;
          caloriePer100g =
            product.nutriments && product.nutriments.energy_kcal_100g
              ? product.nutriments.energy_kcal_100g
              : 100; // Default if calorie info is missing
        }

        // Calculate calorie intake
        const calorieIntake = (caloriePer100g / 100) * parseFloat(amount);

        // Add to user's calorie intake
        user.calorieIntake.push({
          item: name, // Set item as the food name
          date: new Date(dateTime),
          quantity: parseFloat(amount), // Set quantity as the amount
          quantitytype: "g",
          calorieIntake: parseInt(calorieIntake),
        });
      } catch (apiError) {
        console.error(
          `Failed to fetch data for ${name}, defaulting to 100 calories per 100g`
        );
        const calorieIntake = (100 / 100) * parseFloat(amount);

        // Add fallback calorie intake
        user.calorieIntake.push({
          item: name, // Set item as the food name
          date: new Date(dateTime),
          quantity: parseFloat(amount), // Set quantity as the amount
          quantitytype: "g",
          calorieIntake: parseInt(calorieIntake),
        });
      }
    });

    await Promise.all(promises);
    await user.save();
    res.json(createResponse(true, "Calorie intake added successfully"));
  } catch (error) {
    console.error("Error adding calorie intake:", error.message);
    res
      .status(500)
      .json(
        createResponse(false, "An error occurred while adding calorie intake")
      );
  }
});

router.post("/getcalorieintakebydate", authTokenHandler, async (req, res) => {
  console.log("inside getcalorie by date");

  const { date } = req.body;
  const userId = req.userId;
  const user = await User.findById({ _id: userId });
  if (!date) {
    let date = new Date(); // sept 1 2021 12:00:00
    user.calorieIntake = filterEntriesByDate(user.calorieIntake, date);

    return res.json(
      createResponse(true, "Calorie intake for today", user.calorieIntake)
    );
  }
  user.calorieIntake = filterEntriesByDate(user.calorieIntake, new Date(date));
  res.json(
    createResponse(true, "Calorie intake for the date", user.calorieIntake)
  );
});
router.post("/getcalorieintakebylimit", authTokenHandler, async (req, res) => {
  console.log("get calorie by limit");

  const { limit } = req.body;
  const userId = req.userId;
  const user = await User.findById({ _id: userId });
  if (!limit) {
    return res.status(400).json(createResponse(false, "Please provide limit"));
  } else if (limit === "all") {
    return res.json(createResponse(true, "Calorie intake", user.calorieIntake));
  } else {
    let date = new Date();
    let currentDate = new Date(
      date.setDate(date.getDate() - parseInt(limit))
    ).getTime();
    // 1678910

    user.calorieIntake = user.calorieIntake.filter((item) => {
      return new Date(item.date).getTime() >= currentDate;
    });
    console.log("bye");
    return res.json(
      createResponse(
        true,
        `Calorie intake for the last ${limit} days`,
        user.calorieIntake
      )
    );
  }
});
router.delete("/deletecalorieintake", authTokenHandler, async (req, res) => {
  const { item, date } = req.body;
  if (!item || !date) {
    return res
      .status(400)
      .json(createResponse(false, "Please provide all the details"));
  }

  const userId = req.userId;
  const user = await User.findById({ _id: userId });

  user.calorieIntake = user.calorieIntake.filter((item) => {
    return item.item != item && item.date != date;
  });
  await user.save();
  res.json(createResponse(true, "Calorie intake deleted successfully"));
});
router.get("/getgoalcalorieintake", authTokenHandler, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById({ _id: userId });
  let maxCalorieIntake = 0;
  let heightInCm = parseFloat(user.height[user.height.length - 1].height);
  let weightInKg = parseFloat(user.weight[user.weight.length - 1].weight);
  let age = new Date().getFullYear() - new Date(user.dob).getFullYear();
  let BMR = 0;
  let gender = user.gender;
  if (gender == "male") {
    BMR = 88.362 + 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * age;
  } else if (gender == "female") {
    BMR = 447.593 + 9.247 * weightInKg + 3.098 * heightInCm - 4.33 * age;
  } else {
    BMR = 447.593 + 9.247 * weightInKg + 3.098 * heightInCm - 4.33 * age;
  }
  if (user.goal == "weightLoss") {
    maxCalorieIntake = BMR - 500;
  } else if (user.goal == "weightGain") {
    maxCalorieIntake = BMR + 500;
  } else {
    maxCalorieIntake = BMR;
  }

  res.json(createResponse(true, "max calorie intake", { maxCalorieIntake }));
});

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
