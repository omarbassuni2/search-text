import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const FOLDER_PATH = "/data/";

export const ROOT_DIRECTORY = join(__dirname, "..");
const CLINIC_NAME = "name";
const CLINIC_STATE_NAME = "stateName";
const CLINIC_TIME = "availability";

export const clinicsUnifiedNamesMap = {
  clinicName: CLINIC_NAME,
  stateCode: CLINIC_STATE_NAME,
  opening: CLINIC_TIME,
  name: CLINIC_NAME,
  stateName: CLINIC_STATE_NAME,
  availability: CLINIC_TIME,
};
