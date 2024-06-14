import express from "express";

import { createProduct, deleteProduct, editProduct, getProducts } from "../controllers/productsController.js";

import upload from "../libs/storage.js";


const route = express.Router()

route
    .post("/", upload.single("image"), createProduct)
    //.post("/", upload.array("images", 4), createProduct)

    .get("/", getProducts)

    .put("/edit/:id", upload.single("image"), editProduct)
    //.put("/edit/:id", upload.array("images", 4), editProduct)

    .delete("/delete/:id", deleteProduct)

export default route;