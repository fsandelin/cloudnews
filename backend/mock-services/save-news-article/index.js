const express = require('express')
const parser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/'
const dbName = 'cloudnews_test'
const collectionName = 'articles_svt'

const app = express()
app.use(parser.json({extended: true}))
app.post("/api/article", (req, res, next) => {
    try {
        MongoClient.connect(url, function(err, client) {
            if (err) throw err
            const db = client.db(dbName)
            db.collection(collectionName).insertMany(req.body.articles, (err, res) => {
                if (err) throw err
                console.log("Articles added to database!")
                console.log(req.body.articles)
                client.close()
            })
        })
        res.sendStatus(200)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

const port = 8080

app.listen(port, () => {
  console.log(`save-news-article listening on ${port}`)
})
