const mongoose = require('mongoose');

// We expose a global configuration object to track if DB is connected
const dbConfig = {
    isConnected: false
};

const connectDB = async () => {
    try {
        console.log("Attempting MongoDB connection...");
        if (!process.env.MONGO_URI || process.env.MONGO_URI.trim() === '') {
             throw new Error("MONGO_URI is missing or empty.");
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        dbConfig.isConnected = true;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.warn("⚠️ FALLBACK ACTIVATED: Running in IN-MEMORY MOCK MODE for Hackathon continuous testing. Real database saves will NOT happen.");
        dbConfig.isConnected = false;
    }
};

module.exports = { connectDB, dbConfig };
