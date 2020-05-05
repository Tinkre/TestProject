/* containing all queries where no specific recources and/or models need to use */
const express = require("express") // because we use express for the entire application
const router = express.Router() // router partion 

/* Import the books-module which is containing the handler for books */
const Book = require("../models/book")

/* handle the routes req is the actuall request of the route and res is the result we're sending back */
router.get("/", async (req, res) => {
    let books

    try {
        books = await Book.find().sort({ createAt: "desc" }).limit(10).exec()
    } catch (error) {
        books = []
    }
    res.render("index", {
        books: books
    }) // inputted the content of index.ejs in views folder into the layouts.ejs html (layout)

}) // get the very rout of our application (same like :3000)

module.exports = router // to use the specific router inside application (server.js)