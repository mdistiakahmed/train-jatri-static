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