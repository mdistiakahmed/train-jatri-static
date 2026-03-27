### **Instructions to Run the Script**

1.  **Use Node.js Version 20.11.0**  
    Ensure you are using **Node.js v20.11.0**. You can verify your version with the following command:
    
    `node -v` 
    
2.  **Install Project Dependencies**  
    Navigate to the project root directory and run:
    
    `npm install` 
    
3.  **Run the Train Name Finder Script (step 1)**  
    To extract all train names, run the following command:

    `node step-1-find-train-names.js` 
    
    -   Upon running, a **virtual browser window** (using Puppeteer or a similar library) will open and load the train details page.
        
    -   You can **manually navigate to another page and then return** to the train details page. This action helps ensure the virtual browser loads the required content properly.
        
    -   After the process completes, the script will automatically write the train names into a `trainNames.ts` file in the project directory.


4.  **Run the Each Train Details Finder Script (step 2)**  
    To extract each train details, run the following command:

    `node step-2-fetch-train-details.js` 
    

5.  **Run the Merge Train Details Script (step 3)**  
    To extract each train details, run the following command:

    `node step-3-finalize-train-details.js` 
    