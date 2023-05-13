import { expect } from "chai";
import { searchStream, formatQuery } from "../searchUtility.js";
import {
  formattedQueryObject,
  listOfClinics,
  rawQueryObject,
} from "./search.stub.js";
import {
  processJSONFileTest,
  validateQuerySchemaTest,
} from "./searchTestHelper.js";

describe("Search Module", () => {
  describe("when searchStream gets called", () => {
    it("It should return a valid answer for valid clinics and valid query and the query matches the clinic", () => {
      const result = [];
      listOfClinics().forEach((c) => {
        const clinic = searchStream(c, formattedQueryObject());
        if (clinic) result.push(c);
      });
      expect(result).to.deep.equal([
        {
          name: "Hopkins Hospital Baltimore",
          stateName: "Florida",
          availability: {
            from: "07:00",
            to: "22:00",
          },
        },
      ]);
    });
    it("It should return empty array for valid clinics and valid query but the query doesn't match anything", () => {
      const query = formattedQueryObject();
      query["name"] = "invalid name";
      const result = [];
      listOfClinics().forEach((c) => {
        const clinic = searchStream(c, query);
        if (clinic) result.push(c);
      });
      expect(result).to.deep.equal([]);
    });
    it("It should return all clinics for valid clinics and empty query", () => {
      const result = [];
      listOfClinics().forEach((c) => {
        const clinic = searchStream(c, {});
        if (clinic) result.push(c);
      });
      expect(result).to.deep.equal(listOfClinics());
    });
    it("It should return empty array for invalid clinics and valid query", () => {
      expect(searchStream([], formattedQueryObject())).to.deep.equal([]);
    });
    it("It should return empty array for invalid clinics and invalid query", () => {
      expect(searchStream([], {})).to.deep.equal([]);
    });
  });
  describe("when formatQuery gets called", () => {
    it("It should return a formatted query for raw query", () => {
      const toBeEqual = formattedQueryObject();
      delete toBeEqual["availability"];
      const query = rawQueryObject();
      delete query["availability"];
      expect(formatQuery(query)).to.deep.equal(toBeEqual);
    });
    it("It should convert the field names to unified field names and return valid formatted query for valid raw query", () => {
      // this is a mix of both clinics' names
      const obj = {
        name: "Hopkins Hospital Baltimore",
        stateCode: "Florida",
      };
      const toBeEqual = formattedQueryObject();
      delete toBeEqual["availability"];
      expect(formatQuery(obj)).to.deep.equal(toBeEqual);
    });
    it("It should return empty object for empty raw query", () => {
      expect(formatQuery({})).to.deep.equal({});
    });
    it("It should return empty object for wrong raw query fields", () => {
      expect(
        formatQuery({
          name123: "name-value",
          availability1231: '["10:00", "11:00"]',
          state12312: "state",
        })
      ).to.deep.equal({ undefined: "state" });
    });
  });
  describe("when validateQuerySchemaTest gets called", () => {
    it("should not return nor throw anything for valid raw query", () => {
      const validRawQuery = rawQueryObject();

      let thrownError;
      try {
        const result = validateQuerySchemaTest(validRawQuery);
        expect(result).to.equal("validation-success");
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.undefined;
    });

    it("should throw an error for empty raw query object", () => {
      const emptyRawQuery = {};

      let thrownError;
      try {
        validateQuerySchemaTest(emptyRawQuery);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an("Error");
      expect(thrownError.message).to.equal(
        '"value" must contain at least one of [clinicName, stateName, availability]'
      );
    });

    it("should throw an error for non valid field in raw query", () => {
      const query = rawQueryObject();
      delete query["clinicName"];
      query["non-valid-field"] = "any-value";

      let thrownError;
      try {
        validateQuerySchemaTest(query);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an("Error");
      expect(thrownError.message).to.equal('"non-valid-field" is not allowed');
    });

    it("should throw an error for raw query having more than 3 fields", () => {
      const query = rawQueryObject();
      query["non-valid-field"] = "any-value";

      let thrownError;
      try {
        validateQuerySchemaTest(query);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an("Error");
      expect(thrownError.message).to.equal('"non-valid-field" is not allowed');
    });

    it("should throw an error for wrong clinicName input type", () => {
      const query = { clinicName: 1231213 };

      let thrownError;
      try {
        validateQuerySchemaTest(query);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an("Error");
      expect(thrownError.message).to.equal('"clinicName" must be a string');
    });

    it("should not return nor throw an error for a valid clinicName value", () => {
      const query = { clinicName: "Good Health Home" };
      expect(validateQuerySchemaTest(query)).to.equal("validation-success");
    });

    it("should throw an error for wrong stateName input type", () => {
      const query = { stateName: 1231213 };

      let thrownError;
      try {
        validateQuerySchemaTest(query);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an("Error");
      expect(thrownError.message).to.equal('"stateName" must be a string');
    });

    it("It should not return nor throw an error for a valid stateName value", () => {
      expect(validateQuerySchemaTest({ stateName: "Florida" })).to.equal(
        "validation-success"
      );
    });
    it("should throw an error for wrong availability input type", () => {
      const query = { availability: "[1231213]" };

      let thrownError;
      try {
        validateQuerySchemaTest(query);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).to.be.an("Error");
      expect(thrownError.message).to.equal(
        '"availability" with value "[1231213]" fails to match the required pattern: /^\\["([01]\\d|2[0-3]):[0-5]\\d", "([01]\\d|2[0-3]):[0-5]\\d"\\]$/'
      );
    });
    it("It should not return nor throw an error for a valid availability value", () => {
      expect(
        validateQuerySchemaTest({ availability: '["10:00", "20:59"]' })
      ).to.equal("validation-success");
    });
  });
  describe("when processJSONFile gets called", () => {
    it("It should not throw any error and return all data in json (input: empty formatted query)", async () => {
      const finalResult = await processJSONFileTest({});
      expect(finalResult).to.deep.equal(listOfClinics());
    });
    it("It should not throw any error and return a certain clinic in json (input: formatted query)", async () => {
      const finalResult = await processJSONFileTest(formattedQueryObject());
      expect(finalResult).to.deep.equal([
        {
          name: "Hopkins Hospital Baltimore",
          stateName: "Florida",
          availability: { from: "07:00", to: "22:00" },
        },
      ]);
    });
    it("It should not throw any error and return an empty list (input: formatted query that matches nothing)", async () => {
      const finalResult = await processJSONFileTest({
        name: "name-value",
        availability: '["10:00", "11:00"]',
        state: "state",
      });
      expect(finalResult).to.deep.equal([]);
    });
  });
});
