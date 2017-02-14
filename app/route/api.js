const config = require("../../config")
const jsonwebtoken = require("jsonwebtoken")

const User = require("../models/model.user")

function createToken(user, secret_key = config.secretKey) {
    let token = jsonwebtoken.sign(user, secret_key, {
        expiresIn: 86400
    })

    return token
}

module.exports = (app, express, io) => {
    let api = express.Router()

    /*
    // Sign up end point of the API
    // Handles registration of
    // users
    */
    api.post("/user/signup", (request, response) => {
        User.find({ username: request.body.username }, (err, users) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                })
                return
            }

            if (users.length > 0) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "Username is already taken"
                })
                return
            }

            let userObj = new User({
                account_type: "User",
                username: request.body.username,
                password: request.body.password,
                fullname: request.body.fullname,
                email_address: request.body.email_address,
                meter_number: request.body.meter_number
            })

            userObj.save((err, savedUser) => {
                if (err) {
                    response.status(200).send({
                        status: 403,
                        success: false,
                        message: "An error occured",
                        error_message: err.message
                    })
                    return
                }

                response.status(200).json({
                    status: 200,
                    success: true,
                    message: "Account has been created",
                    data: savedUser
                })
            })
        })
    })

    /*
    // Auth end point of the API
    // Handles authentiation of
    // users and creation of
    // tokens for sessions
    */
    api.post("/auth", (request, response) => {
        let userObj = {
            username: request.body.username,
            password: request.body.password
        }

        let token_obj = {}

        User.find().byUsername(userObj.username).select("account_type meter_number fullname username password email_address").exec((err, user) => {
            if (err) {
                response.status(200).send({
                    status: 403,
                    success: false,
                    message: "Error occured",
                    error_message: err.message
                })
                return
            }

            if (!user) {
                response.status(200).send({
                    status: 200,
                    success: false,
                    message: "User doesn't exist, please try again"
                })
            } else if (user) {
                let validPassword = user.passwordCheck(userObj.password)

                if (!validPassword) {
                    response.status(200).send({
                        status: 200,
                        success: false,
                        message: "Invalid password, please try again"
                    })
                } else {
                    token_obj = {
                        _id: user._id,
                        account_type: user.account_type,
                        username: user.username,
                        fullname: user.fullname,
                        email_address: user.department_name,
                        meter_number: user.meter_number
                    }

                    let user_token = createToken(token_obj)

                    response.status(200).json({
                        status: 200,
                        success: true,
                        message: "Login was successful",
                        token: user_token
                    })
                }
            }
        })
    })

    //middleware to confirm user logged in state
    api.use((request, response, next) => {
        let token = request.body.token || request.query.token || request.headers['x-access-token']

        if (!token) {
            response.status(200).send({
                status: 403,
                success: false,
                message: "No valid user token found"
            })
            return
        } else {
            jsonwebtoken.verify(token, config.secretKey, (err, decoded) => {
                if (err) {
                    response.status(200).send({
                        status: 403,
                        success: false,
                        message: "Error occured",
                        error_message: err.message
                    })
                    return
                }

                request.decoded = decoded

                next()
            })
        }
    })

    api.get("/me", (request, response) => {
        response.status(200).json({
            status: 200,
            success: true,
            message: "User data loaded",
            user_data: request.decoded
        })
    })

    return api
}