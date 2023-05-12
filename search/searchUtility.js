import fs from "fs";
import { ROOT_DIRECTORY, clinicsUnifiedNamesMap } from "./constants.js";
import JSONStream from "JSONStream";

const formatQuery = (rawQuery) => {
  const formattedQuery = {};
  Object.keys(rawQuery).forEach((key) => {
    const unifiedKey = clinicsUnifiedNamesMap[key];
    formattedQuery[unifiedKey] = rawQuery[key];
  });
  if (formattedQuery["availability"]) {
    formattedQuery["availability"] = JSON.parse(formattedQuery["availability"]);
    formattedQuery["availability"][0] = new Date().setHours(
      ...formattedQuery["availability"][0].split(":")
    );
    formattedQuery["availability"][1] = new Date().setHours(
      ...formattedQuery["availability"][1].split(":")
    );
    if (formattedQuery["availability"][0] > formattedQuery["availability"][1])
      throw new Error(
        "[search][searchUtility.js] first date can't be bigger than second date"
      );
  }
  return formattedQuery;
};

const searchStream = (clinic, query) => {
  try {
    let isMatching = true;
    Object.keys(clinic).forEach((key) => {
      const unifiedKey = clinicsUnifiedNamesMap[key];
      if (!query[unifiedKey]) return;
      if (unifiedKey !== "availability")
        isMatching = isMatching && query[unifiedKey] === clinic[key];
      else if (unifiedKey === "availability")
        isMatching =
          isMatching && areDatesOverlapping(clinic[key], query[unifiedKey]);
    });
    return isMatching ? clinic : undefined;
  } catch (error) {
    console.log("[search][searchUtility.js] failed to searchStream\n", error);
  }
};

const areDatesOverlapping = (date, queryDate) => {
  try {
    const clinicFrom = new Date().setHours(...date["from"].split(":"));
    const clinicTo = new Date().setHours(...date["to"].split(":"));

    const isOverlapping =
      (queryDate[0] >= clinicFrom && queryDate[0] <= clinicTo) ||
      (queryDate[1] >= clinicFrom && queryDate[1] <= clinicTo)
        ? true
        : false;
    return isOverlapping;
  } catch (error) {
    console.log("[search][searchUtility.js] failed to convertDates\n", error);
  }
};

const processJSONFile = (files, query, callback) => {
  const resultArray = [];
  let fileCount = files.length;
  let processedFiles = 0;

  files.forEach((file) => {
    const stream = fs.createReadStream(file, { encoding: "utf8" });
    const jsonStream = JSONStream.parse("*");

    jsonStream.on("data", (obj) => {
      const clinic = searchStream(obj, query);
      clinic && resultArray.push(clinic);
    });

    jsonStream.on("end", () => {
      processedFiles++;
      if (processedFiles === fileCount) {
        callback(resultArray);
      }
    });

    stream.pipe(jsonStream);
  });
};

export { searchStream, formatQuery, processJSONFile };
