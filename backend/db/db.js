const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const db = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(console.log("success"))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = { db };
