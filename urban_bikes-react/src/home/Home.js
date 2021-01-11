import React from 'react';
import './Home.css';
import CarouselPage from '../carousel/CarouselPage';

function Home() {

    return (
        <div className="home-container">
            <div className="container">
                <CarouselPage></CarouselPage>
            </div>
        </div>
    )
    
}

export default Home;