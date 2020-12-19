const mongoose = require('mongoose');

var _db;

exports.connectToServer = (URL) => {

  mongoose.set('useFindAndModify', false);
  mongoose.connect(URL, {}, (err) => {
    if (err)
      console.error(err);
    else {
      _db = mongoose.connection;
      _db.on('error', () => {
        console.error('> error occurred from the database');
      });
      _db.once('open', () => {
        console.log('> successfully opened the database');
      });
      return _db;
    }
  });

};

exports.getDb = () => {
  return _db;
};
