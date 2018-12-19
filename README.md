# CloudNews

## [GitHub page](https://antoncarlsson.github.io/cloudnews/)

## IMPORTANT:

Before committing for the first time on a new system, please run:

```
cd hooks
python -m pip install -r requirements.txt
chmod +x hook_setup.sh
./hook_setup.sh
```

in order to set up git hooks

ssh-working hell yeahhhh!!

## Database:

To correctly setup a database, you need to run a replica set and be connected to that. This can be done locally for development purposes using the run-rs npm package. To start it (given that mongodb service 4.0 or above is installed) run the following command (remember the datafolder is always relative the path you run from).
```
run-rs --keep --mongod --dbpath <path/to/data/folder> &
```
start the mongo-shell and make sure you use the database 'cloudnews' using 
```
 use cloudnews
```
create collection and index for each service: 
```
db.createCollection('articles_<service name>')
db.articles_<service name>.createIndex({url: 1}, {unique: true}) 
```
Create the collection for keeping track of previously scraped timespans and create unique index to avoid duplicates: 
```
db.createCollection('prefetched')
db.prefetched.createIndex({service: 1}, {unique: true}) 
```
Insert an entry for each service (name and case is important). 
```
db.prefetched.insert({service: '<service name>', timespans: []})
```
  
