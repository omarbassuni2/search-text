import fs from "fs";
import { ROOT_DIRECTORY, clinicsUnifiedNamesMap } from "./constants.js";

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

const streamFile = async (folderPath) => {
  try {
    let data = [];
    const files = fs.readdirSync(ROOT_DIRECTORY + folderPath);
    for (const file of files) {
      const json = fs.readFileSync(ROOT_DIRECTORY + folderPath + file, {
        encoding: "utf8",
        flag: "r",
      });
      data.push(JSON.parse(json));
    }
    return data.reduce((prev, curr) => prev.concat(curr), []);
  } catch (error) {
    console.log("[search][searchUtility.js] failed to streamFile\n", error);
  }
};

const searchStream = (data, query) => {
  try {
    const result = [];
    data.forEach((clinic) => {
      Object.keys(clinic).forEach((key) => {
        const unifiedKey = clinicsUnifiedNamesMap[key];
        if (!query[unifiedKey]) return;
        if (unifiedKey !== "availability" && query[unifiedKey] === clinic[key])
          result.push(clinic);
        else if (unifiedKey === "availability") {
          if (areDatesOverlapping(clinic[key], query[unifiedKey]))
            result.push(clinic);
        }
      });
    });
    return result;
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
export { streamFile, searchStream, formatQuery };
