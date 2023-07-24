const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientesSchema = new Schema({
    
    nombre: {
        type: String,
        trim: true, // elimina espacios en blanco
    },

    apellido: {
        type: String,
        trim: true
    },

    empresa: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },

    telefono: {
        type: String,
        trim: true
    }
})

// exporto el modelo y lo llamo 'Clientes'
module.exports = mongoose.model('Clientes', clientesSchema)