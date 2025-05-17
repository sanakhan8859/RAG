const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    organizationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'organizations'
    },
    role : {
        type : String,
        default : "ORG_MEMBER",
        enum : ["ORG_ADMIN", "ORG_MEMBER"]
    },
    profilePicture : {
        type : String
    }
})

const USERSModel = mongoose.model("users", UserSchema)

module.exports = USERSModel