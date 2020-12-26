const mongoose = require('mongoose');

exports.connectToDB = (URI) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true });

    mongoose.connection.once("open", () => {
      console.log("MongoDB database connection established successfully");
      resolve(mongoose.connection)
    });

    mongoose.connection.on("error", (err) => {
      console.error(err);
      reject(err);
    })
  })
};