// ...existing code...
import express from "express";
import { Op } from "sequelize";
import { Match, Profile, User, Picture, City } from "../models/index.js";
import { da } from "@faker-js/faker";

const router = express.Router();

// Like / confirm match
router.post("/like", async (req, res) => {
  try {
    const { likerRole, likerId, profileId } = req.body; // IDs are Profile IDs
    let match;
    if (likerRole === "traveller") {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      match = await Match.create({
        travellerId: likerId,
        mentorId: profileId,
        receivedPositive: false,
        expirationStamp: expirationDate,
      });
    } else if (likerRole === "mentor") {
      match = await Match.findOne({
        where: { travellerId: profileId, mentorId: likerId },
      });
      if (!match) return res.status(404).json({ error: "Match not found" });
      await match.update({ receivedPositive: true });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    return res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Get profiles of matched people for a given userId
router.get("/matches/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  try {
    const userProfiles = await Profile.findAll({ where: { userId } });
    const profileIds = userProfiles.map((p) => p.id);

    if (profileIds.length === 0) return res.json([]);

    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { mentorId: { [Op.in]: profileIds } },
          { travellerId: { [Op.in]: profileIds } },
        ],
      },
      include: [
        {
          model: Profile,
          as: "Traveller",
          include: [{ model: User, include: [Picture] }],
        },
        {
          model: Profile,
          as: "Mentor",
          include: [{ model: User, include: [Picture] }],
        },
      ],
    });

    const matchedProfiles = matches.map((m) =>
      profileIds.includes(m.mentorId) ? m.Traveller : m.Mentor
    );

    const response = matchedProfiles.map((p) => ({
      name: p.User.name,
      age: p.User.age,
      city: p.city,
      pictures: p.User.Pictures.map((pic) => pic.value),
      role: p.role,
      traits: Array.isArray(p.traits) ? p.traits : [],
      contact: p.User.contact,
      description: p.description || "",
      country: p.User.country || "",
      userId: p.userId,
      date: p.date || "",
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching matches.");
  }
});

export default router;
// ...existing code...
