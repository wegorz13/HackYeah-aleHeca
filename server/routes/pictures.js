// ...existing code...
import express from "express";
import multer from "multer";
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

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/pictures
router.post("/pictures", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const picture = await Picture.create({
      userId: userId,
      value: req.file.buffer,
    });

    res.status(201).json({ message: "Picture saved!", pictureId: picture.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save picture" });
  }
});

export default router;
// ...existing code...
