import { PredictionResult } from '../types';

// The Teachable Machine model URL provided by the user
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Tj9tR8HOa/";

let model: any = null;

// Helper to access the global tmImage object loaded via script tag
const getTmImage = () => (window as any).tmImage;

export const loadModel = async (): Promise<void> => {
  if (model) return;

  const tmImage = getTmImage();
  if (!tmImage) {
    throw new Error("Teachable Machine library not loaded");
  }

  const modelURL = MODEL_URL + "model.json";
  const metadataURL = MODEL_URL + "metadata.json";

  try {
    model = await tmImage.load(modelURL, metadataURL);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
    throw new Error("Failed to load the landmark recognizer. Please check your internet connection.");
  }
};

export const predictImage = async (imageElement: HTMLImageElement): Promise<PredictionResult[]> => {
  if (!model) {
    await loadModel();
  }

  try {
    const predictions = await model.predict(imageElement);
    // predictions is an array of objects { className: string, probability: number }
    // Sort by probability descending
    return predictions.sort((a: any, b: any) => b.probability - a.probability);
  } catch (error) {
    console.error("Prediction error:", error);
    throw new Error("Oops! Couldn't recognize that image.");
  }
};

export const getTopPrediction = (predictions: PredictionResult[]): PredictionResult | null => {
  if (!predictions || predictions.length === 0) return null;
  return predictions[0];
};
