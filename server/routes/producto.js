const express = require('express')
// importando el middleware 
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const Producto = require('../models/producto')
const app = express()

/*
   Obtener todos los productos
*/
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario y categoria
    // paginado
    let desde = Number(req.query.desde || 0)
    let limite = Number(req.query.limite || 5)

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                })
            })
        })
})

/*
   Obtener un producto por ID
*/
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario y categoria
    let id = req.params.id

    Producto.findOne({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto
            })
            
        })


})

/*
  Buscar Produtctos
*/
app.get('/produtos/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i') // Para que filtre la busqueda

    Producto.find({nombre: regex})
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, producto)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            producto
        })

    })

})

/*
   Crear un producto
*/
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body

    let producto = new Producto({

        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

/*
   Actualizar producto por ID
*/
app.put('/productos/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id
    let body = req.body

    Producto.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

/*
   Borrar un producto por ID
*/
app.delete('/productos/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // disponible: false 
    let id = req.params.id

    let cambiaDisponible = {
        disponible: false
    }

    Producto.findOneAndUpdate({ _id: id }, cambiaDisponible, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Cambiando estado de disponibilidad a Falso'
        })
    })
})

module.exports = app