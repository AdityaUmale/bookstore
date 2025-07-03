import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { readJSON, writeJSON } from "../utils/file.util";
import { User } from "../types/user.types";
import jwt from "jsonwebtoken";

const USERS_FILE = "src/data/users.json";

const jwtSecret = process.env.JWT_SECRET as string || "ksdjbkdjvbw23987193";
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Read all users
    const users: User[] = await readJSON<User>(USERS_FILE);

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    };

    // Save to users.json
    users.push(newUser);
    await writeJSON<User>(USERS_FILE, users);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    // Respond (avoid returning password)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("Error in register:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const users: User[] = await readJSON<User>(USERS_FILE);

        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (isPasswordValid) {
                // Generate JWT
                const token = jwt.sign(
                  { id: existingUser.id, email: existingUser.email },
                  jwtSecret,
                  { expiresIn: "1h" }
                );
                return res.status(200).json({
                    message: "Login successful",
                    user: {
                        id: existingUser.id,
                    },
                    token,
                })
            }
        }
        return res.status(401).json({
            message: "Invalid credentials"
        })
    } catch (err) {
        console.error("Error in login:", err);
        return res.status(500).json({ message: "Server error" });
    }
}