// ...existing code...
import express from "express";
import { Op } from "sequelize";
import {
  Profile,
  User,
  Picture,
  Review,
  City,
  Trait,
} from "../models/index.js";

const router = express.Router();

// List profiles
router.get("/profiles", async (_req, res) => {
  const profiles = await Profile.findAll();
  res.json(profiles);
});

router.get("/profiles/:id", async (req, res) => {
  const userId = req.params.id;
  const profiles = await Profile.findAll({
    where: { userId },
    include: { model: City },
  });

  if (!profiles) return res.status(404).send("Profile not found");

  let profilesResponse = profiles.map((profile) => ({
    profile: {
      id: profile.id,
      role: profile.role,
      cityId: profile.cityId,
      trait_ids: profile.trait_ids,
    },
    city: profile.City ? profile.City.name : null,
  }));

  res.json(profilesResponse);
});

// Check by userId + cityId
router.get("/profiles/check", async (req, res) => {
  const userId = Number(req.query.userId);
  const cityId = Number(req.query.cityId);

  const profile = await Profile.findOne({
    where: { userId, cityId },
  });

  if (!profile) return res.status(404).send("Profile not found");
  res.json(profile.id);
});

// Search opposite role in same city, return enriched profiles
router.get("/profiles/search", async (req, res) => {
  try {
    const profileArg = req.query.profile ? JSON.parse(req.query.profile) : null;
    if (!profileArg)
      return res.status(400).json({ message: "Missing profile query param" });

    const oppositeRole =
      profileArg.role === "traveller" ? "mentor" : "traveller";

    const profiles = await Profile.findAll({
      where: { role: oppositeRole, cityId: profileArg.cityId },
      include: [{ model: User, include: [Picture] }, { model: City }],
    });

    const profileIds = profiles.map((p) => p.id);

    const reviews = await Review.findAll({
      where: { receiverId: { [Op.in]: profileIds } },
    });

    const traits = await Trait.findAll();
    const traitMap = new Map(traits.map((t) => [t.id, t.name]));

    const profileResponse = profiles.map((p) => {
      const r = reviews.filter((rv) => rv.receiverId === p.id);
      const avg = r.reduce((sum, it) => sum + it.rating, 0) / (r.length || 1);

      return {
        name: p.User.name,
        age: p.User.age,
        city: p.City?.name,
        pictures: p.User.Pictures.map((pic) => pic.value),
        role: p.role,
        traits: Array.isArray(p.trait_ids)
          ? p.trait_ids.map((id) => traitMap.get(id)).filter(Boolean)
          : [],
        averageRating: avg || 0,
      };
    });

    res.json(profileResponse);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to search profiles" });
  }
});

// Create profile
router.post("/profiles", async (req, res) => {
  const { userId, cityId, role, trait_ids } = req.body;
  try {
    const profile = await Profile.create({ userId, cityId, role, trait_ids });
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the profile." });
  }
});

export default router;
// ...existing code...
