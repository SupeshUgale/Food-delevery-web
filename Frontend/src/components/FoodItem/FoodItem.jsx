import React, { useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { StoreContext } from '../../Context/Storecontext';
const FoodItem = ({id,name,price,description,image}) => {
    //creating a button on image so that we can add it to the cart
    
    const {cartItems,addToCart,removeFromCart,url} =useContext(StoreContext)
  

    return (
    //creating the food_list component which will have the following information and then it display it in foodDisplay
    // also added the count to cart functionality with usestate using plus and minus icon using context
    <div className='food-item'>
        <div className='food-item-img-container' >
            {/*adding route to the images so they can display from db or fallback to local assets*/}
            <img className='food-item-iamge' src={(typeof image === 'string' && (image.startsWith('/') || image.startsWith('data:') || image.startsWith('http') || image.includes('blob:'))) ? image : url + "/images/" + image}></img>
           {!(cartItems?.[id] > 0)
  ? <img className="add" onClick={() => addToCart(id)} src={assets.add_icon_white} />
  : <div className='food-item-counter'>
      <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} />
      <p>{cartItems?.[id]}</p>
      <img onClick={() => addToCart(id)} src={assets.add_icon_green} />
    </div>
}

        </div>
       

        <div className='food-item-info'>
            <div className='food-item-rating'>
                <p>{name}</p>
                <img src={assets.rating_starts}></img>
            </div>
            <p className='food-item-description'>{description}</p>
            <p className='food-item-price'>₹{price}</p>
            

        </div>
        
    </div>
   
)}

export default FoodItem;