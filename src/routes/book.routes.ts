import { Router } from "express";
import { createBook } from "../controllers/book.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, (req, res, next) => {
  createBook(req, res).catch(next);
}); // ✅ Protect the route

export default router;
