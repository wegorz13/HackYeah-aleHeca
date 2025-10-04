// ...existing code...
import express from "express";
import { User } from "../models/index.js";

const router = express.Router();

router.get("/users", async (_req, res) => {
  const users = await User.findAll();
  res.json(users);
});

export default router;
// ...existing code...
