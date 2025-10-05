import express from "express";
import { Op } from "sequelize";
import { Profile, User, Picture, Review, Match } from "../models/index.js";

const router = express.Router();

// List profiles
router.get("/profiles", async (_req, res) => {
  const profiles = await Profile.findAll({
    include: [{ model: User, include: [Picture] }],
  });
  const reviews = await Review.findAll();

  const profileResponse = profiles.map((p) => {
    const r = reviews.filter((rv) => rv.receiverId === p.id);
    const avg = r.reduce((sum, it) => sum + it.rating, 0) / (r.length || 1);

    return {
      name: p.User.name,
      age: p.User.age,
      city: p.city,
      pictures: p.User.Pictures.map((pic) => pic.value),
      role: p.role,
      traits: Array.isArray(p.traits) ? p.traits : [],
      averageRating: avg || 0,
      description: p.description || "",
      country: p.User.country || "",
      date: p.date || "",
    };
  });

  res.status(200).json(profileResponse);
});

// Check by userId + cityId
router.get("/profiles/check", async (req, res) => {
  const userId = Number(req.query.userId);
  const city = Number(req.query.city);

  const profile = await Profile.findOne({
    where: { userId, city },
  });

  if (!profile) return res.status(404).send("Profile not found");
  res.json(profile.id);
});

// Search opposite role in same city, return enriched profiles
router.get("/profiles/search", async (req, res) => {
  try {
    const { city, role, profileId } = req.query;

    if (!city || !role || !profileId)
      return res.status(400).json({ message: "Missing profile query param" });

    let profiles = null;

    //mentos look:
    if (role == "mentor") {
      const matches = await Match.findAll({
        where: { mentorId: profileId, receivedPositive: false },
        attributes: ["travellerId"],
      });

      const travellersList = matches.map((m) => m.travellerId);
      console.log(travellersList);
      profiles = await Profile.findAll({
        where: { userId: { [Op.in]: travellersList }, city: city },
        include: [{ model: User, include: [Picture] }],
      });
      console.log("Found mentor profiles:");
      console.log(profiles);
    } else {
      profiles = await Profile.findAll({
        where: { role: "mentor", city: city },
        include: [{ model: User, include: [Picture] }],
      });
      console.log("Found traveller profiles:");
      console.log(profiles);
    }

    const profileIds = profiles.map((p) => p.id);

    const reviews = await Review.findAll({
      where: { receiverId: { [Op.in]: profileIds } },
    });

    const profileResponse = profiles.map((p) => {
      const r = reviews.filter((rv) => rv.receiverId === p.id);
      const avg = r.reduce((sum, it) => sum + it.rating, 0) / (r.length || 1);

      return {
        name: p.User.name,
        age: p.User.age,
        city: p.city,
        pictures: p.User.Pictures.map((pic) => pic.id),
        role: p.role,
        traits: Array.isArray(p.traits) ? p.traits : [],
        averageRating: avg || 0,
        description: p.description || "",
        country: p.User.country || "",
        date: p.date || "",
      };
    });

    res.status(200).json(profileResponse);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to search profiles" });
  }
});

// Create profile
router.post("/profiles", async (req, res) => {
  const { userId, city, role, traits, description, date } = req.body; // traits are names now
  try {
    const profile = await Profile.create({
      userId,
      city,
      role,
      traits, // store names directly
      description,
      date,
    });
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the profile." });
  }
});

router.get("/profiles/:id", async (req, res) => {
  const userId = req.params.id;
  const profiles = await Profile.findAll({
    where: { userId: userId },
  });

  if (!profiles) return res.status(404).send("Profile not found");

  let profilesResponse = profiles.map((profile) => ({
    id: profile.id,
    role: profile.role,
    city: profile.city,
    traits: profile.traits || [],
    description: profile.description,
    date: profile.date || "",
  }));

  res.json(profilesResponse);
});

export default router;
