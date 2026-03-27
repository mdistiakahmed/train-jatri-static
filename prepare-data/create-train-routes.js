import fs from "fs";
import path from "path";

async function createTrainRoutesArray() {
  const finalTrainDataDir = "D:\\train-jatri\\prepare-data\\Final_train_data";
  const outputFilePath = "D:\\train-jatri\\prepare-data\\train_routes.js"; // Output file

  const files = fs.readdirSync(finalTrainDataDir);
  const trainRoutes = {};

  for (const file of files) {
    if (file.endsWith(".js")) {
      const filePath = path.join(finalTrainDataDir, file);
      try {
        const { trainData } = await import(
          path.join("file:///", filePath.replace(/\\/g, "/"))
        );

        const forwardPath = trainData.forward.path;
        const reversePath = trainData.reverse.path;
        const forwardTrainName = trainData.forward.train_name;
        const reverseTrainName = trainData.reverse.train_name;

        // Add forward route
        if (forwardPath) {
          if (!trainRoutes[forwardPath]) {
            trainRoutes[forwardPath] = [];
          }
          trainRoutes[forwardPath].push(forwardTrainName);
        }

        // Add reverse route
        if (reversePath) {
          if (!trainRoutes[reversePath]) {
            trainRoutes[reversePath] = [];
          }
          trainRoutes[reversePath].push(reverseTrainName);
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }
  }

  const outputContent = `export const trainRoutes = ${JSON.stringify(
    trainRoutes,
    null,
    2
  )};`;
  fs.writeFileSync(outputFilePath, outputContent);
  console.log("trainRoutes.ts created successfully.");
}

createTrainRoutesArray();
