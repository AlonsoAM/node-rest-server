require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Habilitar la carpetar public
app.use(express.static(path.resolve(__dirname , '../public')))
//console.log(path.resolve(__dirname , '../public'))


// Configuracion global de rutas
app.use(require('./routes/index'))



// conectar a la base de datos de MongoDB
const conexion = async() => {
    const conectado = await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    return conectado
}
conexion() ? console.log("Base de datos ONLINE") : console.log("ERROR")

// Levantar el servidor
app.listen(process.env.PORT, () => console.log("Escuchando el puerto", process.env.PORT))