const express = require("express");
const taskRoutes = require("./task.routes");
const statusRoutes = require("./status.routes");
const priorityRoutes = require("./priority.routes");

const allRoutes = express.Router();

allRoutes.use("/statuses", statusRoutes);
allRoutes.use("/tasks", taskRoutes);
allRoutes.use("/priorities", priorityRoutes);

module.exports = allRoutes;
