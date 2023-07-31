const express = require('express')
const router = express.Router()
const clienteControler = require('../controllers/clienteControler.js')
const ProductosControler = require('../controllers/ProductosControler.js')
const pedidosControler = require('../controllers/pedidosControler.js')
const UsuarioControler = require('../controllers/UsuarioControler.js')

// middle para proteger las rutas
const auth = require('../middleware/auth.js')

module.exports = function() {

    // agregar nuevos clientes via post
    router.post('/clientes', auth, clienteControler.nuevoCliente)
    // obtener todos los clientes
    router.get('/clientes', auth, clienteControler.mostrarClientes)
    // muestra cliente por id
    router.get('/clientes/:id', auth, clienteControler.mostrarCliente)
    router.put('/clientes/:id', auth, clienteControler.actualizarCliente)
    router.delete('/clientes/:id', auth, clienteControler.eliminarCliente)   

    // PRODUCTOS ----------------------
    router.post('/productos', auth, ProductosControler.subirArchivo, ProductosControler.NuevoProducto)
    router.get('/productos', auth, ProductosControler.mostrarProductos)
    router.get('/productos/:id', auth, ProductosControler.mostrarProducto)
    router.put('/productos/:id', auth, ProductosControler.subirArchivo, ProductosControler.actualizarProducto)
    router.delete('/productos/:id', auth, ProductosControler.eliminarProducto)
    router.post('/productos/busqueda/:query',  ProductosControler.buscarProducto)

    // PEDIDOS --------------------------------------
    router.post('/pedidos/:id', auth, pedidosControler.nuevoPedido)
    router.get('/pedidos', auth, pedidosControler.mostrarPedidos)
    router.get('/pedidos/:id', auth, pedidosControler.mostrarPedido)
    router.put('/pedidos/:id', auth, pedidosControler.actualizarPedido)
    router.delete('/pedidos/:id', auth, pedidosControler.eliminarPedido)

    // USUARIOS ---------------------------------------
    router.post('/crear-cuenta', auth,  UsuarioControler.registrarUsuario)
    router.post('/iniciar-sesion', UsuarioControler.autenticarUsuario)

    return router
}