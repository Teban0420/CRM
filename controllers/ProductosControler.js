const objectId = require('mongoose').Types.ObjectId
const Productos = require('../models/Productos.js')

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'))
        }
    }
}

// Pasar la configiguración y el campo
const upload = multer(configuracionMulter).single('imagen');

// Sube un archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error })
        }
        return next();
    })
}

exports.NuevoProducto = async( req, res, next) => {

    const producto = new Productos(req.body)

    try {

        // si subieron un archivo lo asigno al campo producto.imagen
        if(req.file.filename){
            producto.imagen = req.file.filename
        }

        await producto.save()
        res.json({mensaje: 'Producto Agregado Correctamente'})
        
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarProductos = async (req, res, next) => {

    try {
        
        const productos = await Productos.find({})
        res.json(productos)
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.mostrarProducto = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }

    try {

        const producto = await Productos.findById(id)
        res.json(producto)
        
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.actualizarProducto = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) // valido el id de mongo
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return
    }

    try {

        let nuevoProducto = req.body

        if(req.file){
            nuevoProducto.imagen = req.file.filename
        }
        else{
            let productoAnterior = await Productos.findById(id)
            nuevoProducto.imagen = productoAnterior.imagen
        }

        const producto = await Productos.findByIdAndUpdate({_id: id}, 
            nuevoProducto, {
                new: true
            })

        res.json(producto)
        
    } catch (error) {
        console.log(error)
        next()
    }

}

exports.eliminarProducto = async (req, res, next) => {

    const { id } = req.params
    const isValid = objectId.isValid(id) 
    
    if(!isValid){
        res.json({mensaje: 'Operación no válida'})
        return 
    }

    try {

        const producto =  await Productos.findByIdAndDelete({_id: id})

        if(!producto){
            res.json({mensaje: 'No existe el producto'})
            return
        }

        if(producto.imagen){
            
            const imagenAnteriorPath = __dirname + `/../uploads/${producto.imagen}`
            //elimino imagen anterior
            fs.unlink(imagenAnteriorPath, (error) => {
                if(error){
                    console.log(error)
                }
                return
            })
        }
        res.json({mensaje: 'Producto Eliminado'})
        
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.buscarProducto = async (req, res, next) => {

    try {
        // obtener el query
        const { query } = req.params
        const producto = await Productos.find({ nombre: new RegExp(query, 'i') })
        res.json(producto)

    } catch (error) {
        console.log(error)
    }
}