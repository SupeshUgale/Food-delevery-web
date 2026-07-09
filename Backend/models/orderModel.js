import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{type:String, required :true},
    items:{type:Array, required:true},
    amount:{type:Number,required:true},
    adress:{type:Object,required:true},
    status:{type:String, default:"Food Processing"},
    date:{type:Date, default:Date.now},
    payment:{type:Boolean, default:false}
})

import createModelWrapper from "../config/dbMock.js";

const orderModelReal = mongoose.models.order || mongoose.model("order", orderSchema);
const orderModel = createModelWrapper("order", orderModelReal);

export default orderModel;