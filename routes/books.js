/* containing quieries of books handling */
const express = require("express") // because we use express for the entire application
const router = express.Router() // router partion 

/* Import the books-module which is containing the handler for books */
const Book = require("../models/book")

/* Import the authors-module which is containing the handler for authors */
const Author = require("../models/author")

/* Import the multer-module which is used to include files inside our filesystem */
/* const multer = require("multer")
const path = require("path")
const uploadPath = path.join("public", Book.coverImageBasePath) // concatenate theese both strings
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]
const upload = multer({ // configure multer
    dest: uploadPath,
    fileFilter: (req,file,callback) => { // the file filter is a complex function
        callback(null, imageMimeTypes.includes(file.mimetype)) //only accept define mimetypes
    }
}) 
const fs = require("fs") // using this package to get access to filesystem which allows to delete a file
*/ //not longer nedd because filepond is using and response a binary64 crypted file as string

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]


// handle all the routes of "/books" req is the actuall request of the route and res is the result we're sending back
router.get("/", async (req, res) => {

    let query = Book.find()
    if (req.query.title != null && req.query.title != "") {
        query = query.regex("title", new RegExp(req.query.title, "i")) //first value compare the database value
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
        query = query.lte("publishDate", req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query = query.gte("publishDate", req.query.publishedAfter)
    }

    /* get books parameters */
    try {
        const books = await query.exec()
        res.render("books/index", {
            books: books,
            searchOptions: req.query
        })
    } catch (error) {
        res.redirect("/")
    }
}) // get the very rout of our books (same like /books)


// new book page
router.get("/new", async (reg, res) => {
    renderNewPage(res, new Book())
})

// show book by id
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate("author") //populate attempt to include all the object parameters inside call
            .exec() 
        res.render("books/show", {
            book: book
        })
    } catch (error) {
        console.log(error);
        
        res.redirect("/")
    }
})

// edit book by id
router.get("/:id/edit", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch (error) {
        res.redirect("/")
    }
    
    
    
})

// route to create a new Book using post command  (rest) for creation
//obsolete because change to filepond library: router.post("/", upload.single('cover'), async (req, res) => {
router.post("/", async (req,res) => { 

    /* creating a book constant and fill it with the values in request body */
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)
    /* saving the new created book */
    try {
        const newBook = await book.save()
        res.redirect(`books/${book.id}`) // with ` ` also variables can be included `${variable.name}`
    } catch (error) {
        renderNewPage(res, book, true)
    }
})

/* Update book  */
router.put("/:id", async (req,res) => { 
    let book
    
    /* saving the new created book */
    try {
        /* load book and change parameters like setted by user */
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.description = req.body.description
        book.pageCount = req.body.pageCount
        if (req.body.cover != null && req.body.cover !== "") {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`) // with ` ` also variables can be included `${variable.name}`
    } catch (error) {
        console.log(error);
        
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            res.redirect("/")
        }
        
    }
})

/* delete books page */
router.delete("/:id", async (req,res) =>{
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect("/books")
    } catch (error) {
        if (book != null) {
            res.render("books/show", {
                book: book,
                errorMessage: "could not remove book"
            })
        } else {
            res.redirect("/")
        }
    }
})

// update book route
router.put("/:id", async (req, res) => {
    let book
    
    /* saving the new created book */
    try {
        book = await book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.authorid
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== "") {
            saveCover(book, req.body.cover)
        }
        res.redirect(`/books/${book.id}`) // with ` ` also variables can be included `${variable.name}`
    } catch (error) {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName) // if an error appear but the file was created, delete the file
        }        
        renderNewPage(res, book,"new", true)
    }
})

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, "new", hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, "edit", hasError)
    
}

async function renderFormPage(res, book, form, hasError = false){ 
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors, //all authors
            book: book // a new instance of a book
        } //create parameters for rendering

        if (hasError) {
            if (form === "edit") {
                params.errorMessage = "Error updating Book"
            } else {
                params.errorMessage = "Error creating Book"
            }
            
        }
        res.render(`books/${form}`, params) // render books/new.ejs view and send objects within 
    } catch (error) {
        res.redirect("/books")
    }
}

function saveCover(book, coverEncoded){
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, "base64")
        book.coverImageType = cover.type
    }
}

module.exports = router // to use the specific router inside application (server.js)