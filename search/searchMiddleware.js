import { FOLDER_PATH } from "./constants.js";
import { formatQuery, searchStream, streamFile } from "./searchUtility.js";

const search = async (req, res) => {
  try {
    const query = formatQuery(req.query); // I'm assuming that we are OR-ing our search result
    const data = await streamFile(FOLDER_PATH);
    const result = searchStream(data, query);
    res.json(result);
  } catch (error) {
    console.log("[search][index.js]: ", error);
    res.json({ status: 400, message: error.message });
  }
};

export { search };
