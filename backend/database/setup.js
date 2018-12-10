host = 'localhost';
port = '27017';

connection = new Mongo(`${host}:${port}`);
db = connection.getDB('cloudnews');

collections = db.getCollectionNames();

db.createCollection('prefetched');
db.createCollection('articles_svt');
db.createCollection('articles_polisen');

db.prefetched.createIndex({service: 1}, {unique:true});
db.articles_svt.createIndex({url: 1}, {unique:true});
db.articles_polisen.createIndex({url: 1}, {unique:true});

db.prefetched.insert({service: 'polisen', timespans: []});
db.prefetched.insert({service: 'svt', timespans: []});


collections = db.getCollectionNames();;
print(collections);