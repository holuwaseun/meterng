const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

let Schema = mongoose.Schema

let UserSchema = new Schema({
    account_type: { type: String, required: true }, //Admin, Agent, User
    meter_number: { type: String, required: false },
    fullname: { type: String, required: true },
    password: { type: String, required: true, select: false, minlength: [6, "The password is too short, minimum length is {MINLENGTH}"] },
    email_address: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true },
    date_added: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
})

UserSchema.pre("save", function(next) {
    let user = this

    if (!user.isModified("password")) {
        return next()
    }

    bcrypt.hash(user.password, null, null, function(err, hash) {
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