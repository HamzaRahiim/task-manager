const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            required: [true, "Status is required"],
            trim: true,
        },
        priority: {
            type: String,
            required: [true, "Priority is required"],
            trim: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
