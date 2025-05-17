const express = require("express")
const {QueryController} = require("./../../controllers/query.controller")

const QueryRouter = express.Router()

QueryRouter.post("/", QueryController)

module.exports = QueryRouter