import React, { useState, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import useSwr from 'swr';
import useSupercluster from 'use-supercluster';

const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({children}) => children;

function GoogleMap() {

    const mapRef = useRef();
    const [zoom, setZoom] = useState(10);
    const [bounds, setBounds] = useState(null);

    const url = "http://api.citybik.es/v2/networks";
    const {data, error} = useSwr(url, fetcher);
    const networks = data && !error ? data.networks : [];

    const points = networks.map(network => ({
        type: "Feature",
        properties: {
            cluster: false,
            networkId: network.id,
            country: network.location.country         
        },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(network.location.longitude),
                parseFloat(network.location.latitude)
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
        <div style={{ height: '100vh', width: '100%', padding: '20px' }}>
            <GoogleMapReact 
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }} 
            defaultCenter={{ lat: 44.4268, lng: 26.1025 }} 
            defaultZoom= {10}
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
                            lng={longitude}>
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
                                
                                    <img src="./cycling.svg" alt="network"></img>
                                </button>
                            </Marker>
                        )
                    }

                    return (
                        <Marker key={cluster.properties.networkId} 
                            lat={latitude} 
                            lng={longitude}
                        >   
                            <button className="network-marker">
                                <img src="./cycling.svg" alt="network"></img>
                            </button>
                        </Marker>
                    );
                })}

            </GoogleMapReact>
        </div>
    );
}

export default GoogleMap;