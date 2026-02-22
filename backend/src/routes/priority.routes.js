const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const {
    getAllPriorities,
    createPriority,
    updatePriority,
    deletePriority,
    checkPriorityName,
} = require("../controllers/priority.controller");

const priorityValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Priority name is required")
        .isLength({ max: 50 })
        .withMessage("Priority name cannot exceed 50 characters"),
    body("color")
        .optional()
        .matches(/^#([0-9A-Fa-f]{6})$/)
        .withMessage("Color must be a valid hex code like #FF5733"),
];

router.get("/", getAllPriorities);
router.get("/check", checkPriorityName);
router.post("/", priorityValidation, validate, createPriority);
router.patch("/:id", priorityValidation, validate, updatePriority);
router.delete("/:id", deletePriority);

module.exports = router;
