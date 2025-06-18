const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Move this to the top

const corsOptions = {
  origin: [
    "https://student-progress-site-frontend.onrender.com",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add explicit methods
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ], // Add headers
  optionsSuccessStatus: 200, // For legacy browser support
};

const connectDB = require("./config/database");

const app = express();

// Connect to database
connectDB();

// CORS middleware - must be first
app.use(cors(corsOptions));

// Handle preflight requests explicitly - FIXED for Express v5
app.options("*catchall", cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data

// Routes
app.use("/api/students", require("./routes/student"));
app.use("/api/data", require("./routes/data"));
app.use("/api/summary", require("./routes/summary"));

app.get("/", (req, res) => {
  res.send("Student Progress Management System API");
});

// 404 handler - FIXED for Express v5
app.all("*catchall", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Load cron jobs after server starts
require("./jobs/nightlySync");
