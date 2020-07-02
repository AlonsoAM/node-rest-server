const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    usuario:{
        type: Schema.Types.ObjectId, // Jala el Id del usuario y lo relaciona con la categoria
        ref: 'Usuario'
    }
})

module.exports = mongoose.model('Categoria', categoriaSchema)