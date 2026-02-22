const Task = require("../models/task.model");
const Status = require("../models/status.model");
const Priority = require("../models/priority.model");

const getAllTasks = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            search,
            priority,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const filter = {};

        if (status) {
            filter.status = { $regex: new RegExp(`^${status}$`, "i") };
        }

        if (priority) {
            filter.priority = { $regex: new RegExp(`^${priority}$`, "i") };
        }

        if (search && search.trim()) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex }
            ];
        }

        const sortDirection = sortOrder === "asc" ? 1 : -1;
        const sort = { [sortBy]: sortDirection };

        const [tasks, total] = await Promise.all([
            Task.find(filter).sort(sort).skip(skip).limit(limitNum),
            Task.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limitNum);

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res
                .status(404)
                .json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const statusExists = await Status.findOne({
            name: { $regex: new RegExp(`^${status.trim()}$`, "i") },
        });
        if (!statusExists) {
            return res.status(422).json({
                success: false,
                message: `Status "${status}" does not exist. Create it first or choose an existing status.`,
            });
        }

        const priorityExists = await Priority.findOne({
            name: { $regex: new RegExp(`^${priority.trim()}$`, "i") },
        });
        if (!priorityExists) {
            return res.status(422).json({
                success: false,
                message: `Priority "${priority}" does not exist. Create it first or choose an existing priority.`,
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description ? description.trim() : "",
            status: statusExists.name,
            priority: priorityExists.name,
            dueDate: dueDate || null,
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res
                .status(404)
                .json({ success: false, message: "Task not found" });
        }

        const { title, description, status, priority, dueDate } = req.body;

        if (status !== undefined) {
            const statusExists = await Status.findOne({
                name: { $regex: new RegExp(`^${status.trim()}$`, "i") },
            });
            if (!statusExists) {
                return res.status(422).json({
                    success: false,
                    message: `Status "${status}" does not exist. Create it first or choose an existing status.`,
                });
            }
            task.status = statusExists.name;
        }

        if (priority !== undefined) {
            const priorityExists = await Priority.findOne({
                name: { $regex: new RegExp(`^${priority.trim()}$`, "i") },
            });
            if (!priorityExists) {
                return res.status(422).json({
                    success: false,
                    message: `Priority "${priority}" does not exist. Create it first or choose an existing priority.`,
                });
            }
            task.priority = priorityExists.name;
        }

        if (title !== undefined) task.title = title.trim();
        if (description !== undefined) task.description = description.trim();
        if (dueDate !== undefined) task.dueDate = dueDate;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res
                .status(404)
                .json({ success: false, message: "Task not found" });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};
