/* containing quieries of authors handling */
const express = require("express") // because we use express for the entire application
const router = express.Router() // router partion 

/* Import the author-module which is containing the handler for authors */
const Author = require("../models/author")


// handle all the routes of "/Authors" req is the actuall request of the route and res is the result we're sending back
router.get("/", async (req, res) => {
    /* define a property which is including searchOptions */
    let searchOptions = {}

    /* defining the inputted text as regular expression */
    if (req.query.name != null && req.query.name !== "") { //  using req.query (always has to be used for request with get)
        searchOptions.name = new RegExp(req.query.name, "i")
    }

    // display all authors
    try {
        const authors = await Author.find(searchOptions) // get all authors
        res.render("authors/index", { 
            authors: authors, // sending all returned authors with inputted searchoptions
            searchOptions: req.query // sending back the querry to the user -> the name field is the same as at the request
        }) // render index page and transmitt all authors
    } catch (error) {
        res.redirect("/")
    }
}) // get the very rout of our application (same like :3000)


// new author page
router.get("/new", (reg, res) => {
    res.render("authors/new", { author: new Author() }) // go to new author page and transmitt and "author"-object into page
})


// route to create a new author using post command  (rest) for creation
router.post("/", async (req, res) => { // call it with "/authors" because "/authors" is the main root to this route (defined in server.js)
    // access the data from input (e.g.: name:"ABC") by req.body.ABC <- using the body-parser library)
    const author = new Author({
        name: req.body.name
    })

    //save the author by using save method (inside Author object)
    /* using async function to save data */
    // using try catch
    try {
        const newAuthor = await author.save()
        /* go to authors page */
        res.redirect(`authors/${newAuthor.id}`) // with ` ` also variables can be included `${variable.name}`
    } catch (error) {
        res.render("authors/new", { //rerender page with aditional parameters
            author: author, // sendign author object (including name)
            errorMessage: "Error creating Author" //sending an dedicated error message
        })
    }
    /* save withour async */
    /* author.save((err, newAuthor) => {
         if (err) {            
             res.render("authors/new", { //rerender page with aditional parameters
                 author: author, // sendign author object (including name)
                 errorMessage: "Error creating Author" //sending an dedicated error message
             })
         } else { // if no error appears go to page of new created author
             //res.redirect(`authors/${newAuthor.id}`) // with ` ` also variables can be included `${variable.name}`
            res.redirect("authors") // only because the page for a specific author isn't created
         }
    })  */  
})


/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!      Notice, the routes with parameters need       !!!
!!!       to be after the "normal" ones because        !!!
!!! e.g.: /authors/new would come with parameter "new" !!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

//getting information about an author
router.get("/:id", (req, res) => {  // id is an parameter (id of author)
    res.send("Show Author " + req.params.id)

})

router.get("/:id/edit", async (req, res) => {

    try {
        const author = await Author.findById(req.params.id)        
        res.render("authors/edit", { author: author }) // go to new author page and transmitt and "author"-object into page
    } catch (error) {
        res.redirect("/authors")
    }
})

//for put and/or delete an seperate library "method-override" is needed
router.put("/:id", async (req, res) => {
    let author
    //save the author by using save method (inside Author object)
    /* using async function to save data */
    // using try catch
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        /* go to authors page */
        res.redirect(`/authors/${author.id}`) // only because the page for a specific author isn't created    
    } catch (error) {
        if (author == null) {
            res.redirect("/")
        } else {
            res.render("authors/edit", { //rerender page with aditional parameters
                author: author, // sendign author object (including name)
                errorMessage: "Error updating Author" //sending an dedicated error message
            })
        }
    }
})

/*
for put and/or delete an seperate library "method-override" is needed
do never ever call a delete function like an get function because google 
is clicking all the links in a "<a ...>" command and woould delete your website

better use forms for it ;)
*/
router.delete("/:id", async (req, res) => {
    let author
    //save the author by using save method (inside Author object)
    /* using async function to save data */
    // using try catch
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        /* go to authors page */
        res.redirect("/authors") // only because the page for a specific author isn't created    
    } catch (error) {
        if (author == null) {
            res.redirect("/")
        } else {
            res.redirect(`/authors/${author.id}`) //go back to authors page
        }
    }
})


module.exports = router // to use the specific router inside application (server.js)