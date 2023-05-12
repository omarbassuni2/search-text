import fs from "fs";
import { formatQuery, processJSONFile } from "./searchUtility.js";
import { FOLDER_PATH, ROOT_DIRECTORY } from "./constants.js";

const search = async (req, res) => {
  try {
    const query = formatQuery(req.query);
    const files = await fs
      .readdirSync(ROOT_DIRECTORY + FOLDER_PATH)
      .map((ele) => ROOT_DIRECTORY + FOLDER_PATH + ele); // reads path of all json files inside data folder to be passed to our stream
    processJSONFile(files, query, (resultArray) => {
      res.json(resultArray);
    });
  } catch (error) {
    console.log("[search][index.js]: ", error);
    res.json({ status: 400, message: error.message });
  }
};

export { search };
