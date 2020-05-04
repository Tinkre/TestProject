/* loading environment with "dotenv" module */
// check for production environment
if (process.env.Node_ENV !== "production"){ //node_ENV is set per default from node
    const dotenv = require('dotenv');
    const dotenvParseVariables = require('dotenv-parse-variables');
    
    let env = dotenv.config({})
    if (env.error) throw env.error;
    env = dotenvParseVariables(env.parsed);
    
    console.log(env);
    
} 


const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")


// configure express application
app.set("view engine", "ejs") //setting View engine to "ejs" to can include .ejs-files
app.set("views", __dirname + "/views") // difine where the views are coming from (__dirname returning the current directory name)
app.set("layout", "layouts/layout") //all existing files will be putted in this layout file which defines the basic Frontend
app.use(expressLayouts) // using express-ejs-layouts 
app.use(express.static("public")) // define where the public files are (containing all public views stylesheets, javascript and images)

/* Setting up MongoDb-Database */
const mongoose = require("mongoose") // import mongoose
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true // mongoose uses an old parser per default ??needed??
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





// define where we want to listen on our app (the port)
app.listen(process.env.PORT || 3000) // "process.env.PORT" - common Environment variable which tells whats port is need to be used. For development (.env includes the PORT) Port 3000 is common
