import mongoose from "mongoose"

export const dbConection = async () => {
    try {
        const mongoDB = await mongoose.connect(
           process.env.DB_URL_CONNECTION,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("Se conecto satisfactoriamente a la base de datos de: ", mongoDB.connections[0].name)
    } catch (error) {
        console.error("Error al conectar la BD.")
        throw new Error(error)
    }
}