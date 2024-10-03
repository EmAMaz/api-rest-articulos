const express = require("express");
const multer = require("multer");
const router = express.Router();
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imagenes/articulos/");
  },

  filename: (req, file, cb) => {
    cb(null, "articulo" + Date.now() + file.originalname);
  },
});
const subidas = multer({ storage: almacenamiento });
const ArticuloController = require("../controllers/articulo");

router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.unArticulo);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.actualizar);
router.post(
  "/subir-imagen/:id",
  [subidas.single("files")],
  ArticuloController.subir
);
router.get("/imagen/:fichero", ArticuloController.imagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);

module.exports = router;
