import fs from "fs";

import { Products } from "../models/Products.js"
import { Images } from "../models/Images.js";

export const createProduct = async (req, res) => {
    const {body, file} = req

    try {
        
        if (!file) {
            return res.status(400)
                .json({
                    ok: false,
                    msg: "La foto es obligatoria."
                })
        }

        const imageBuffer = fs.readFileSync(`./temp/imgs/${file.filename}`)
        console.log(imageBuffer)

        const image = await Images.create({
            fileName: file.filename,
            img: {
                data: imageBuffer,
                contentType: "image/png"
            }
        })
        
        if (!image) {
            return res.status(400)
                .json({
                    ok: false,
                    msg: "No se pudo guardar correctamente la imagen."
                })
        }

        //const product = await Products.create(body);
        //console.log(body)
        //console.log(file.filename)

        const product = await Products.create({
            ...body,
            // para el caso que la imagenes queden alojadas permanentemente en nuestro servidor
            // img1: `${process.env.BASE_URL}/public/${file.filename}`
            
            img1: `${process.env.BASE_URL}/images/${image._id}`
        });

        fs.rm(`./temp/imgs/${file.filename}`, error => {
                if (error) {
                    console.log("Lo sentimos, no hemos podido eliminar el archivo")
                }
                console.log("El archivo se ha eliminado correctamente")
            })

        if (!product) {
            return res.status(400)
                .json({
                    ok: false,
                    msg: "No se pudo crear el producto."
                })
        }

        res.json({
            ok: true,
            product,
            msg: "Se ha creado el producto correctamente."
        })
    } catch (error) {
        console.log("Ha habido un error al crear el producto.", error)

        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error con el servidor"
            })
    }
} 
/////////////////////////////////
// import fs from "fs";
// import { Products } from "../models/Products.js";
// import { Images } from "../models/Images.js";

// export const createProduct = async (req, res) => {
//     const { body, files } = req;

//     try {
//         if (!files || files.length === 0) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: "Las fotos son obligatorias."
//             });
//         }

//         const imageIds = [];
//         for (const file of files) {
//             const imageBuffer = fs.readFileSync(`./temp/imgs/${file.filename}`);

//             const image = await Images.create({
//                 fileName: file.filename,
//                 img: {
//                     data: imageBuffer,
//                     contentType: "image/png"
//                 }
//             });

//             if (!image) {
//                 return res.status(400).json({
//                     ok: false,
//                     msg: "No se pudo guardar correctamente la imagen."
//                 });
//             }

//             imageIds.push(`${process.env.BASE_URL}/images/${image._id}`);
//             fs.rm(`./temp/imgs/${file.filename}`, error => {
//                 if (error) {
//                     console.log("Lo sentimos, no hemos podido eliminar el archivo");
//                 }
//                 console.log("El archivo se ha eliminado correctamente");
//             });
//         }

//         const product = await Products.create({
//             ...body,
//             img1: imageIds[0] || "",
//             img2: imageIds[1] || "",
//             img3: imageIds[2] || "",
//             img4: imageIds[3] || ""
//         });

//         if (!product) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: "No se pudo crear el producto."
//             });
//         }

//         res.json({
//             ok: true,
//             product,
//             msg: "Se ha creado el producto correctamente."
//         });
//     } catch (error) {
//         console.log("Ha habido un error al crear el producto.", error);

//         res.status(500).json({
//             ok: false,
//             msg: "Ha habido un error con el servidor"
//         });
//     }
// };
///////////////////////////////////

export const getProducts = async (req, res) => {

    const {search} = req.query;
    
    try {
        const searchBy = search ? { name: new RegExp(search, "i") } : {}

        // const products = await Products.find({ name: new RegExp(search) } )
        const products = await Products.find({...searchBy, deletedAt: {$in: [null, undefined]}})

        if (!Array.isArray(products)) {
            throw new Error("La respuesta no es un array");
        }

        res.json({
            ok: true,
            products
        })
    } catch (error) {
        console.log("Ha habido un error al obtener los productos.")
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error con el servidor"
            })
    }
}

export const editProduct = async (req, res) => {
    const {id} = req.params
    const {body, file} = req
    try {
        const product = await Products.findById(id)

        if (!product || product.deletedAt) {
            return res.status(404)
                .json({
                    ok: false,
                    msg: "Producto no encontrado o id inválido"
                })
        }

        let imageUrl = product.imgUrl

        if (file) {
            const imageBuffer = fs.readFileSync(`./temp/imgs/${file.filename}`)
        
            const image = await Images.create({
                fileName: file.filename,
                img: {
                    data: imageBuffer,
                    contentType: "image/png"
                }
            })
            
            if (!image) {
                return res.status(400)
                    .json({
                        ok: false,
                        msg: "No se pudo guardar correctamente la imagen."
                    })
            }

            fs.rm(`./temp/imgs/${file.filename}`, error => {
                    if (error) {
                        console.log("Lo sentimos, no hemos podido eliminar el archivo")
                    }
                    console.log("El archivo se ha eliminado correctamente")
                })
                
            imageUrl =`${process.env.BASE_URL}/images/${image._id}`
        }

        const productUpdated = await Products.findByIdAndUpdate(id, {
            ...body,
            imgUrl: imageUrl
        }, { new: true });

        res.json({
            ok: true,
            product: productUpdated,
            msg: "El producto se actualizò correctamente."
        })
    } catch (error) {
        console.log("Ha habido un error al editar el producto.")
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error con el servidor"
            })
    }
}

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const product = await Products.findById(id);

        if (!product || product.deletedAt) {
            return res.status(404).json({
                ok: false,
                msg: "El producto no fue encontrado."
            })
        }

        await Products.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });

        res.json({
            ok: true,
            msg: "Producto elemininado correctamente"
        })

    } catch (error) {
        console.log("Ha habido un error al editar el producto.")
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error con el servidor"
            })
    }
}