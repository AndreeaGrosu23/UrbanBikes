import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import "./Stations.css";

const Marker = ({children}) => children;

function BikeStations() {

    const {state} = useLocation();

    const id = state.network_id;
    const city = state.city;

    console.log(city);

    const [stations, setStations] = useState([]);

    const mapRef = useRef();
    const [zoom, setZoom] = useState(10);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          const result = await axios(
            `http://api.citybik.es/v2/networks/${id}`,
          );
          console.log(result.data.network);
          setStations(result.data.network.stations);
        };
     
        fetchData();
      }, []);

    console.log(stations);

    const points = stations.map(station => ({
        type: "Feature",
        properties: {
            cluster: false,
            name: station.name,
            free_bikes: station.free_bikes,
            empty_slots: station.empty_slots,
            id: station.id      
        },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(station.longitude),
                parseFloat(station.latitude)
            ]
        }
    }));

    const {clusters, supercluster} = useSupercluster({
        points,
        bounds,
        zoom,
        options: {radius: 75, maxZoom: 20}
    });

    return (
        <div>
            { stations.length === 0 ? 
            <p style={{ textAlign: "center"}}>No info for stations in {city}</p> 
            :
            <p style={{ textAlign: "center"}}>Here are your stations in {city}</p> 
            } 
            <div style={{ height: '80vh', width: '100%', marginBottom: "20px"}}>
                <GoogleMapReact 
                    bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY}} 
                    defaultCenter={{ lat: state.latitude, lng: state.longitude }} 
                    defaultZoom= {12}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map }) => {
                        mapRef.current=map;
                    }}
                    onChange={({ zoom, bounds}) =>{
                        setZoom(zoom);
                        setBounds([
                            bounds.nw.lng,
                            bounds.se.lat,
                            bounds.se.lng,
                            bounds.nw.lat
                        ]);
                    }}
                >
                    {clusters.map(cluster => {
                        const [longitude, latitude] = cluster.geometry.coordinates;
                        const {cluster: isCluster, point_count: pointCount} = cluster.properties;

                        if (isCluster) {
                            return (
                                <Marker key={cluster.id} 
                                lat={latitude} 
                                lng={longitude}
                                >
                                    <button className="network-marker" 

                                        onClick={() => {
                                            const expansionZoom = Math.min(
                                                supercluster.getClusterExpansionZoom(cluster.id),
                                                20
                                            );
                                            mapRef.current.setZoom(expansionZoom);
                                            mapRef.current.panTo({lat: latitude, lng: longitude});
                                        }}
                                    >
                                    
                                        <img src="../../bicycle.svg" alt="station-cluster"></img>
                                    </button>
                                </Marker>
                            )
                        }

                        return (
                            <Marker key={cluster.properties.id} 
                                lat={latitude} 
                                lng={longitude}
                                
                                >  
                                <button className="network-marker"
                                    onClick={() => {
                                        mapRef.current.setZoom(16);
                                        mapRef.current.panTo({lat: latitude, lng: longitude});
                                    }}
                                >
                                 
                                    <img src="../../bicycle.svg" alt="station"></img>
                                </button>
                            </Marker>
                        );
                })} 

                </GoogleMapReact>

                
            </div>
        </div>
    );
}

export default BikeStations;