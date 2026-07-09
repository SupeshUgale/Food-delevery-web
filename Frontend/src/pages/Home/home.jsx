import React, { useState } from 'react'
import './Home.css';
import Header from '../../Components/Header/Header.jsx';
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu.jsx';

import Fooddisplay from '../../Components/Fooddisplay/Fooddisplay.jsx';
import AppDownload from '../../Components/AppDownload/AppDownload.jsx';

const Home = () => {
     const [category, setCategory]=useState("All")
    return (
    <div>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>

        <Fooddisplay  category={category}/>
        <AppDownload></AppDownload>
    </div>
  )
}

export default Home