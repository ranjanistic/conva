const {MongoClient} = require('mongodb');

var dbobj;
module.exports = {
  connectToDB: (callback )=>{
    MongoClient.connect(
        `mongodb+srv://admin:mapple1205@user.dbmi7.mongodb.net/convaMeet?retryWrites=true&w=majority`,
        { useNewUrlParser: true , useUnifiedTopology: true}, ( err, client )=> {
            if(!err) dbobj = client.db("convaMeet");
            return callback( err,"convaMeet" );
        }
    );
  },
   Users: ()=>{
     return dbobj.collection("user");
   }
}