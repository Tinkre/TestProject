/* containing quieries of authors handling */
const express = require("express") // because we use express for the entire application
const router = express.Router() // router partion 

/* Import the author-module which is containing the handler for authors */
const Author = require("../models/author")


// handle all the routes of "/Authors" req is the actuall request of the route and res is the result we're sending back
router.get("/", (req, res) => {
    res.render("authors/index") // inputted the content of authors/index.ejs in views folder into the layouts.ejs html (layout)

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
        //res.redirect(`authors/${newAuthor.id}`) // with ` ` also variables can be included `${variable.name}`
        res.redirect("authors") // only because the page for a specific author isn't created    
    } catch (error) {
        res.render("authors/new", { //rerender page with aditional parameters
            author: author, // sendign author object (including name)
            errorMessage: "Error creating Author" //sending an dedicated error message
        })
    }

    /* save withour async */
    // author.save((err, newAuthor) => {
    //     if (err) {            
    //         res.render("authors/new", { //rerender page with aditional parameters
    //             author: author, // sendign author object (including name)
    //             errorMessage: "Error creating Author" //sending an dedicated error message
    //         })
    //     } else { // if no error appears go to page of new created author
    //         //res.redirect(`authors/${newAuthor.id}`) // with ` ` also variables can be included `${variable.name}`
    //         res.redirect("authors") // only because the page for a specific author isn't created
    //     }
    // })    
})


module.exports = router // to use the specific router inside application (server.js)