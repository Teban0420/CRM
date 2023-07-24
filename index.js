const express = require('express')
const routes = require('./routes/index.js') // archivo donde estan las rutas
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({ path: 'variables.env'})

// cors permite que un cliente se conecte a otro servidor para apis
const cors = require('cors')

// conectar a mongo
mongoose.connect(process.env.BD_URL, {useNewUrlParser:true})
mongoose.connection.on('error', (error) => {
    console.log(error)
})


// crear el servidor
const app = express()

// habilitar bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( {extended: true}))

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');
    
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    
    next();
    
});


// carpeta publica (lo que se puede ver)
app.use(express.static('uploads'))

// rutas de la app
app.use('/', routes())


// Definir un dominio(s) para recibir las peticiones
const whiteList = [process.env.FRONTEND_URL]

const CorsOptions = {
    origin: (origin, callback) => {
        // revisar si la peticion viene de un servidor que esta en la lista blanca
        const existe = whiteList.some( dominio => dominio === origin)
        if(existe){
            callback(null, true)
        }
        else{
            callback(new Error('No permitido'))
        }
    }
}

// habilitar cors
app.use(cors( CorsOptions ))


const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5000

//puerto
app.listen(port, host, () => {
    console.log('EL servidor funciona')
})