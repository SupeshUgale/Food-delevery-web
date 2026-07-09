
import orderModel from '../models/orderModel.js';

import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Check if a real Stripe key is configured
const stripeKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = stripeKey && stripeKey !== "sk_test_your_stripe_key_here" && stripeKey.startsWith("sk_");

let stripe = null;
if (isStripeConfigured) {
  stripe = new Stripe(stripeKey);
  console.log("✅ Stripe is configured — real payments enabled.");
} else {
  console.warn("⚠️  Stripe key not configured. Using mock payment mode for development.");
}


//placing the order from frontend

const placeOrder = async (req,res)=>{

    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try{
   const newOrder = new orderModel({
    userId:req.userId,
    items:req.body.items,
    adress:req.body.adress,
    amount:req.body.amount,
    status: "Food Processing",
    payment: false,
    date: new Date().toISOString()
   })
   await newOrder.save();
   await userModel.findByIdAndUpdate(req.userId, {cartData:{}});

  // If Stripe is not configured, use mock payment (redirect directly to success)
  if (!isStripeConfigured) {
    console.log("💳 Mock payment: auto-approving order", newOrder._id);
    const mock_session_url = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;
    return res.json({ success: true, session_url: mock_session_url });
  }

  const line_items = req.body.items.map((item) => ({
  price_data: {
    currency: "inr",
    product_data: {
      name: item.name,
    },
    unit_amount: item.price * 100 ,
  },
  quantity: item.quantity,
}));

line_items.push({
  price_data: {
    currency: "inr",
    product_data: {
      name: "Delivery Charges",
    },
    unit_amount: 2 * 100  ,
  },
  quantity: 1,
});

  
const session = await stripe.checkout.sessions.create({
    line_items:line_items,
    mode:'payment',
    success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
})

res.json({success:true,session_url:session.url})
    }
    
catch(error){
  console.error(" Order placement error:", error);
  console.log(error);
   res.json({success:false,message:error.message})
    }
}


//to verify if the payment is done then update payment from default false to true
//And if false then delete from order collection
const verifyOrder = async (req,res)=>{
    const {orderId,success} =req.body;
    try{
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Not Paid"});
        }
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//user orders for frontend,so that user can it its all orders on userorderpage
const userOrders = async (req,res)=>{
  try{
    const orders = await orderModel.find({userId:req.userId});
    res.json({success:true, data:orders})
  }
  catch(error){
    console.log(error);
    res.json({success:false, message:"error"})
  }
}

//Listing all the orders of all the users for admin pannel

const listOrders = async (req,res) =>{

try{
  const orders = await orderModel.find({});
  res.json({success:true, data:orders});
}
catch(error){
  res.json({success:false, message:"Error"})
}
}



//api for updating order status
const updateStatus = async(req,res)=>{
try{
   await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
  
  res.json({success:true, message:"status Updated"})
}
catch(error){
  console.log(error);
  res.json({success:false, message:error.message})
}
}


export {placeOrder,verifyOrder,userOrders, listOrders,updateStatus}