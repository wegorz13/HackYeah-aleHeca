// ...existing code...
import express from "express";
import auth from "./auth.js";
import profiles from "./profiles.js";
import matches from "./matches.js";
import reviews from "./reviews.js";
import pictures from "./pictures.js";
import config from "./config.js";
import user from "../models/user.js";
import details from "./details.js";
const router = express.Router();

// Mount at root to preserve original endpoints
router.use(auth);
router.use(profiles);
router.use(matches);
router.use(reviews);
router.use(pictures);
router.use(config);
router.use(details);

export default router;
// ...existing code...
