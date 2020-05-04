/* containing all queries where no specific recources and/or models need to use */
const express = require("express") // because we use express for the entire application
const router = express.Router() // router partion 

/* handle the routes req is the actuall request of the route and res is the result we're sending back */
router.get("/", (req, res) => {
    res.send("Hello World")

}) // get the very rout of our application (same like :3000)

module.exports = router // to use the specific router inside application (server.js)