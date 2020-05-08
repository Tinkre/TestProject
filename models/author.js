const mongoose = require("mongoose")

const Book = require("./book")

// create the schema which is simply the same as the table in a sql-database
const authorSchema = new mongoose.Schema({ 
    name: { //defining entry name inside our object. there are a lot of options but type and requiered are mostly used
        type: String,
        required: true
    }
}) // defining the Object of our author

authorSchema.pre("remove", function (next) {
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error("This author has books still"))
        } else {
            next()
        }
    })
})

// export the module to allow us to use it in our application
module.exports = mongoose.model("Author", authorSchema) //define name of our module and define the dataobject (in this case the schema)