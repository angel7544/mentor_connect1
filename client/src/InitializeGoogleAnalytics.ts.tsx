// src/InitializeGoogleAnalytics.ts
import ReactGA from "react-ga4";

const TRACKING_ID = 'G-9PQ5EC0N0X';
const InitializeGoogleAnalytics = () => {
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
  } else {
    console.error("GA Measurement ID is not defined");
  }
};

export default InitializeGoogleAnalytics;