const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")

// configure express application
app.set("view engine", "ejs") //setting View engine to "ejs" to can include .ejs-files
app.set("views", __dirname + "/views") // difine where the views are coming from (__dirname returning the current directory name)
app.set("layout", "layouts/layout") //all existing files will be putted in this layout file which defines the basic Frontend
app.use(expressLayouts) // using express-ejs-layouts 
app.use(express.static("public")) // define where the public files are (containing all public views stylesheets, javascript and images)

/* Do not input all routes (controllers) in here because it will be very hard to manage */

// insert index route (all where we do not have a specified recource or model in our URL)
// import all routes

// import routes/index
const indexRouter = require("./routes/index") // get reference to the specific router require the return of route by "export" command
app.use("/",indexRouter) // tell app to use the indexRouter by route path where it is coming from ("/") imported by require command


// define where we want to listen on our app (the port)
app.listen(process.env.PORT || 3000) // "process.env.PORT" - common Environment variable which tells whats port is need to be used. For development (no Environment) Port 3000 is common
