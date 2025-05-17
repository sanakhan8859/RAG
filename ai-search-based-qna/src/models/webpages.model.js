const mongoose = require("mongoose")

const WebpageSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    organization : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'organizations'
    },
    url : {
        type : String
    },
    is_indexed : {
        type : Boolean,
        default : false
    },
    indexed_at : {
        type : Date
    }
})

const WEBPAGESModel = mongoose.model("webpages", WebpageSchema)

module.exports = WEBPAGESModel