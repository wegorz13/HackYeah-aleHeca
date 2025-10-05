import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import seedDatabase from "./seeders/index.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors());
app.use(routes);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} registered`);
  });

  socket.on("private_message", ({ senderId, receiverId, content }) => {
    const receiverSocket = onlineUsers[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("private_message", { senderId, content });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of Object.entries(onlineUsers)) {
      if (id === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({ force: true });
    await seedDatabase();
    server.listen(PORT, () => {
      console.log(`✅ Server running: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
