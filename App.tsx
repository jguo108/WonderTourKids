import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import LandmarkDetails from './components/LandmarkDetails';
import LoadingScreen from './components/LoadingScreen';
import { AppState, LandmarkData } from './types';
import { loadModel, predictImage, getTopPrediction } from './services/classifierService';
import { fetchLandmarkDetails } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [landmarkData, setLandmarkData] = useState<LandmarkData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preload model on mount
  useEffect(() => {
    loadModel().catch(err => console.error("Model preload failed:", err));
  }, []);

  const handleImageSelected = async (file: File) => {
    try {
      // 1. Show image immediately
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageSrc(imageUrl);
      setAppState(AppState.ANALYZING_IMAGE);

      // Create an HTML Image Element for the classifier
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;
      
      // Wait for image to load before predicting
      await new Promise((resolve) => {
        imgElement.onload = resolve;
      });

      // 2. Classify Image
      const predictions = await predictImage(imgElement);
      const topPrediction = getTopPrediction(predictions);

      if (!topPrediction || topPrediction.probability < 0.6) {
        // Handle low confidence or no prediction
        throw new Error("I couldn't quite see what that was. Can you try getting closer?");
      }

      console.log(`Identified: ${topPrediction.className} (${Math.round(topPrediction.probability * 100)}%)`);

      // 3. Fetch Details
      setAppState(AppState.FETCHING_INFO);
      const data = await fetchLandmarkDetails(topPrediction.className);
      setLandmarkData(data);
      setAppState(AppState.RESULT);

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Something went wrong!");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.HOME);
    setSelectedImageSrc(null);
    setLandmarkData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-yellow-50 font-sans pb-8 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl transform -rotate-12">🗺️</div>
        <div className="absolute bottom-40 right-10 text-6xl transform rotate-12">🧭</div>
        <div className="absolute top-1/2 left-1/2 text-8xl transform -translate-x-1/2 -translate-y-1/2">🌍</div>
      </div>

      <div className="relative z-10">
        {appState !== AppState.RESULT && <Header />}

        <main className="container mx-auto">
          {appState === AppState.HOME && (
            <ImageUploader onImageSelected={handleImageSelected} />
          )}

          {appState === AppState.ANALYZING_IMAGE && (
            <LoadingScreen message="Looking at your photo..." />
          )}

          {appState === AppState.FETCHING_INFO && (
            <LoadingScreen message="Checking the guide book..." />
          )}

          {appState === AppState.RESULT && landmarkData && selectedImageSrc && (
            <LandmarkDetails 
              data={landmarkData} 
              imageSrc={selectedImageSrc} 
              onReset={handleReset} 
            />
          )}

          {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
              <div className="text-6xl mb-4">🙈</div>
              <h2 className="text-2xl font-bold text-red-500 mb-2">Uh oh!</h2>
              <p className="text-gray-600 text-lg mb-6 font-medium">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
