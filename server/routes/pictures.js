import express from "express";
import multer from "multer";
import { Picture } from "../models/index.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/picture", upload.single("image"), async (req, res) => {
  try {
    const { userId, order } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const picture = await Picture.create({
      userId: userId,
      value: req.file.buffer,
      order: order ?? 0,
    });

    res
      .status(200)
      .json({ message: "Picture saved!", pictureId: picture.id, order: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save picture" });
  }
});

router.get("/picture/:id", async (req, res) => {
  try {
    const picture = await Picture.findByPk(req.params.id);

    if (!picture) return res.status(404).json({ error: "Not found" });

    res.set("Content-Type", "image/png");
    res.send(picture.value); // Send binary image
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch picture" });
  }
});

export default router;
