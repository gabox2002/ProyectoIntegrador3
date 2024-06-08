import { Schema, model } from "mongoose";


const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    brand: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    longDesc: {
        type: String,
        required: true
    },
    delivery: {
        type: Boolean,
        default: false
    },
    ageFrom: {
        type: Number,
        default: 0
    },
    ageTo: {
        type: Number,
        default: 99
    },
    img1: {
        type: String,
        required: true,
    },
    img2: {
        type: String
    },
    img3: {
        type: String
    },
    img4: {
        type: String
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: true })

export const Products = model("Products", ProductSchema)