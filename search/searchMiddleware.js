import { searchStream, streamFile } from "./searchUtility.js";

const search = (req, res) => {
  try {
    const folderPath = "/data/";
    const json = streamFile(folderPath);
    // const result = searchStream(json);
    res.send("result");
  } catch (error) {
    console.log("[search][index.js]: ", error);
  }
};

export { search };
