const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pedidosSchema = new Schema({

    cliente: {
        type: Schema.ObjectId,
        ref: 'Clientes' // hago referencia al modelo clientes
    },

    productos: [{ // array de objetos
        
        producto: {
            type: Schema.ObjectId,
            ref: 'Productos'
        },
        cantidad: Number
    }],

    total: {
        type: Number
    }
})

module.exports = mongoose.model('Pedidos', pedidosSchema)