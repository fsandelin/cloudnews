const express = require("express")
const moment = require("moment")

const app = express()

app.get("/api/article", (req, res) => {
    const article = {
        title: "Fake news",
        datetime: moment().toISOString(),
        lead: "This is fake news.",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        link: "http://www.google.se",
        img: "https://i.imgur.com/PpAEewg.jpg",
        region: "Uppsala"
    }
    res.json(article)
})

const port = 8080

app.listen(port, () => {
  console.log(`get-news-article listening on ${port}`)
})