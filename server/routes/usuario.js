const express = require('express')
const app = express()

// importando el Bcrypt para encriptar contraseñas
const bcrypt = require('bcrypt')

// underscore para trabajar mas funcionalidades javaScrip
const _ = require('underscore')

// importando el modelo usuario
const Usuario = require('../models/usuario')

// importando el middleware 
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

// obtener
app.get('/usuario', verificaToken, (req, res) => {


    let desde = Number(req.query.desde || 0)
    let limite = Number(req.query.limite || 5)

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // para paginar
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})

// Insertar
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuariodb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //usuariodb.password = null

        res.json({
            ok: true,
            usuario: usuariodb
        })

    })
})

// Actualizar
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => { // el /:id sirve para capturar la id ingresada por la url
    let id = req.params.id // captura el id ingresado por la url y la almacena en una variable
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    Usuario.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

// Eliminar
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id

    // Modifica el estado del usuario
    let cambiaEstado = {
        estado: false
    }

    Usuario.findOneAndUpdate({ _id: id }, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

    // elimina Fisicamente el usuario
    /*Usuario.findOneAndDelete({ _id: id }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })*/



})

module.exports = app