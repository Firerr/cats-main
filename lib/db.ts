import mongoose from "mongoose";

const { MONGODB_URI = "mongodb://127.0.0.1/cats" } = process.env;
console.log("connecting db", MONGODB_URI);

const conn = mongoose
  .connect(MONGODB_URI)
  .then(function () {
    console.log("DB Connected");
  })
  .catch(function (error) {
    console.log('line check')
    console.log("Error connecting to DB", error);
  });

export default conn;

