export interface LandmarkData {
  name: string;
  history: string;
  funFacts: string[];
  architecture: string;
  visitInfo: string;
}

export enum AppState {
  HOME = 'HOME',
  ANALYZING_IMAGE = 'ANALYZING_IMAGE',
  FETCHING_INFO = 'FETCHING_INFO',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export enum InfoTab {
  HISTORY = 'History',
  FUN_FACTS = 'Fun Facts',
  ARCHITECTURE = 'Architecture',
  VISIT = 'Visit Info'
}

export interface PredictionResult {
  className: string;
  probability: number;
}
