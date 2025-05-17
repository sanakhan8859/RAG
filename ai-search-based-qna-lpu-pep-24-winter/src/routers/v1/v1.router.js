const express = require("express")
const authRouter = require("./auth.router")
const UserRouter = require('./user.router')
const PdfRouter = require("./pdf.router")
const WebpageRouter = require("./webpage.router")
const QueryRouter = require("./query.router")
const v1Router = express.Router()

v1Router.use("/auth", authRouter)

v1Router.use("/user", UserRouter)

v1Router.use("/query", QueryRouter)

v1Router.use("/indexing/pdf", PdfRouter)

v1Router.use("/indexing/webpage", WebpageRouter)

module.exports = v1Router