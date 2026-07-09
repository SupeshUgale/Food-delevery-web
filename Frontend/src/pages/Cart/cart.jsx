import React, { useContext } from 'react';
import './cart.css'
import { StoreContext } from '../../Context/Storecontext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  
  const { cartItems = {}, food_list, removeFromCart,getTotalcartAmount,url } = useContext(StoreContext)
//for navugating to the placeordr page
const navigate=useNavigate();
  return (
    <div>
      <div className='cart'>
        <div className='cart-items'>
          <div className='cart-item-tittle'>
            <p>Items</p>
            <p>Tittle</p>
            <p>price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br/>
          <hr/>
          {food_list.map((item,)=>{
            if(cartItems[item._id]>0){
              return(
               <div key={item._id}>
                <div className='cart-item-tittle cart-items-item'>
                  <img src={(typeof item.image === 'string' && (item.image.startsWith('/') || item.image.startsWith('data:') || item.image.startsWith('http') || item.image.includes('blob:'))) ? item.image : url + "/images/" + item.image}></img>
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price*cartItems[item._id]}</p>
                  <p onClick={()=>removeFromCart(item._id)}className='cross'>x</p>

              </div>
              <hr/>
              </div>
               
               
              )
            }
          })}
        </div>
      </div>
      <div className='cart-bottom'>
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
            <button onClick={()=>navigate('/order')}>CHECKOUT</button>
        </div>
        <div className='cart-promocode'>
          <div>
            <p>If you have a promo code,Enter it here</p>
            <div className='cart-promocode-input'>
              <input type='text' placeholder='promocode'></input>
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart