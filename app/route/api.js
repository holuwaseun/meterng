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
    api.post("/user/create", (request, response) => {
        User.find({ email_address: request.body.email_address }, (err, users) => {
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
                    message: "Email is already in use by a user"
                })
                return
            }

            let userObj = new User({
                account_type: "User",
                fullname: request.body.fullname,
                email_address: request.body.email_address,
                phone_number: request.body.phone_number,
                password: request.body.password
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

                token_obj = {
                    _id: savedUser._id,
                    account_type: savedUser.account_type,
                    fullname: savedUser.fullname,
                    email_address: savedUser.email_address,
                    phone_number: savedUser.phone_number,
                    meter_number: ""
                }

                let user_token = createToken(token_obj)

                response.status(200).json({
                    status: 200,
                    success: true,
                    message: "Account has been created, redirecting to dashboard",
                    data: savedUser,
                    token: user_token
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
            email_address: request.body.email_address,
            password: request.body.password
        }

        let token_obj = {}

        User.findOne({ email_address: userObj.email_address }).select("account_type meter_number fullname password phone_number email_address").exec((err, user) => {
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
                        message: "Invalid credentials, please try again"
                    })
                } else {
                    token_obj = {
                        _id: user._id,
                        account_type: user.account_type,
                        fullname: user.fullname,
                        email_address: user.department_name,
                        phone_number: user.phone_number,
                        meter_number: user.meter_number || ""
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