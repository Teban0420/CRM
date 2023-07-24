const objectId = require('mongoose').Types.ObjectId
const Pedidos = require('../models/Pedidos.js')

exports.nuevoPedido = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }

    const pedido = new Pedidos(req.body)

    try {
        
        await pedido.save()
        res.json({mensaje: 'Se agrego un nuevo pedido'})

    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarPedidos = async (req, res, next) => {

    try {
        // .populate() => hace referencia a la otra tabla
        const pedidos = await Pedidos.find().populate('cliente').populate({
            path: 'productos.producto',
            model: 'Productos'
        })
        res.json(pedidos)
        
    } catch (error) {
        console.log(error)
        next()        
    }
}

exports.mostrarPedido = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }
   
    const pedido = await Pedidos.findById(id).populate('cliente').populate({
        path: 'productos.producto',
        model: 'Productos'
    })

    if(!pedido){
        res.json({mensaje: 'Ese pedido no existe'})
        return next()
    }

    res.json(pedido)

}

exports.actualizarPedido = async(req, res, next) => {
    
    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }

    try {

       let pedido = await Pedidos.findOneAndUpdate({_id: id},
        req.body, {
            new: true
        }).populate('cliente').populate({
            path: 'productos.producto',
            model: 'Productos'
        })

        res.json(pedido)
        
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.eliminarPedido = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) 
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return 
    }

    try {

        const pedido =  await Pedidos.findByIdAndDelete({_id: id})

        if(!pedido){
            res.json({mensaje: 'No existe ese pedido'})
            return
        }

        res.json({mensaje: 'Pedido Eliminado'})
        
    } catch (error) {
        console.log(error)
        next()
    }
}