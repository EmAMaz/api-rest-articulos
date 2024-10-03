const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"],
    },
    contenido: {
        type: String,
        required: [true, "El contenido es obligatorio"],
    },
    fecha: {
        type: Date,
        default: Date.now
    } ,
    imagen: {
        type: String,
        default: "default.png"
    }
});

module.exports = model("Articulo", ArticuloSchema, "articulos");