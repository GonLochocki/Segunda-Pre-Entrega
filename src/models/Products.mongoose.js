import {Schema, model} from "mongoose";
import { randomUUID} from "crypto";

const productSchema = new Schema({
    _id: {type: String, default: randomUUID, require: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    status: {type: Boolean, default: true},
    thumbnail: {type: String, required: true},
    stock: {type: Number, required: true},
    code: {type: String, required: true}    
},{
    versionKey: false,
    strict: "throw"
})

export const Product = model("products", productSchema);