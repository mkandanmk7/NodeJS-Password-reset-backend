require("dotenv").config();

const cors = require("cors");

const express = require("express");

const mongo = require("./Shared/mongo");

const userRoute = require("./Routes/users.routes");
const resetRoute = require("./Routes/resetPass.routes");

const app = express();

// IIFE here
(async () => {
  try {
    await mongo.connect(); //connection db

    app.use(cors());

    app.use(express.json()); //parsing string to json

    app.use((req, res, next) => {
      console.log("User middleware called");
      next();
    });

    //routes
    app.use("/users", userRoute);

    app.use("/resetpassword", resetRoute);

    const port = process.env.PORT || 3001;

    app.listen(port, () => console.log(`server running in port ${port}`));
  } catch (err) {
    console.log("err in connection");
  }
})();
