const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const {
    getAllStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    checkStatusName,
} = require("../controllers/status.controller");

const statusValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Status name is required")
        .isLength({ max: 50 })
        .withMessage("Status name cannot exceed 50 characters"),
    body("color")
        .optional()
        .matches(/^#([0-9A-Fa-f]{6})$/)
        .withMessage("Color must be a valid hex code like #FF5733"),
];

router.get("/", getAllStatuses);
router.get("/check", checkStatusName);
router.post("/", statusValidation, validate, createStatus);
router.patch("/:id", statusValidation, validate, updateStatus);
router.delete("/:id", deleteStatus);

module.exports = router;
