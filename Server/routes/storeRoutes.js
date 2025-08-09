import express from "express";
import { createStore, getStores } from "../controllers/storeController.js";

const router = express.Router();

router.post("/", createStore);
router.get("/", getStores);

export default router;
