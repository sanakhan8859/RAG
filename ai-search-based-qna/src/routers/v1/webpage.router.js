const express = require("express")
const {GetAllIndexedWebpageFromMongoDBController, IndexNewWebpageController, DeleteIndexedWebpageController} = require("./../../controllers/webpage.controller")
const {AuthenticationMiddleware, AuthoriztionMiddlewareGenerator} = require("./../../middlewares/auth.middleware")

const webpageRouter = express.Router()

webpageRouter.get("/all", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator(["ORG_ADMIN","ORG_MEMBER"]), GetAllIndexedWebpageFromMongoDBController)

webpageRouter.post("/new", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator(["ORG_ADMIN","ORG_MEMBER"]), IndexNewWebpageController)

webpageRouter.delete("/delete/:webpageId", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator(["ORG_ADMIN"]), DeleteIndexedWebpageController)

module.exports = webpageRouter