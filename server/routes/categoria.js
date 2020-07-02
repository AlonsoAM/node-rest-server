const express = require('express')
// importando el middleware 
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const Categoria = require('../models/categoria')
const _ = require('underscore')
const app = express()

/*
    Mostrar todas las categorias
*/
app.get('/categoria',verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion') //Ordenar
        .populate('usuario', 'nombre email') // Para cargar la tabla usuario
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                })
            })
        })

})

/*
    Mostrar categoria por ID
*/
app.get('/categoria/:id',verificaToken, (req, res) => {

    let id = req.params.id

    Categoria.findOne({ _id: id })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })
        })

})

/*
    Crear nueva categoria
*/
app.post('/categoria', verificaToken, (req, res) => {
    // Regresa una nueva categoria
    // req.usuario._id

    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

/*
    Actualizar categoria
*/
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['descripcion'])

    Categoria.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

/*
    Eliminar categoria
*/
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo un administrador puede borrar una categoria

    let id = req.params.id

    Categoria.findOneAndDelete({ _id: id }, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoría eliminada con éxito'
        })
    })
})


module.exports = app