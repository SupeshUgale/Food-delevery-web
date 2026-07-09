import React from 'react'
import './Exploremenu.css'
import { menu_list } from '../../assets/assets'
const ExploreMenu = ({category,setCategory}) => {
     
    return (
    <div className='explore-menu' id='explore-menu'>
          <h1>Explore our menu</h1>
          <p className='explore-menu-text'>choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.Our mission is satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
          <div className='explore-menu-list'>
          {/*here we are creating a map finction to map our created menu items on our exploremenu page so that we can display them */}
            
            {menu_list.map((item,index)=>{
                return(
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name? "All":item.menu_name)} key={index} className='explore-menu-list-item'>
                    <img className={category===item.menu_name?"active":""}src={item.menu_image} alt=''></img>
                    <p>{item.menu_name}</p>
                    </div>
                   
                )
            })}
          </div>
          <hr/>
    </div>
  
  )
}

export default ExploreMenu;