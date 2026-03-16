import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resume.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/resumes", resumeRoutes);
app.use("/api/auth", authRoutes);

export default app;
