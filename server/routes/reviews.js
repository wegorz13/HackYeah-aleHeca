// ...existing code...
import express from "express";
import { Review } from "../models/index.js";

const router = express.Router();

router.post("/review", async (req, res) => {
  const { authorId, receiverId, message, role, rating } = req.body;

  try {
    const review = await Review.create({
      authorId,
      receiverId,
      message,
      role,
      rating,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the review." });
  }
});

export default router;
// ...existing code...
