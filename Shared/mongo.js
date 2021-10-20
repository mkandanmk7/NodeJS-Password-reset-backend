const { MongoClient } = require("mongodb");

const URL = "mongodb://localhost:27017";
const DB_NAME = "password";
// const URL = process.env.URL;
// const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(URL);
// console.log(URL);

module.exports = {
  db: null,
  user: null,

  async connect() {
    await client.connect(); // obj function from db driver
    console.log("mongo db connected using driver", URL);

    this.db = client.db(DB_NAME);
    console.log("DB selected ", DB_NAME);
    this.user = this.db.collection("register");
  },
};
