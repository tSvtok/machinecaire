const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/machinecare';
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch(err) {
        console.error('MongoDB connection error:', err.message);
    }
};

module.exports = connectDB;