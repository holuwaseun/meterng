const config = require("./config")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")

let core_app = express()

core_app.use(cors())

let http = require("http").Server(core_app)
let io = require("socket.io")(http)

mongoose.connect(config.database, (err) => {
    if (err) {
        console.log(`Error connecting to DB ${ config.database_name }`)
    } else {
        console.log(`Connected to DB ${ config.database_name }`)
    }
})

core_app.use(bodyParser.urlencoded({ extended: true }))
core_app.use(bodyParser.json())
core_app.use(morgan("dev"))

core_app.use(express.static(`${ __dirname }/public`))
core_app.use("/scripts", express.static(`${ __dirname }/node_modules`))

let api = require("./app/routes/api")(core_app, express, io)

core_app.use("/api", api)

core_app.get("*", (request, response) => {
    response.sendFile(`${ __dirname }/public/app/views/index.html`)
})

http.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`Server is running on port ${ config.port }`)
    }
})