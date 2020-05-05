const mongoose = require("mongoose")
const path = require("path")
const coverImageBasePath = "uploads/bookCovers"

// create the schema which is simply the same as the table in a sql-database
const bookSchema = new mongoose.Schema({ 
    title: { //defining entry title inside our object. there are a lot of options but type and requiered are mostly used
        type: String,
        required: true
    },
    description: { //defining entry description inside our object. there are a lot of options but type and requiered are mostly used
        type: String
    },
    publishDate:  {
        type: Date,
        required: true
    },
    pageCount:  {
        type: Number,
        required: true
    },
    createdAt:  {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author:  { // author is type of mongoose schematic of Author
        type: mongoose.Schema.Types.ObjectId, // typ is the Object ID
        required: true,
        ref: "Author" //name has to be the sam as defined in the author.js model
    }
}) // defining the Object of our book

bookSchema.virtual("coverImagePath").get(function (){
    if (this.coverImageName != null){
        return path.join("/", coverImageBasePath, this.coverImageName)
    }
})

// export the module to allow us to use it in our application
module.exports = mongoose.model("Book", bookSchema) //define name of our module and define the dataobject (in this case the schema)
module.exports.coverImageBasePath = coverImageBasePath // return it as named variable