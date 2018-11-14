var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/college";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var myStudent = [
        { name: 'Rohit', address: 'Magnet Brains Bhopal'},
        { name: 'Jai', address: 'Area Colony'},
        { name: 'Roy', address: 'Ashoka Garden'},
        { name: 'Rocky', address: 'MP Nagar'}
      ];
    db.collections("students").insertMany(myStudent, function (err, result) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        db.close();
    });

});