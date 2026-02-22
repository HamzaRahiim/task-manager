const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} = require("../controllers/task.controller");

const taskCreateValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title cannot exceed 100 characters"),
    body("description").optional().trim(),
    body("status").trim().notEmpty().withMessage("Status is required"),
    body("priority")
        .trim()
        .notEmpty()
        .withMessage("Priority is required"),
    body("dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid date"),
];

const taskUpdateValidation = [
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Title cannot exceed 100 characters"),
    body("description").optional().trim(),
    body("status")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Status cannot be empty"),
    body("priority")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Priority cannot be empty"),
    body("dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid date"),
];

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", taskCreateValidation, validate, createTask);
router.patch("/:id", taskUpdateValidation, validate, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
