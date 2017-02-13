const express = require("express")
const morgan = require("morgan")

let app = express()

let http = require("http").Server(app)
let io = require("socket.io")(http)

app.use(morgan("dev"))

app.use(express.static(`${ __dirname }/public`))
app.use('/scripts', express.static(`${ __dirname }/node_modules`))

app.get("*", (request, response) => {
    response.sendFile(`${ __dirname }/public/app/views/index.html`)
})

http.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    }
})