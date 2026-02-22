const express = require("express");
const cors = require("cors");
const allRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res
        .status(200)
        .json({ success: true, message: "API is running", timestamp: new Date() });
});

app.use("/api", allRoutes);

app.use((req, res) => {
    res
        .status(404)
        .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

module.exports = app;
