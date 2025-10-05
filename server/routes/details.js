import express from "express";
import { Picture, Profile, Review, User } from "../models/index.js";

const router = express.Router();

router.get("/user/:id", async (req, res) => {
  const profile = await User.findByPk(Number(req.params.id));
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json(profile);
});

router.get("/user/:id/profile", async (req, res) => {
  try {
    const userId = req.params.id;

    const profile = await Profile.findOne({
      where: { userId },
      include: [{ model: User, include: [Picture] }],
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const reviews = await Review.findAll({
      where: { receiverId: profile.id },
    });

    const avg =
      reviews.reduce((sum, it) => sum + it.rating, 0) / (reviews.length || 1);

    const profileResponse = {
      name: profile.User.name,
      age: profile.User.age,
      city: profile.city,
      pictures: profile.User.Pictures.map((pic) => pic.value),
      role: profile.role,
      traits: Array.isArray(profile.traits) ? profile.traits : [],
      averageRating: avg || 0,
      description: profile.description || "",
      country: profile.User.country || "",
    };

    res.status(200).json(profileResponse);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:userId/pictures", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId))
      return res.status(400).json({ error: "Invalid user ID" });

    const pictures = await Picture.findAll({
      where: { userId },
      attributes: ["id", "order"],
    });

    if (!pictures.length) {
      return res.status(404).json({ error: "No pictures found for this user" });
    }

    const pictureIds = pictures.map((pic) => ({
      id: pic.id,
      order: pic.order,
    }));

    res.json({ userId, pictureIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pictures" });
  }
});

export default router;
