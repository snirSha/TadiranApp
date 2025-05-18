import express from 'express';
import connectDB from './config/mongoDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js';
import warrantyRoutes from './routes/warrantyRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import cors from 'cors';
import db from "./config/firebaseConfig.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());//gives access to the API from the mobile app

// Connect to MongoDB
connectDB();

//test the firebase connection
db.collection("test").add({ message: "Firebase connection works" })
    .then(() => console.log("Firebase is connected"))
    .catch((error) => console.error("Firebase failure:", error));

// Use authRoutes for authentication-related routes
app.use('/api/auth', authRoutes);

// Use userRoutes for user-related routes
app.use('/api/users', userRoutes);

// Use warrantyRoutes for warranty-related routes
app.use('/api/warranties', warrantyRoutes);

// Use the error-handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log('Server running on port 4000');
})
