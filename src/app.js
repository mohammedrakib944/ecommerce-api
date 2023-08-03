require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const routes = require("./routes");
const rateLimit = require("express-rate-limit");

const app = express();

// Request limit
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // requests
  message: "Too many requests, please try again later!",
});

// Make public folder
app.use("/", express.static(path.join(__dirname, "../public")));

// Set rate limit for all routs
app.use(apiLimiter);

// See requests from console
app.use(morgan("dev"));

// set security HTTP headers
app.use(helmet());

// Protect against XSS attacks, should come before any routes
app.use(xssClean());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// api routes
app.use("/api/", routes);

// NOT FOUND URL
app.use("/*", (req, res, next) => {
  next("URL not found!");
});

// Server ERROR HANDER
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || err || "Server Error!";
  return res.status(statusCode).json({
    sucess: false,
    message: errorMessage,
  });
});

module.exports = app;
