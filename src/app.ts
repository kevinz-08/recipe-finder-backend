import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import routes from "./routes";

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// db connection
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

// rutas centralizadas aqui
app.use("/api", routes);

// health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// root
app.get("/", (req: Request, res: Response) => {
  res.send("API Running");
});

// server
app.listen(port, () => {
  console.log(`Server is Running on port: ${port}`);
});