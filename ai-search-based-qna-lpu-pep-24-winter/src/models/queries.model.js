const mongoose = require("mongoose")

const QuerySchema = new mongoose.Schema({
    query : {
        type : String,
        required : true
    },
    answer : {
        type : String,
        required : true
    },
    processing_time : {
        type : Number,
        required : true
    },
    asked_at : {
        type : Date,
        required : true
    },
    feedback : {
        type : Boolean,
        default : false
    }
})

/************************************************** 
const Queries = {
    _id : 2326337636,
    queries : [
        {
            query : "Which insuarance ankit is using?",
            answer : "",
            processing_time : "",
            asked_at : "",
            feedback : false
        },{
            query : "how to claim?",
            answer : "",
            processing_time : "",
            asked_at : "",
            feedback : false
        },
        ...
    ]
}
****************************************************/
const QueriesSchema = new mongoose.Schema({
    queries : {
        type : [QuerySchema],
        required : true
    }
})


const QUERIESModel = mongoose.model("queries", QueriesSchema)

module.exports = QUERIESModel