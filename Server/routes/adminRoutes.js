import express from "express";
import { createAdmin, getStats } from "../controllers/adminController.js";

const router = express.Router();

router.post("/", createAdmin);
router.get("/stats", getStats);

export default router;
