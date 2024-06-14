// import { Cart } from "../models/Cart.js"

// export const createCart = async (req, res) => {
//     try {
//         const newCart = await Cart.create(req.body)
        
//         const cart = await Cart.findById(newCart._id)
//                                 .populate({
//                                     path: "items",
//                                     populate: {
//                                         path: "product"
//                                     }
//                                 })

//         res.json({
//             ok: true,
//             cart
//         })

//     } catch (error) {
//         console.log("Ha habido un error al editar el producto.")
//         res.status(500)
//             .json({
//                 ok: false,
//                 msg: "Ha habido un error con el servidor"
//             })
//     }
// }

// export const editCart = async (req, res) => {
//     const {id} = req.params;

//     try {
//         const cartFinded = await Cart.findById(id);
//         if (!cartFinded) {
//             return res.status(400).json({
//                 ok: false,
//                 msg: "No existe el carrito a editar"
//             })
//         }

//         const newCart = await Cart.findByIdAndUpdate(id, req.body, {new: true})
//                                 .populate({
//                                     path: "items",
//                                     populate: {
//                                         path: "product"
//                                     }
//                                 })

//         res.json({
//             ok: true,
//             cart: newCart,
//             msg: "Carrito actualizado con éxito."
//         })

//     } catch (error) {
//         console.log("Ha habido un error al editar el producto.")
//         res.status(500)
//             .json({
//                 ok: false,
//                 msg: "Ha habido un error con el servidor"
//             })
//     }
// }

// export const getById = async (req, res) => {
//     const {id} = req.params;
//     try {
//         const cart = await Cart.findById(id)
//                         .populate({
//                             path: "items",
//                             populate: {
//                                 path: "product"
//                             }
//                         })

//         res.json({
//             ok: true,
//             cart
//         })
//     } catch (error) {
//         console.log("Ha habido un error al editar el producto.")
//         res.status(500)
//             .json({
//                 ok: false,
//                 msg: "Ha habido un error con el servidor"
//             })
//     }
// } 

// cartController.js

import { Cart } from "../models/Cart.js";
import { Products } from "../models/Products.js";

export const createCart = async (req, res) => {
    const { items } = req.body;

    try {
        // Aquí validamos que todos los productos existan antes de crear el carrito
        const productIds = items.map(item => item.product);
        const existingProducts = await Products.find({ _id: { $in: productIds } });

        if (existingProducts.length !== items.length) {
            return res.status(400).json({
                ok: false,
                msg: "Alguno de los productos seleccionados no existe."
            });
        }

        const newCart = await Cart.create({ items });

        res.status(201).json({
            ok: true,
            cart: newCart,
            msg: "Carrito creado exitosamente."
        });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({
            ok: false,
            msg: "Ha habido un error al crear el carrito."
        });
    }
};

export const editCart = async (req, res) => {
    const { id } = req.params;

    try {
        const cartFinded = await Cart.findById(id);
        if (!cartFinded) {
            return res.status(400).json({
                ok: false,
                msg: "No existe el carrito a editar"
            });
        }

        // Aquí también validamos los productos antes de actualizar el carrito
        const productIds = req.body.items.map(item => item.product);
        const existingProducts = await Products.find({ _id: { $in: productIds } });

        if (existingProducts.length !== req.body.items.length) {
            return res.status(400).json({
                ok: false,
                msg: "Alguno de los productos seleccionados no existe."
            });
        }

        const newCart = await Cart.findByIdAndUpdate(id, req.body, { new: true });

        res.json({
            ok: true,
            cart: newCart,
            msg: "Carrito actualizado con éxito."
        });

    } catch (error) {
        console.log("Ha habido un error al editar el carrito.", error);
        res.status(500).json({
            ok: false,
            msg: "Ha habido un error con el servidor"
        });
    }
};

export const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findById(id)
                        .populate({
                            path: "items",
                            populate: {
                                path: "product"
                            }
                        });

        res.json({
            ok: true,
            cart
        });
    } catch (error) {
        console.log("Ha habido un error al obtener el carrito.", error);
        res.status(500).json({
            ok: false,
            msg: "Ha habido un error con el servidor"
        });
    }
};
