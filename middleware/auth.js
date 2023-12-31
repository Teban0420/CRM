// codigo que valida si el token es correcto
const jwt = require('jsonwebtoken')

module.exports = ( req, res, next) => {

    // autorizacion por el header
    const authHeader = req.get('Authorization')
    
    if(!authHeader){
        const error = new Error('No autenticado, no hay JWT')
        error.statusCode = 401
        throw error
    }

    //obtener el token y verificarlo
    const token = authHeader.split(' ')[1]
    let revisarToken

    try {

        revisarToken = jwt.verify(token, 'SUPERSECRETO')
        
    } catch (error) {
        console.log(error)
        error.statusCode = 500
        throw error
    }

    // si token es valido, pero hay algun error
    if(!revisarToken){
        const error = new Error('No autenticado')
        error.statusCode = 401
        throw error
    }

    // paso todas las validaciones
    next()
}