import express from "express";
import { createStore, getStores } from "../controllers/storeController.js";

const router = express.Router();

// Matches GET /api/stores → used in frontend
router.get("/", getStores);
router.post("/", createStore);

export default router;
