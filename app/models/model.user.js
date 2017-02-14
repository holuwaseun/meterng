const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

let Schema = mongoose.Schema

let UserSchema = new Schema({
    account_type: { type: String, required: true }, //Admin, Agent, User
    meter_number: { type: String, required: false },
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true, minlength: [6, "The username is too short, minimum length is {MINLENGTH}"] },
    password: { type: String, required: true, select: false, minlength: [6, "The password is too short, minimum length is {MINLENGTH}"] },
    email_address: { type: String, required: true, unique: true },
    date_added: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
})

UserSchema.query.byAccountType = function(account_type) {
    return this.find({ account_type: account_type, deleted: false })
}

UserSchema.query.byUsername = function(username) {
    return this.findOne({ username: username, deleted: false })
}

UserSchema.pre("save", (next) => {
    let user = this

    if (!user.isModified("password")) {
        return next()
    }

    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) {
            return next(err)
        }

        user.password = hash

        next()
    })
})

UserSchema.methods.passwordCheck = function(password) {
    let user = this

    return bcrypt.compareSync(password, user.password)
}

module.exports = mongoose.model("User", UserSchema)