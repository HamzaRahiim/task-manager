const mongoose = require("mongoose");

const prioritySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Priority name is required"],
            trim: true,
            maxlength: [50, "Priority name cannot exceed 50 characters"],
        },
        color: {
            type: String,
            default: "#6B7280",
            match: [
                /^#([0-9A-Fa-f]{6})$/,
                "Color must be a valid hex code like #FF5733",
            ],
        },
    },
    {
        timestamps: true,
    },
);

prioritySchema.index(
    { name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } },
);

module.exports = mongoose.model("Priority", prioritySchema);
