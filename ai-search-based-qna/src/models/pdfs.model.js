const mongoose = require("mongoose")

const PdfSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    author : {
        type : String
    },
    organization : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'organizations'
    },
    size : {
        type : Number
    },
    page_count : {
        type : Number
    },
    url : {
        type : String
    }
    ,
    is_indexed : {
        type : Boolean,
        default : false
    },
    indexed_at : {
        type : Date
    }
})

const PDFSModel = mongoose.model("pdfs", PdfSchema)

module.exports = PDFSModel