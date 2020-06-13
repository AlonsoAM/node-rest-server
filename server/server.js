require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// obtener
app.get('/usuario', function(req, res) {
    res.json('get usuario')
})

// Insertar
app.post('/usuario', function(req, res) {
    let body = req.body
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            persona: body
        })
    }
})

// Actualizar
app.put('/usuario/:id', function(req, res) { // el /:id sirve para capturar la id ingresada por la url
    let id = req.params.id // captura el id ingresado por la url y la almacena en una variable
    res.json({
        id // retorna en formato JSON lel id obtenido por la url
    })
})

// Eliminar
app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
})

app.listen(process.env.PORT, () => console.log("Escuchando el puerto", process.env.PORT))