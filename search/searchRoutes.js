import express from "express";
const router = express.Router();

import { search } from "./searchMiddleware.js";

router.get("/", search);

export default router;
