const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const Schema = mongoose.Schema

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'Por favor debe ingresar un password o contraseña']
    },
    img: {
        type: String,
        required: false
    }, // no es obligatoria
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, // defautl: 'USER_ROLE'
    estado: {
        type: Boolean,
        default: true
    }, // Boolear
    google: {
        type: Boolean,
        default: false
    } // Boolean
})

// Método para que no aparezca el password pero si se guarde en la base de dsatos
usuarioSchema.methods.toJSON = function() {

    let user = this
    let userObjetct = user.toObject()
    delete userObjetct.password

    return userObjetct

}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })


module.exports = mongoose.model('Usuario', usuarioSchema)