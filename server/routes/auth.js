import express from "express";
import { User } from "../models/index.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, contact, country } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use." });

    const newUser = await User.create({
      email,
      password,
      name,
      contact,
      country,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        contact: newUser.contact,
        country: newUser.country,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, password } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.status(200).json({ id: user.id });
});

export default router;
