/* loading environment with "dotenv" module */
// check for production environment
if (process.env.NODE_ENV !== "production"){ //node_ENV is set per default from node
    const dotenv = require('dotenv');
    const dotenvParseVariables = require('dotenv-parse-variables');
    
    let env = dotenv.config({})
    if (env.error) throw env.error;
    env = dotenvParseVariables(env.parsed);
    console.log("environment entries for development:\n" + JSON.stringify(env) + "\nend of environment entries");    
    
} 


const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")

// configure express application
app.use("", express.static('public')) // define where the public files are (containing all public views stylesheets, javascript and images)
app.set("view engine", "ejs") //setting View engine to "ejs" to can include .ejs-files
app.set("views", __dirname + "/views") // difine where the views are coming from (__dirname returning the current directory name)
app.set("layout", "layouts/layout") //all existing files will be putted in this layout file which defines the basic Frontend
app.use(expressLayouts) // using express-ejs-layouts 

// body-parser to get access to data created in inputs like in _form_fields.ejs by name
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false})) // we're using urlencoded because we're sending the values via url to our server
/* 
The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true). 
The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded. For more information, please see the qs library.
Defaults to true, but using the default has been deprecated. Please research into the difference between qs and querystring and choose the appropriate setting. 
*/
// include "method-override" library to call put and or delete requests
const methodOverride = require("method-override")
app.use(methodOverride("_method"))
/* 
Put or delete requests can be called by adding a defined parameter into a "POST" request which
can be detected by the server and allows him to execute routers put or delete routines
*/






/* Setting up MongoDb-Database */
const mongoose = require("mongoose") // import mongoose
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, // mongoose uses an old parser per default ??needed??
    useUnifiedTopology: true // (node:9760) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
}) // connect to Database put in URL for connection never hardcode connection because it depends on environment
const db = mongoose.connection // access to database
db.on("error", error => console.error(error)) // report error if appers
db.once("open", () => console.log("Connected to mongoose")) // report "open" only the very first time after starting application



/* Do not input all routes (controllers) in here because it will be very hard to manage */
// insert index route (all where we do not have a specified recource or model in our URL)
// import all routes
// import routes/index
const indexRouter = require("./routes/index") // get reference to the specific router require the return of route by "export" command
app.use("/",indexRouter) // tell app to use the indexRouter by route path where it is coming from ("/") imported by require command

// import routes/authors
const authorRouter = require("./routes/authors") // get reference of router specified in routes/authors. requieres the export of router by export command
app.use("/authors", authorRouter) // tell app to use the author router all routes in authorRouter is prependet by "authors"

// import routes/books
const bookRouter = require("./routes/books") // get reference of router specified in routes/authors. requieres the export of router by export command
app.use("/books", bookRouter) // tell app to use the author router all routes in authorRouter is prependet by "authors"




// define where we want to listen on our app (the port)
app.listen(process.env.PORT || 3000) // "process.env.PORT" - common Environment variable which tells whats port is need to be used. For development (.env includes the PORT) Port 3000 is common
