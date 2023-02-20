import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.middleware';
import rootRouter from './routers/index.router';

mongoose.set('strictQuery', false);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);

app.use('/api', rootRouter);
app.use(errorMiddleware);

const port = process.env.PORT || 3030;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL).catch((error: Error) => {
      throw new Error(error.message);
    });
    app.listen(port, () => {
      console.log(`Server is running. PORT=${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
