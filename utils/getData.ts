import { uniqueTrainNames } from "@/utils/trainNames";

export const getDataForStation = async (name: string) => {
  try {
    if (!name) {
        throw new Error(`No train name provided`);
    }
      const fileName = name; // normalize: "Upakul Express" → "upukulexpress"

      const { trainData } = await import(`../data/Stations/${fileName}.js`);

      return trainData;
  } catch (error) {
      console.error(`Failed to load train data for: ${name}`);
    throw error;
  }
};


export const getDataForRoute = async (route: string) => {
  try {
    if (!route) {
      throw new Error(`No route provided`);
    }

    // Convert route to match file name format (e.g., 'dhaka-to-brahmanbaria' -> 'dhaka_to_brahmanbaria')
    const fileName = route.toLowerCase().replace(/-/g, '_');
    
    try {
      // Use dynamic import with template literals
      const module = await import(`@/data/routes/${fileName}.js`);
      return { trainData: module.trainData };
    } catch (importError) {
      console.error(`Failed to import route data for ${route}:`, importError);
      throw new Error(`No data found for route: ${route}`);
    }
  } catch (error) {
    console.error('Error in getDataForRoute:', error);
    throw error;
  }
};

export const getDataForTrain = async (name: string) => {
  try {
    if (!name) {
      throw new Error(`No data file found for param: ${name}`);
    }

    const fileName = name.replace(/-/g, "_");

      console.log(fileName);

      const { trainData } = await import(`../data/train/${fileName}.js`);

      return trainData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSimilarTrains = async (currentTrainName: string, currentTrainData: any) => {
  const similarTrains = [];
  
  // Get current train's start and end stations for both directions
  const currentForwardStart = currentTrainData.forward?.routes[0]?.city;
  const currentForwardEnd = currentTrainData.forward?.routes[currentTrainData.forward.routes.length - 1]?.city;
  const currentReverseStart = currentTrainData.reverse?.routes[0]?.city;
  const currentReverseEnd = currentTrainData.reverse?.routes[currentTrainData.reverse.routes.length - 1]?.city;
  
  // Check all other trains
  for (const trainName of uniqueTrainNames) {
    if (trainName === currentTrainName.toUpperCase()) continue; // Skip current train
    
    try {
      const fileName = trainName.toLowerCase().replace(/\s+/g, "_");
      const { trainData } = await import(`../data/train/${fileName}.js`);
      
      // Check if this train has similar routes
      let isSimilar = false;
      let similarityType = '';
      
      // Check forward route similarity
      if (trainData.forward && currentForwardStart && currentForwardEnd) {
        const trainForwardStart = trainData.forward.routes[0]?.city;
        const trainForwardEnd = trainData.forward.routes[trainData.forward.routes.length - 1]?.city;
        
        if (trainForwardStart === currentForwardStart && trainForwardEnd === currentForwardEnd) {
          isSimilar = true;
          similarityType = 'forward';
        }
      }
      
      // Check reverse route similarity
      if (!isSimilar && trainData.reverse && currentReverseStart && currentReverseEnd) {
        const trainReverseStart = trainData.reverse.routes[0]?.city;
        const trainReverseEnd = trainData.reverse.routes[trainData.reverse.routes.length - 1]?.city;
        
        if (trainReverseStart === currentReverseStart && trainReverseEnd === currentReverseEnd) {
          isSimilar = true;
          similarityType = 'reverse';
        }
      }
      
      // Check opposite direction similarity
      if (!isSimilar && trainData.forward && currentForwardStart && currentForwardEnd) {
        const trainForwardStart = trainData.forward.routes[0]?.city;
        const trainForwardEnd = trainData.forward.routes[trainData.forward.routes.length - 1]?.city;
        
        if (trainForwardStart === currentForwardEnd && trainForwardEnd === currentForwardStart) {
          isSimilar = true;
          similarityType = 'opposite';
        }
      }
      
      if (isSimilar) {
        similarTrains.push({
          name: trainName,
          url: `/trains/${trainName.replace(/\s+/g, '-').toLowerCase()}`,
          path: similarityType === 'forward' ? trainData.forward?.path : 
                similarityType === 'reverse' ? trainData.reverse?.path :
                trainData.forward?.path,
          similarityType
        });
      }
    } catch (error) {
      // Skip if train data not found
      continue;
    }
  }
  
  return similarTrains;
};