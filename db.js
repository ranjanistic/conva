const { MongoClient } = require("mongodb"),
  { DBURL, DBNAME } = require("./config");

var dbobj;
module.exports = {
  connectToDB: (callback) => 
    MongoClient.connect(
      DBURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (!err) dbobj = client.db(DBNAME);
        return callback(err, DBNAME);
      }
    ),
  Users: () => dbobj.collection("user"),
  Rooms: () => dbobj.collection("room")
};
