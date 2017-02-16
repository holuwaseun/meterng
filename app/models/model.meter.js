const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")

let Schema = mongoose.Schema

let MeterSchema = new Schema({
    _user_id: { type: Schema.ObjectId, required: true, ref: User },
    meter_number: { type: String, required: true },
    reference_number: { type: String, required: true },
    transaction_amount: { type: Number, required: true },
    transaction_token: { type: String, required: true },
    transaction_unit: { type: Number, required: true },
    transaction_date: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
})

module.exports = mongoose.model("Meter", MeterSchema)