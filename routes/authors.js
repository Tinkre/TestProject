/* containing quieries of authors handling */
const express = require("express") // because we use express for the entire application
const router = express.Router() // router partion 


// handle all the routes of "/Authors" req is the actuall request of the route and res is the result we're sending back
router.get("/", (req, res) => {
    res.render("authors/index") // inputted the content of authors/index.ejs in views folder into the layouts.ejs html (layout)

}) // get the very rout of our application (same like :3000)

// new author page
router.get("/new", (reg, res) => {
    res.render("authors/new")
})

// route to create a new author using post command  (rest) for creation
router.post("/", (req, res) => {
    res.send("create") //insert here methode which creates a new author
})


module.exports = router // to use the specific router inside application (server.js)