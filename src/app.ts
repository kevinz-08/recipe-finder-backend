import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import registerRoutes from "./routes/register";
import loginRoutes from "./routes/login";
import refreshTokenRoutes from "./routes/refresh-token";
import signoutRoutes from "./routes/signout";
import userRoutes from "./routes/user";
import todosRoutes from "./routes/todos";

import authenticate from "./auth/authenticate";

dotenv.config();

const app = express();

const port: number = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

async function main(): Promise<void> {
  try {
    if (!process.env.DB_CONNECTION_STRING) {
      throw new Error("DB_CONNECTION_STRING is not defined");
    }

    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

main();

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/refresh-token", refreshTokenRoutes);
app.use("/api/signout", signoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/todos", todosRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is Running on port: ${port}`);
});