import express from "express";
import authRouter from "./routes/auth.routes";
import bookRouter from "./routes/book.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();


app.use(express.json());
app.use("/auth", authRouter);
app.use("/book", bookRouter);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
