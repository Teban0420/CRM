const Usuarios = require('../models/Usuarios.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.registrarUsuario = async (req, res) => {

    // leer datos del usuario y colocarlos en el modelo
    const usuario = new Usuarios(req.body)
    usuario.password = await bcrypt.hash(req.body.password, 12)

    try {
        
        await usuario.save()
        res.json({mensaje: 'Usuario Creado Correctamente'})

    } catch (error) {
        console.log(error)
        res.json({mensaje: 'Hubo un error'})
    }
}

exports.autenticarUsuario = async (req, res, next) => {
    
    // buscar el usuario por su email
    const usuario = await Usuarios.findOne({ email: req.body.email})

    if(!usuario){
        await res.status(401).json({mensaje: 'El Usuario no Existe'})
        next()
    }
    else{
        // usuario existe, verificar password
        if(!bcrypt.compareSync(req.body.password, usuario.password)){
            // el password es incorrecto
            await res.status(401).json({mensaje: 'Contraseña Incorrecta'})
            next()
        }
        else{
            // password correcto, crear token
            const token = jwt.sign({
                email: usuario.email,
                nombre: usuario.nombre,
                id: usuario._id
            }, 
            'SUPERSECRETO', {
                expiresIn: '1h'
            })

            // retornar el token
            res.json({token})
        }
    }
}