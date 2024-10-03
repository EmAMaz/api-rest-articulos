const { connectDB } = require("./database/connection");
const express = require("express");
const cors = require("cors");

connectDB();

const app = express();
app.use(cors());
app.use(express.json()); //recibir datos en formato json
app.use(express.urlencoded({ extended: true })); //recibir datos en formato x-www-form-urlencoded

const rutas_articulo = require("./rutas/articuloRuta");

app.use("/api", rutas_articulo);

app.listen(process.env.PORT_CHOICE, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT_CHOICE}`);
});
