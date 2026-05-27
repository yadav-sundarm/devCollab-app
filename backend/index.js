import connectDB from "./db/db.js";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const startserver = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", applicationRoutes);
app.use("/api", messageRoutes);

startserver();
