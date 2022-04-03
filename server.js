const hpp = require("hpp");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const xss = require("xss-clean");
const express = require("express");
const connectDB = require("./config/db");
const swaggerJsDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

//route file
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library APIs",
      version: "1.0.0",
      description: "A simple Express VacQ API",
    },
    servers: [{ url: "http://localhost:3000/api/v1" }],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect to DB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const limiter = rateLimiter({ windowMs: 1000 * 60 * 10, max: 1 });

//Body parser
app.use(express.json());

//Cookie parser
app.unsubscribe(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate limiting
// app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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
