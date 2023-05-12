import fs from "fs";
import { ROOT_DIRECTORY } from "./constants.js";

async function streamFile(folderPath) {
  try {
    const jsons = [];
    const files = fs.readdirSync(ROOT_DIRECTORY + folderPath);
    console.log(files);
    for (const file in files) {
      const json = fs.readFileSync(file);
      jsons.push(json);
    }
    console.log(jsons);
    return jsons;
  } catch (error) {
    console.log("[search][searchUtility.js]", error);
  }
}

const searchStream = async () => {
  try {
  } catch (error) {}
};
export { streamFile, searchStream };
