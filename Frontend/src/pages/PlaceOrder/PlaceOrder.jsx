import React, { useContext, useEffect, useState } from 'react';
import './Placeorder.css';
import { StoreContext } from '../../Context/Storecontext';
import axios from 'axios';

const Placeorder = () => {
  const {getTotalcartAmount,token,food_list,cartItems = {},url}=useContext(StoreContext);
  
  //state variables for storing the information of form filled
  const [data, setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  //function for saving the data on input field 
  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event)=>{
  event.preventDefault();
  //geting all data of the cart items
  let orderItems = [];
  food_list.map((item)=>{
   if (cartItems[item._id] && cartItems[item._id] > 0) {

      let itemInfo =item;
      itemInfo["quantity"] = cartItems[item._id];
      orderItems.push(itemInfo);
    }
  });
  
  let orderData ={
 
    adress:data,
    items:orderItems,
    amount:getTotalcartAmount()+2,
  };
/**************************/
//api request for order
  try {
    let response = await axios.post(url + "/api/order/place", orderData, {
  headers: {
    Authorization: `Bearer ${token}`, 
  },
});

  if(response.data.success){
   
   const session_url = response.data.session_url;
   //sending user to session url if payment succeced 
   window.location.replace(session_url);
  }
  else{
     console.error("Server responded with success: false", response.data);
    }
}
catch (error) {
    //  Log full error object
    console.error(" Error while placing order:", error);
  }
};


  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='tittle'>Delivery Information</p>
        <div className='multi-fields'>
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First-name' />
          <input required  name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last-name' />
        </div>
        <input required  name="email" onChange={onChangeHandler} value={data.email} type='email' placeholder='Email-Adress' />
        <input required  name="street" onChange={onChangeHandler} value={data.street} type='text' placeholder='Street' />
        <div className='multi-fields'>
          <input required  name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required  name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className='multi-fields'>
          <input required  name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required  name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input  required name="phone" onChange={onChangeHandler} value={data.phone} type='text' placeholder='phone' />
      </div>
      
      
      <div className='place-order-right'>
        <div className='cart-total'>
          <h2>cart Totals</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>₹{getTotalcartAmount()}</p>
            </div>
            <hr/>
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>₹{getTotalcartAmount()===0 ?0:2}</p>
            </div>
            <hr></hr>
            <div className='cart-total-details'>
              <b>Total</b>
              <b>₹{getTotalcartAmount()===0?0:getTotalcartAmount()+2}</b>
            </div>
           </div>
            <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default Placeorder