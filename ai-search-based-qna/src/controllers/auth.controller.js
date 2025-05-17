// const httpStatus = require("http-status")
const {CheckEmailDomainIsPersonalOrNotUtil} = require("./../utils/auth.utils")
const {IsUserPresentUsingEmailService, CreateNewUserService} = require("./../services/user.service")
const {IsOrganizationPresentUsingOrgDomainService, CreateNewOrganizationService} = require("./../services/organization.service")
require("dotenv").config()
const jwt = require('jsonwebtoken')

const NODE_ENV = process.env.NODE_ENV

const JWT_SECRET_KEY = process.env[`${NODE_ENV}_JWT_SECRET_KEY`]

const bcrypt = require('bcrypt')

const SignupController = async (req, res)=>{
    try{

        const {fullName, email, password} = req.body

        if(!fullName){
            const err = new Error("fullName is required in the body")
            err.statusCode = 400
            throw err
        }

        if(!email){
            const err = new Error("email is required in the body")
            err.statusCode = 400
            throw err
        }

        if(!password){
            const err = new Error("password is required in the body")
            err.statusCode = 400
            throw err
        }


        // TODO : if user is already present, then return error
        const IsUserPresentUsingEmailServiceResult = await IsUserPresentUsingEmailService(email)
        if(IsUserPresentUsingEmailServiceResult.success){
            const err = new Error("User already present")
            err.statusCode = 400
            throw err
        }

        const emailDomain = email.split("@")[1]

        console.log(emailDomain)

        const CheckEmailDomainIsPersonalOrNotUtilResult = CheckEmailDomainIsPersonalOrNotUtil(emailDomain)

        if(CheckEmailDomainIsPersonalOrNotUtilResult.success){
            // if email is personal email
            res.status(201).json({
                success : true,
                message : "Email is Personal"
            })
        }else{
            // if email is business/professional email

            // from email extract the organization domain and name
            const organizationDomain = emailDomain
            const organizationName = emailDomain.split(".")[0].toUpperCase()
            let organizationId
            let organizationRole = "ORG_MEMBER" 

            // check if organiztion is already created or not
            const IsOrganizationPresentUsingOrgDomainServiceResult = await IsOrganizationPresentUsingOrgDomainService(organizationDomain)
    
            // if organization is already created for the user, then use the existing organization detail 
            // otherwise create new organization
            if(IsOrganizationPresentUsingOrgDomainServiceResult.success){
                // organization is already present
                organizationId = IsOrganizationPresentUsingOrgDomainServiceResult.data._id
            }else{
                // organization is not present, then create organization
                const CreateNewOrganizationServiceResult = await CreateNewOrganizationService(organizationDomain, organizationName)
                if(!CreateNewOrganizationServiceResult.success){
                    const err = new Error(`Unable to create organization with name : ${organizationName} and domain : ${organizationDomain}`)
                    err.statusCode = 500
                    throw err
                }
                organizationId = CreateNewOrganizationServiceResult.data._id
                organizationRole = "ORG_ADMIN"
            }

            // TODO4 : create user

            // convert password to encryptedPassword
            const salt = await bcrypt.genSalt()
            const encryptedPassword = await bcrypt.hash(password, salt)

            const CreateNewUserServiceResult = await CreateNewUserService(fullName, email, encryptedPassword, organizationId, organizationRole)

            if(!CreateNewUserServiceResult.success){
                const err = new Error(`Unable to create user with email : ${email}`)
                err.statusCode = 400
                throw err
            }

            const {fullName : fullNameDB, email : emailDB, organizationId : organizationIdDB, _id : userId} = CreateNewUserServiceResult.data

            res.status(201).json({
                success : true,
                message : "User is created",
                data : {
                    fullname : fullNameDB,
                    email : emailDB,
                    organizationId : organizationIdDB,
                    userId
                }
            })

        }

        

    }catch(err){
        console.log(`Error in SignupController with err : ${err}`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

const SigninController = async (req, res)=>{
    try{

        const {email, password} = req.body


        if(!email){
            const err = new Error("email is required in the body")
            err.statusCode = 400
            throw err
        }

        if(!password){
            const err = new Error("password is required in the body")
            err.statusCode = 400
            throw err
        }  
        
        // If user is already present, then return error
        const IsUserPresentUsingEmailServiceResult = await IsUserPresentUsingEmailService(email)
        if(!IsUserPresentUsingEmailServiceResult.success){
            const err = new Error("Invalid Credentials")
            err.statusCode = 400
            throw err
        }

        const {data : {fullName : fullNameInDB, email : emailInDB, password : encryptedPasswordInDB, _id : userIdInDB, organizationId : organizationIdInDB, role : roleInDB}} = IsUserPresentUsingEmailServiceResult

        const passwordCheck = await bcrypt.compare(password, encryptedPasswordInDB)

        if(!passwordCheck){
            const err = new Error("Invalid Credentials")
            err.statusCode = 400
            throw err
        }

        // generate token for the user, and return back the token to the user
        const payload = {
            userId : userIdInDB,
            role : roleInDB
        }

        const token = await jwt.sign(payload, JWT_SECRET_KEY, {expiresIn : '5m'})

        res.status(201).json({
            success : true,
            token : token
        })

    }catch(err){
        console.log(`Error in SigninController with err : ${err}`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {
    SignupController,
    SigninController
}