const router = require("express").Router();

const authRoutes = require("./subroutes/Auth");
const calorieIntakeRoutes = require("./subroutes/CalorieIntake");
const imageUploadRoutes = require("./subroutes/imageUploadRoutes");
const sleepTrackRoutes = require("./subroutes/SleepTrack");
const stepTrackRoutes = require("./subroutes/StepTrack");
const weightTrackRoutes = require("./subroutes/WeightTrack");
const waterTrackRoutes = require("./subroutes/WaterTrack");
const workoutTrackRoutes = require("./subroutes/WorkoutTrack");
const workoutRoutes = require("./subroutes/WorkoutPlans");
const reportRoutes = require("./subroutes/Report");
const adminRoutes = require("./subroutes/Admin");
const userRoutes = require("./subroutes/user");
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/calorieintake", calorieIntakeRoutes);
router.use("/image-upload", imageUploadRoutes);
router.use("/sleeptrack", sleepTrackRoutes);
router.use("/steptrack", stepTrackRoutes);
router.use("/weighttrack", weightTrackRoutes);
router.use("/watertrack", waterTrackRoutes);
router.use("/workouttrack", workoutTrackRoutes);
router.use("/workoutplans", workoutRoutes);
router.use("/report", reportRoutes);
router.use("/user", userRoutes);
module.exports = router;
