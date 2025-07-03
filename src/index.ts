import express from "express";
import authRouter from "./routes/auth.routes";
import bookRouter from "./routes/book.routes";
import dotenv from "dotenv";
import { logger } from "./middleware/logger.middleware";

dotenv.config();

const app = express();

app.use(logger);
app.use(express.json());
app.use("/auth", authRouter);
app.use("/book", bookRouter);


app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
