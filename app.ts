import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.use("/api/register", require("./routes/register"));
app.use("/api/login", require("./routes/login"));
app.use("/api/user", authenticate, require("./routes/user"));
app.use("/api/todos", authenticate, require("./routes/todos"));
app.use("/api/refresh-token", require("./routes/refresh-token"));
app.use("/api/signout", require("./routes/signout"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is Running on port: ${port}`);
});