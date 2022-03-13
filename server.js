const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

//route file
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

//Body parser
app.use(express.json());

//Cookie parser
app.unsubscribe(cookieParser());

app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);

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
