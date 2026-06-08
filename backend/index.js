import connectDB from "./db/db.js";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import messageRoutes from "./routes/message.routes.js";
import githubRoutes from "./routes/github.routes.js";
import userRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.set("trust proxy", 1);

const PORT = process.env.PORT || 8000;

const startserver = async () => {
  try {
    await connectDB();
    const server = createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("joinRoom", (projectId) => {
        socket.join(projectId);
        console.log(`User joined room: ${projectId}`);
      });

      socket.on("sendMessage", async (data) => {
        const { projectId, senderId, receiverId, content } = data;
        try {
          const message = await Message.create({
            projectId,
            senderId,
            receiverId,
            content,
          });
          io.to(projectId).emit("receiveMessage", message);
        } catch (error) {
          console.log("Error saving message:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
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
app.use("/api/github", githubRoutes);
app.use("/api/users", userRoutes);

startserver();
