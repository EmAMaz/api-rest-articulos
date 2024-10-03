const fs = require("fs");
const path = require("path");
const { validacionArticulo } = require("../helpers/validar");
const Articulo = require("../models/Articulo");

const crear = (req, res) => {
  let params = req.body;
  let articulo = new Articulo(params);
  try {
    validacionArticulo(params);

    articulo.save();
    res.status(200).json({
      status: "Success",
      message: "Articulo guardado",
      articulo: articulo,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

const listar = async (req, res) => {
  try {
    let consulta = Articulo.find({}).sort({ fecha: -1 });

    if (req.params.ultimos && !isNaN(req.params.ultimos)) {
      consulta.limit(req.params.ultimos);
    }

    let articulos = await consulta.sort({ fecha: -1 }).exec();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos!!",
      });
    }

    return res.status(200).send({
      status: "success",
      contador: articulos.length,
      articulos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Se ha producido un error",
      error,
    });
  }
};

const unArticulo = async (req, res) => {
  const { id } = req.params;
  try {
    const articulo = await Articulo.findById(id);
    if (!articulo) {
      return res.status(404).json({
        status: "Error",
        message: "Articulo no encontrado",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Articulo encontrado",
      articulo: articulo,
    });
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: "No se ha podido encontrar el articulo",
    });
  }
};

const borrar = async (req, res) => {
  const { id } = req.params;
  try {
    const articulo = await Articulo.findOneAndDelete({ _id: id });

    if (!articulo) {
      return res.status(404).json({
        status: "Error",
        message: "Articulo no encontrado",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Articulo borrado",
      articulo: articulo,
    });
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: "No se ha podido borrar el articulo",
    });
  }
};

const actualizar = async (req, res) => {
  const { id } = req.params;
  let params = req.body;
  try {
    validacionArticulo(params);
    const articulo = await Articulo.findOneAndUpdate({ _id: id }, params, {
      new: true,
    });
    if (!articulo) {
      return res.status(404).json({
        status: "Error",
        message: "Articulo no encontrado",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Articulo actualizado",
      articulo: articulo,
    });
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: "No se ha podido actualizar el articulo",
    });
  }
};

const subir = async (req, res) => {
  const { id } = req.params;

  try {
    const articulo = await Articulo.findById(id);
    if (!articulo) {
      return res.status(404).json({
        status: "Error",
        message: "Articulo no encontrado",
      });
    }
    if (!req.file && !req.files) {
      return res.status(404).json({
        status: "Error",
        message: "Peticion invalida",
      });
    }

    let archivo = req.file.originalname;
    let archivo_split = archivo.split(".");
    let archivo_ext = archivo_split[1];

    if (
      archivo_ext !== "png" &&
      archivo_ext !== "jpg" &&
      archivo_ext !== "jpeg" &&
      archivo_ext !== "gif"
    ) {
      fs.unlink(req.file.path, (err) => {
        return res.status(400).json({
          status: "Error",
          message: "Extension no valida",
        });
      });
    } else {
      const articulo = await Articulo.findOneAndUpdate(
        { _id: id },
        { $set: { imagen: req.file.filename } },
        { new: true }
      );

      res.status(200).json({
        status: "Success",
        archivo_ext,
        articulo,
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: "Error",
      message: "Articulo no encontrado",
    });
  }
};

const imagen = async (req, res) => {
  let { fichero } = req.params;
  let ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.access(ruta_fisica, (error) => {
    error
      ? res.status(404).json({
          status: "Error",
          message: "Imagen no encontrada",
          fichero,
          ruta_fisica,
        })
      : res.sendFile(path.resolve(ruta_fisica));
  });
};

const buscador = async (req, res) => {
  const { busqueda } = req.params;

  try {
    const busquedaArticulo = await Articulo.find({
      $or: [
        { titulo: { $regex: busqueda, $options: "i" } },
        { contenido: { $regex: busqueda, $options: "i" } },
      ],
    }).sort({ fecha: -1 });

    if (busquedaArticulo.length > 0) {
      return res.status(200).json({
        status: "Success",
        message: "Articulos encontrados",
        busquedaArticulo,
      });
    } else {
      res.status(200).json({
        status: "Success",
        message: "Articulos no encontrados",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Error",
      message: " Error interno del servidor.",
    });
  }
};

module.exports = {
  crear,
  listar,
  unArticulo,
  borrar,
  actualizar,
  subir,
  imagen,
  buscador,
};
