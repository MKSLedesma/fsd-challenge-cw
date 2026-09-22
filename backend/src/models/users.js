const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
}, { versionKey: false });

module.exports = mongoose.model('User', usersSchema);
