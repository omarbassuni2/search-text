import fs from "fs";
import { ROOT_DIRECTORY } from "../constants.js";
import { processJSONFile } from "../searchUtility.js";
import { querySchema } from "../searchValidation.js";

export const processJSONFileTest = async (query) => {
  const file = await fs
    .readdirSync(ROOT_DIRECTORY + "/search/test/data")
    .map((ele) => {
      if (ele.endsWith(".json"))
        return ROOT_DIRECTORY + "/search/test/data/" + ele;
    });
  return new Promise((resolve) => {
    processJSONFile(file, query, (resultArray) => {
      resolve(resultArray);
    });
  });
};

export const validateQuerySchemaTest = (query) => {
  const { error } = querySchema.validate(query);
  if (error) throw new Error(error.details[0].message);
  return "validation-success";
};
