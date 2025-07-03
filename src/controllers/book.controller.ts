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


export const getBooks = async (req: AuthRequest, res: Response) => {
    try {
        const books: Book[] = await readJSON<Book>(BOOKS_FILE);
        const filteredBooks = books.filter((book) => book.userId === req.user!.id);
        res.status(200).json({ books });
    } catch (err) {
        console.error("Error in getBooks:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export const getBookById = async (req: AuthRequest, res: Response) => {
    try {
        const books: Book[] = await readJSON<Book>(BOOKS_FILE);
        const book = books.find((book) => book.id === req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ book });
    } catch (err) {
        console.error("Error in getBookById:", err);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateBook = async (req: AuthRequest, res: Response) => {
    try {
        const books: Book[] = await readJSON<Book>(BOOKS_FILE);
        const book = books.find((book) => book.id === req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        const { title, author, genre, publishedYear } = req.body;
        if (!title || !author || !genre || !publishedYear) {
            return res.status(400).json({ message: "All fields are required" });
        }
        book.title = title;
        book.author = author;
        book.genre = genre;
        book.publishedYear = publishedYear;
        await writeJSON<Book>(BOOKS_FILE, books);
        res.status(200).json({ message: "Book updated", book });
    } catch (err) {
        console.error("Error in updateBook:", err);
    }
}

export const deleteBook = async (req: AuthRequest, res: Response) => {
    try {
        const books: Book[] = await readJSON<Book>(BOOKS_FILE);
        const book = books.find((book) => book.id === req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        const filteredBooks = books.filter((book) => book.id !== req.params.id);
        await writeJSON<Book>(BOOKS_FILE, filteredBooks);
        res.status(200).json({ message: "Book deleted" });
    } catch (err) {
        console.error("Error in deleteBook:", err);
        res.status(500).json({ message: "Server error" });
    }
}