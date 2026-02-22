const Status = require("../models/status.model");
const Task = require("../models/task.model");

const getAllStatuses = async (req, res, next) => {
    try {
        const statuses = await Status.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: statuses,
        });
    } catch (error) {
        next(error);
    }
};

const checkStatusName = async (req, res, next) => {
    try {
        const { name } = req.query;
        if (!name || !name.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Name query param is required" });
        }

        const exists = await Status.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        });

        res.status(200).json({
            success: true,
            data: { exists: !!exists, status: exists || null },
        });
    } catch (error) {
        next(error);
    }
};

const createStatus = async (req, res, next) => {
    try {
        const { name, color } = req.body;

        const existing = await Status.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: `Status "${name}" already exists. Status names must be unique.`,
            });
        }

        const status = await Status.create({ name: name.trim(), color });

        res.status(201).json({
            success: true,
            message: "Status created successfully",
            data: status,
        });
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        const status = await Status.findById(id);
        if (!status) {
            return res
                .status(404)
                .json({ success: false, message: "Status not found" });
        }

        const oldName = status.name;

        if (name && name.trim().toLowerCase() !== oldName.toLowerCase()) {
            const duplicate = await Status.findOne({
                name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
                _id: { $ne: id },
            });
            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: `Status "${name}" already exists. Status names must be unique.`,
                });
            }
        }

        if (name) status.name = name.trim();
        if (color) status.color = color;
        await status.save();

        if (name && name.trim() !== oldName) {
            await Task.updateMany(
                { status: oldName },
                { $set: { status: name.trim() } },
            );
        }

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: status,
        });
    } catch (error) {
        next(error);
    }
};

const deleteStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const status = await Status.findById(id);
        if (!status) {
            return res
                .status(404)
                .json({ success: false, message: "Status not found" });
        }

        const taskCount = await Task.countDocuments({ status: status.name });
        if (taskCount > 0) {
            return res.status(409).json({
                success: false,
                message: `Cannot delete "${status.name}" — it is used by ${taskCount} task(s). Reassign those tasks first.`,
            });
        }

        await status.deleteOne();

        res.status(200).json({
            success: true,
            message: "Status deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    checkStatusName,
};
