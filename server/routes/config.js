import express from "express";
import { City } from "../models/index.js";
import { Trait } from "../models/index.js";
import { Country } from "../models/index.js";

const router = express.Router();

router.get("/cities", async (req, res) => {
  const cities = await City.findAll();
  res.json(cities);
});

router.get("/countries", async (req, res) => {
  const countries = await Country.findAll();
  res.json(countries);
});

router.get("/traits", async (req, res) => {
  const traits = await Trait.findAll();
  res.json(traits);
});

export default router;
