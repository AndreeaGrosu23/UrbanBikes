import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns"; 
import "./Stations.css";

function BikeStations() {

    const {state} = useLocation();

    const id = state.network_id;
    const city = state.city;

    const [stations, setStations] = useState([]);

    const mapRef = useRef();

    const [selected, setSelected] = useState(null);

    const mapContainerStyle = {
        height: "80vh",
        width: "100vw",
    };

    const options = {
        disableDefaultUI: true,
        zoomControl: true,
    };

    const center = {
        lat: state.latitude,
        lng: state.longitude,
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY
    });

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

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

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <div>
            <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={16}
                center={center}
                options={options}
                
                onLoad={onMapLoad}
            >
               {stations.map((station) => (
                    <Marker className="network-marker"
                        key={`${station.latitude}-${station.longitude}`}
                        position={{ lat: station.latitude, lng: station.longitude }}
                        onClick = {() => {
                            setSelected(station);
                        }}
                        icon={{
                            url: `/cycling.svg`,
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                            scaledSize: new window.google.maps.Size(30, 30),
                        }} 
                    />
                ))};

                {selected ? (
                    
                    <InfoWindow
                        position={{ lat: selected.latitude, lng: selected.longitude}}
                        onCloseClick={() => {
                            setSelected(null);
                        }}
                    >
                        <div>
                            <h4>
                                {selected.name}
                            </h4>
                            <p>Free Bikes: {selected.free_bikes}</p>
                            <p>Empty Slots: {selected.empty_slots}</p>
                            <p><i>Last updated: {selected.timestamp.slice(0,10)} at {selected.timestamp.slice(12,16)} </i></p>
                        </div>
                    </InfoWindow>
                ) : null }

            </GoogleMap>
        </div>
    );
}

export default BikeStations;