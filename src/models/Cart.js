import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    items: [{
        quantity: {
            type: Number,
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true
        }
    }]
}, {timestamps: true})

export const Cart = model("Cart", CartSchema);

// import { Schema, model } from "mongoose";

// const cartSchema = new Schema({
//     items: [
//         {
//             quantity: { type: Number, required: true },
//             product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
//         }
//     ],
// });

// export const Cart = model('Cart', cartSchema);