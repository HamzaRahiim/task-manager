const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Status name is required"],
            trim: true,
            maxlength: [50, "Status name cannot exceed 50 characters"],
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

statusSchema.index(
    { name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } },
);

module.exports = mongoose.model("Status", statusSchema);
