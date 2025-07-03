import { Request, Response } from "express";
import { Book } from "../types/book.types";
import { readJSON, writeJSON } from "../utils/file.util";
import { v4 as uuidv4 } from "uuid";

const BOOKS_FILE = "src/data/books.json";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, author, genre, publishedYear } = req.body;

    if (!title || !author || !genre || !publishedYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const books = await readJSON<Book>(BOOKS_FILE);

    const newBook: Book = {
      id: uuidv4(),
      title,
      author,
      genre,
      publishedYear,
      userId: req.user!.id, // 🔥 This line now works
    };

    books.push(newBook);
    await writeJSON<Book>(BOOKS_FILE, books);

    res.status(201).json({ message: "Book created", book: newBook });
  } catch (err) {
    console.error("Error in createBook:", err);
    res.status(500).json({ message: "Server error" });
  }
};
