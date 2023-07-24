
const objectId = require('mongoose').Types.ObjectId
const Clientes = require('../models/Clientes.js')

exports.nuevoCliente = async(req, res, next) => {
    
    const cliente = new Clientes(req.body)

    try {
        await cliente.save()
        res.json({mensaje: 'Se agrego un nuevo cliente'})
        
    } catch (error) {
        res.send(error)
        next()        
    }
}

exports.mostrarClientes = async(req, res, next ) => {

    try {
        const clientes = await Clientes.find({})
        res.json(clientes)

    } catch (error) {
        console.log(error)
        next()
    }
    
}

exports.mostrarCliente = async(req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }

    try {
        const cliente = await Clientes.findById(id)
        res.json(cliente)
        
    } catch (error) {
        console.log(error)
        res.json({mensaje: 'No existe el cliente'})
        next()
        
    }

}

exports.actualizarCliente = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }

    try {
        const cliente = await Clientes.findOneAndUpdate({_id: id}, 
            req.body, {
                new: true
            })
        
        res.json(cliente)
        
    } catch (error) {
        res.send(error)
        // res.json({mensaje: 'El cliente no se actualizo'})
        next()        
    }
}

exports.eliminarCliente = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }

    try {
        const cliente = await Clientes.findOneAndDelete({_id: id})
        res.json({mensaje: 'Se elimino el registro'})

    } catch (error) {
        console.log(error)
        next()
        
    }

}