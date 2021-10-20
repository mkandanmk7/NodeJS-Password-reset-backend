// require("dotenv").config();

const express = require("express");

const mongo = require("./Shared/mongo");

const app = express();

// IIFE here
(async () => {
  try {
    await mongo.connect(); //connection db

    app.use(express.json()); //parsing string to json

    app.use((req, res, next) => {
      console.log("User middleware called");
      next();
    });

    const PORT = 3001 || process.env.PORT;

    app.listen(PORT, () => console.log(`server running in port ${PORT}`));
  } catch (err) {
    console.log("err in connection");
  }
})();
