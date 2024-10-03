const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose= require("mongoose");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await client.connect();
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectarse a la base de datos");
  }
}
module.exports = {
  connectDB,
};
