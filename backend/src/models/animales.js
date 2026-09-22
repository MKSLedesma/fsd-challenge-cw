const mongoose = require('mongoose');

const animalesSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    nombreComun: { type: String, required: true },
    nombreCientifico: { type: String, required: true },
    clase: { type: String, required: true },
    habitat: { type: String, required: true },
    dieta: { type: String, required: true },
    pesoPromedioKg: { type: Number, required: true },
    esperanzaVidaAnios: { type: Number, required: true },
    continente: { type: String, required: true },
    enPeligroExtincion: { type: Boolean, required: true }
}, { versionKey: false });

module.exports = mongoose.model('Animal', animalesSchema);
