import { Router } from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/book.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, (req, res, next) => {
  createBook(req, res).catch(next);
}); 

router.get("/books", authenticate, (req, res, next) => {
  getBooks(req, res).catch(next);
});

router.get("/books/:id", authenticate, (req, res, next) => {
  getBookById(req, res).catch(next);
});

router.put("/books/:id", authenticate, (req, res, next) => {
  updateBook(req, res).catch(next);
});

router.delete("/books/:id", authenticate, (req, res, next) => {
  deleteBook(req, res).catch(next);
});

export default router;
