const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4,
            ssl: true,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        console.error("Full error:", error);
        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    console.log("🟢 Mongoose connected to MongoDB Atlas");
});

mongoose.connection.on("error", (error) => {
    console.error("🔴 Mongoose connection error:", error);
});

mongoose.connection.on("disconnected", () => {
    console.log("🟡 Mongoose disconnected");
});

module.exports = connectDB;
