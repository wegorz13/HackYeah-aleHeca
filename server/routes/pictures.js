// ...existing code...
import express from "express";
import { Picture } from "../models/index.js";

const router = express.Router();

router.post("/picture", async (req, res) => {
  const { userId, value } = req.body;
  try {
    const picture = await Picture.create({ userId, value });
    res.status(201).json(picture);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while uploading the picture." });
  }
});

export default router;
// ...existing code...
