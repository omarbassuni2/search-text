import express from "express";
import router from "./search/searchRoutes.js";
const app = express();

app.use("/", router)

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
