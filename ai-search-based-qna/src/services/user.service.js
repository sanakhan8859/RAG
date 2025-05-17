const USERSModel = require("./../models/users.model")

const IsUserPresentUsingEmailService = async (email)=>{
    try{

        const user = await USERSModel.findOne({"email" : email}).exec()

        if(user){
            return {
                success : true,
                data : user
            }
        }else{
            throw new Error("Unable to get user details")
        }

    }catch(err){
        console.log(`Error in isUserPresentUsingEmailService with err : ${err}`)
        return {
            success : false
        }
    }
}

const IsUserPresentUsingUserIdService = async (userId)=>{
    try{

        const user = await USERSModel.findOne({"_id" : userId}).exec()

        if(user){
            return {
                success : true,
                data : user
            }
        }else{
            throw new Error("Unable to get user details")
        }

    }catch(err){
        console.log(`Error in isUserPresentUsingEmailService with err : ${err}`)
        return {
            success : false
        }
    }
}

const FetchOrganizationIdUsingTheUserIdService = async (userId)=>{
    try{

        const user = await USERSModel.findOne({"_id" : userId}).exec()

        if(user){
            return {
                success : true,
                data : user.organizationId
            }
        }else{
            throw new Error("Unable to get user organization details")
        }

    }catch(err){
        console.log(`Error in fetchOrganizationIdUsingTheUserIdService with err : ${err}`)
        return {
            success : false
        }
    }
}

const CreateNewUserService = async (fullName, email, encryptedPassword, organizationId, organizationRole)=>{
    try{


        const user = await USERSModel.create({fullName : fullName, email : email, password : encryptedPassword, organizationId : organizationId, role : organizationRole})

        if(user){
            return {
                success : true,
                data : user
            }
        }else{
            throw new Error(`Unable to create user for email : ${email}`)
        }

    }catch(err){
        console.log(`Error in CreateNewUserService with err : ${err}`)
        return {
            success : false
        }
    }
}

const DeleteUserByUserIdService = async (userId)=>{
    try{
        const user = await USERSModel.findByIdAndDelete(userId).exec()

        if(user){
            return {
                success : true,
                data : user
            }
        }else{
            throw new Error(`Unable to delete user with userId : ${userId}`)
        }

    }catch(err){
        console.log(`Error in DeleteUserByUserIdService with err : ${err}`)
        return {
            success : false
        }
    }
}

module.exports = {
    IsUserPresentUsingEmailService,
    IsUserPresentUsingUserIdService,
    CreateNewUserService,
    DeleteUserByUserIdService,
    FetchOrganizationIdUsingTheUserIdService
}