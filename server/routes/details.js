import express from "express";
import { Picture, User } from "../models/index.js";

const router = express.Router();

router.get("/user/:id", async (req,res)=>{

    const profile = await User.findByPk(Number(req.params.id));
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);

});



// GET /api/users/:userId/pictures
router.get("/users/:userId/pictures", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });


    const pictures = await Picture.findAll({
      where: { userId },
      attributes: ["id"], // only select the IDs
    });

    if (!pictures.length) {
      return res.status(404).json({ error: "No pictures found for this user" });
    }

    // Map results to an array of IDs
    const pictureIds = pictures.map((pic) => pic.id);

    res.json({ userId, pictureIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pictures" });
  }
});




export default router;