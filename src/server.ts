// server.ts
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectToDatabase from './connection/db';
import authRoutes from './routes/authRoutes';

const app = express();

const PORT = process.env.PORT || 3000;

const uri:any= process.env.DB_URI
app.use(cors());
app.use(bodyParser.json());
// app.use(env.)

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use('/auth1', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

