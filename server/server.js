const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDB } = require('./mongoose');
const followersRoutes = require('./routes/followersRoutes');

const app = express();
const port = process.env.PORT || 3000;
const DB_URI = "mongodb://localhost:27017/test";



// ====== Connect Mongo ========
connectToDB(DB_URI);

// ======== CORS Policy =======
const whitelist = ['http://127.0.0.1:3001', 'http://localhost:3001'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 // Allow if origin found in whitelist
      || !origin) { // or a REST tool (postman) is being used or same origin.
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS ' + origin));
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS policy
app.all('*', cors(corsOptions), function (req, res, next) {
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/followersDifference', followersRoutes);

app.listen(port, () => {
  console.log('Express Listening at http://localhost:' + port);
});
