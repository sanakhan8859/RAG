const { Roles } = require("@zilliz/milvus2-sdk-node")
const jwt = require("jsonwebtoken")
require('dotenv').config()
const NODE_ENV = process.env.NODE_ENV

const JWT_SECRET_KEY = process.env[`${NODE_ENV}_JWT_SECRET_KEY`]

const AuthenticationMiddleware = async (req, res, next)=>{
    try{

        // extract the token from the req and verify the token : Authentication
        const token = req.headers.authorization.split(" ")[1]

        const tokenVerifyResult = await jwt.verify(token, JWT_SECRET_KEY)

        const {userId, role} = tokenVerifyResult

        req.userId = userId

        req.role = role

        next()

    }catch(err){
        console.log(`Error in AuthenticationMiddlwware with err : ${err}`)
        res.status(err.statusCode ? err.statusCode : 401).json({
            success : false,
            message : "You are not allowed to send the request"
        })
    }
}

const AuthoriztionMiddlewareGenerator = (roles)=>{
    return async (req, res, next)=>{
       try{
            if(roles.includes(req.role)){
                next()
            }else{
                const err = new Error(`Unauthorized Acces`)
                err.statusCode = 403
                throw err
            }
       }catch(err){
            console.log(`Error in ${roles.join(", ")} AuthoriztionMiddleware with err : ${err}`)
            res.status(err.statusCode ? err.statusCode : 500).json({
                success : false,
                error : err.message
            })
       }
    }
}



module.exports = {
    AuthenticationMiddleware,
    AuthoriztionMiddlewareGenerator
}