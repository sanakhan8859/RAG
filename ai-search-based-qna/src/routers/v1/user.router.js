const express = require('express')
const {DeleteUserByUserIdController} = require("./../../controllers/user.controller")
const {AuthenticationMiddleware, AuthoriztionMiddlewareGenerator} = require('./../../middlewares/auth.middleware')

const UserRouter = express.Router()

UserRouter.delete("/delete/:userId", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator(["ORG_ADMIN"]), DeleteUserByUserIdController)

module.exports = UserRouter