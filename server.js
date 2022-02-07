const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//route file
const hospitals = require("./routes/hospitals");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//Body parser
app.use(express.json());

app.use("/api/v1/hospitals", hospitals);

const server = app.listen(
  PORT,
  console.log(
    `Server's running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
