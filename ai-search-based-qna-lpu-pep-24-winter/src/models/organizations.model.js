const mongoose = require("mongoose")

const OrganizationSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    domain : {
        type : String
    },
    isFreeAccount : {
        type : Boolean,
        default : true
    },
    isActive : {
        type : Boolean,
        default : true
    },
    location : {
        type : String
    },
    lastPaymentAt : {
        type : Number
    }
})

const ORGANIZATIONSModel = mongoose.model("organizations", OrganizationSchema)

module.exports = ORGANIZATIONSModel