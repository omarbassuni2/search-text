import express from "express";
const router = express.Router();

import { search } from "./searchMiddleware.js";
import validateRequest from "./searchValidation.js";

router.get("/", validateRequest, search);

export default router;
