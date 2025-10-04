import express from "express";
import { User } from "../models/index.js";

const router = express.Router();

router.get("/user/:id", async (req,res)=>{

    const profile = await User.findByPk(Number(req.params.id));
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);

});

export default router;