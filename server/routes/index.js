// ...existing code...
import express from "express";
import users from "./users.js";
import profiles from "./profiles.js";
import matches from "./matches.js";
import reviews from "./reviews.js";
import pictures from "./pictures.js";
import auth from "./auth.js";

const router = express.Router();

// Mount at root to preserve original endpoints
router.use(users);
router.use(profiles);
router.use(matches);
router.use(reviews);
router.use(pictures);
router.use(auth);

export default router;
// ...existing code...
