import * as tf from "@tensorflow/tfjs";
import { history } from "../storage/index";
import type { NormalizeFunction, DenormalizeFunction } from "../interfaces/index";

// Normalize lottery numbers (scaling from 1-38 to 0-1)
const normalize: NormalizeFunction = (data) =>
  data.map((set) => set.map((n) => (n - 1) / 37));

// Denormalize back to original range (1-38)
const denormalize: DenormalizeFunction = (data) =>
  data.map((n) => Math.round(n * 37 + 1));

// Convert lottery history into tensors
const tensorData = tf.tensor2d(normalize(history));

// Create a simple neural network
const model = tf.sequential();
model.add(tf.layers.dense({ units: 12, activation: "relu", inputShape: [6] }));
model.add(tf.layers.dense({ units: 6, activation: "sigmoid" }));
model.compile({ optimizer: "adam", loss: "meanSquaredError" });

/**
 * Train the model using historical lottery data.
 * After training, save the model for future use.
 */
export async function trainModel() {
  await model.fit(tensorData, tensorData, { epochs: 500 });
  console.log("Model training completed.");

  // Save trained model to file system
  await model.save("file://./models/lotteryModel");
}

/**
 * Load an existing trained model from storage.
 * If no model is found, return a new one.
 */
export async function loadModel() {
  try {
    const loadedModel = await tf.loadLayersModel("file://./models/lotteryModel/model.json");
    console.log("Model loaded successfully.");
    return loadedModel;
  } catch (error) {
    console.warn("No existing model found, training a new one...");
    return model;
  }
}

/**
 * Predict the next set of lottery numbers.
 * Uses the most recent lottery draw as input.
 */
export async function predictNumbers() {
  const trainedModel = await loadModel();

  // Normalize last lottery draw as input
  const lastDraw = normalize([history[history.length - 1]]),
    inputTensor = tf.tensor2d(lastDraw),
    outputTensor = trainedModel.predict(inputTensor) as tf.Tensor;

  // Convert tensor output to an array and denormalize
  const prediction = denormalize(Array.from(await outputTensor.data()));

  // Remove duplicates and return 6 unique numbers
  return [...new Set(prediction)].slice(0, 6);
}