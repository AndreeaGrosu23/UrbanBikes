import React, { useState, useEffect } from 'react';
import './Home.css';
import CarouselPage from '../carousel/CarouselPage';
// import axios from 'axios';
// import { Card, CardColumns } from "react-bootstrap";
// import { Link } from 'react-router-dom';
import GoogleMap from '../map/GoogleMap';


function Home() {

    // const [networks, setNetworks] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //       const result = await axios(
    //         'http://api.citybik.es/v2/networks',
    //       );
    //       console.log(result);
    //       setNetworks(result.data.networks);
    //     };
     
    //     fetchData();
    //   }, []);

    // console.log(networks);

    return (
        <div className="home-container" style={{ paddingTop: "10px"}}>
            <div className="container">
                <CarouselPage></CarouselPage>

                <GoogleMap></GoogleMap>

                {/* <CardColumns style={{ padding: 20 }}>

                { networks.map((network) => {
                    
                    return (
                    
                    <Card>
                        <Card.Body>
                        <Card.Title>{network.name} </Card.Title>
                        <Card.Text>
                            {network.location.city}
                        </Card.Text>
                        <Card.Text>
                            <Link to="/" linkapi={network.href}>Visit stations</Link>
                        </Card.Text>
                        </Card.Body>
                    </Card>
                    
                    
                    )  
                        
                })}
                </CardColumns> */}
            </div>
            <div id="attribute">Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            
        </div>
    )   
}

export default Home;