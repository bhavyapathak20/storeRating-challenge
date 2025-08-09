import express from "express";
import { createOrUpdateRating, getStoreRatings, getUserRatings } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", createOrUpdateRating);
router.get("/store/:storeId", getStoreRatings);
router.get("/user/:userId", getUserRatings);

export default router;
