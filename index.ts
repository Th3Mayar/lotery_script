import express from "express";
import { PrismaClient } from "@prisma/client";
import { trainModel, predictNumbers } from "./models/mlModel";
import type { PredictionResponse } from "./interfaces/index";

const app = express(),
  PORT = process.env.PORT || 3000,
  prisma = new PrismaClient();

// API ENDPOINT TO HOME
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Welcome to the lottery number prediction API!");
});

app.get("/predict", async (req: express.Request, res: express.Response) => {
  try {
    const numbers: number[] = await predictNumbers();

    // Save prediction in the database
    await prisma.lotteryResult.create({
      data: { numbers: numbers.join(",") }, // Store as comma-separated string
    });

    const response: PredictionResponse = { predictedNumbers: numbers };
    res.json(response);
  } catch (error) {
    console.error("Error generating prediction:", error);
    res.status(500).json({ error: "Failed to generate prediction" });
  }
});

// Start server after training
trainModel().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
});