import express from "express";

import { createProduct, deleteProduct, editProduct, getProducts } from "../controllers/productsController.js";

import upload from "../libs/storage.js";


const route = express.Router()

route
    // .post("/", upload.single("img1"), createProduct)   //OJO
    .post("/", upload.single("image"), createProduct)

    .get("/", getProducts)

    .put("/edit/:id", upload.single("image"), editProduct)
    
    .delete("/delete/:id", deleteProduct)

export default route;