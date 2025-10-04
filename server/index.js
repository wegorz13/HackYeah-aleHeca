import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { sequelize } from "./models/index.js";
import seedDatabase from "./seeders/index.js";
import cors from "cors";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Register all routes at root (keeps original endpoints like /users, /profiles, etc.)
app.use(routes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync({ force: true });
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`✅ Server running: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
