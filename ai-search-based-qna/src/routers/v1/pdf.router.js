const express = require("express")
const { GetAllIndexedPdfFromMongoDBController, IndexNewPDFController, DeleteIndexedPdfController } = require("./../../controllers/pdf.controller")
const {PdfUploadMiddleware} = require("./../../middlewares/multer.middleware")
const {AuthenticationMiddleware, AuthoriztionMiddlewareGenerator} = require("./../../middlewares/auth.middleware")

const pdfRouter = express.Router()

pdfRouter.get("/all", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator(["ORG_ADMIN","ORG_MEMBER"]), GetAllIndexedPdfFromMongoDBController)

pdfRouter.post("/new", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator(["ORG_ADMIN","ORG_MEMBER"]), PdfUploadMiddleware.single('data'), IndexNewPDFController)

pdfRouter.delete("/delete/:pdfId", AuthenticationMiddleware, AuthoriztionMiddlewareGenerator(["ORG_ADMIN"]), DeleteIndexedPdfController)

module.exports = pdfRouter