import React, { useState, useRef, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import useSwr from 'swr';
import useSupercluster from 'use-supercluster';
import { Link } from 'react-router-dom';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
import "@reach/combobox/styles.css";
import "./map.css";

const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({children}) => children;

function GoogleMapBikes() {

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
            city: network.location.city        
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

    const panTo = useCallback(({lat, lng}) => {
        mapRef.current.panTo({lat, lng});
        mapRef.current.setZoom(12);
    }, []);

    return (
        <div>
            
            <div style={{ height: '80vh', width: '100%', marginBottom: "20px"}}>

                
                <Search panTo={panTo} />
                <Locate panTo={panTo} />
                <GoogleMapReact 
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY}}
                defaultCenter={{ lat: 44.4268, lng: 26.1025 }} 
                defaultZoom= {2}
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
                                <button className="network-marker"
                                // onClick={() => {
                                //     mapRef.current.setZoom(12);
                                //     mapRef.current.panTo({lat: latitude, lng: longitude});
                                // }}
                                >
                                    <Link to={{
                                        pathname: `/stations/${cluster.properties.networkId}`,
                                        state: {network_id: cluster.properties.networkId,
                                        city: cluster.properties.city,
                                        latitude: latitude,
                                        longitude: longitude}
                                        }}>
                                        <img src="./cycling.svg" alt="network"></img>
                                    </Link>
                                </button>
                            </Marker>
                        );
                    })}

                </GoogleMapReact>
                
            </div>
        </div>
    );
}

function Locate({ panTo }) {
    return ( 
    <button className="locate" onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
            panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }, () => null);
    }}>
        <img src="compass.svg" alt="compass - locate me"/>
    </button>
    )
}

function Search({ panTo }) {
    const {
        ready, 
        value, 
        suggestions: {status, data}, 
        setValue, 
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 44.4268, lng: () => 26.1025 },
            radius: 100 * 1000,
        },
    });

    return ( 
        <div className="search">
            <Combobox onSelect={async (address) => {
                setValue(address, false);
                clearSuggestions();
                try {
                    const results = await getGeocode({address});
                    const { lat, lng } = await getLatLng(results[0]);
                    panTo({ lat, lng });
                } catch(error) {
                    console.log("error!");
                }
            }}
            >
                <ComboboxInput value={value}
                    onChange={(e) => {
                    setValue(e.target.value);
                    }}
                    disables={!ready}
                    placeholder="Enter a city"
                />
                <ComboboxPopover>
                    <ComboboxList>
                    {status === "OK" && data.map(({id, description}) => (
                        <ComboboxOption key={id} value={description} />
                    ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}

export default GoogleMapBikes;