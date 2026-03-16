import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

const port = process.env.PORT

const startServer = async ()=>{
  try {
    await connectDB();
  app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
  })
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();

