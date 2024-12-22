const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const routes = require("./routes/route");
require("dotenv").config();
const { db } = require("./db/db");
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Specify your frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use("/api/v1", routes);
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
db();
