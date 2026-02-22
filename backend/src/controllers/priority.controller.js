const Priority = require("../models/priority.model");
const Task = require("../models/task.model");

const getAllPriorities = async (req, res, next) => {
    try {
        const priorities = await Priority.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: priorities,
        });
    } catch (error) {
        next(error);
    }
};

const checkPriorityName = async (req, res, next) => {
    try {
        const { name } = req.query;
        if (!name || !name.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Name query param is required" });
        }

        const exists = await Priority.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        });

        res.status(200).json({
            success: true,
            data: { exists: !!exists, priority: exists || null },
        });
    } catch (error) {
        next(error);
    }
};

const createPriority = async (req, res, next) => {
    try {
        const { name, color } = req.body;

        const existing = await Priority.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: `Priority "${name}" already exists. Priority names must be unique.`,
            });
        }

        const priority = await Priority.create({ name: name.trim(), color });

        res.status(201).json({
            success: true,
            message: "Priority created successfully",
            data: priority,
        });
    } catch (error) {
        next(error);
    }
};

const updatePriority = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        const priority = await Priority.findById(id);
        if (!priority) {
            return res
                .status(404)
                .json({ success: false, message: "Priority not found" });
        }

        const oldName = priority.name;

        if (name && name.trim().toLowerCase() !== oldName.toLowerCase()) {
            const duplicate = await Priority.findOne({
                name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
                _id: { $ne: id },
            });
            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: `Priority "${name}" already exists. Priority names must be unique.`,
                });
            }
        }

        if (name) priority.name = name.trim();
        if (color) priority.color = color;
        await priority.save();

        if (name && name.trim() !== oldName) {
            await Task.updateMany(
                { priority: oldName },
                { $set: { priority: name.trim() } },
            );
        }

        res.status(200).json({
            success: true,
            message: "Priority updated successfully",
            data: priority,
        });
    } catch (error) {
        next(error);
    }
};

const deletePriority = async (req, res, next) => {
    try {
        const { id } = req.params;

        const priority = await Priority.findById(id);
        if (!priority) {
            return res
                .status(404)
                .json({ success: false, message: "Priority not found" });
        }

        const taskCount = await Task.countDocuments({ priority: priority.name });
        if (taskCount > 0) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete "${priority.name}" — it is used by ${taskCount} task(s). Reassign those tasks first.`,
            });
        }

        await priority.deleteOne();

        res.status(200).json({
            success: true,
            message: "Priority deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPriorities,
    createPriority,
    updatePriority,
    deletePriority,
    checkPriorityName,
};
