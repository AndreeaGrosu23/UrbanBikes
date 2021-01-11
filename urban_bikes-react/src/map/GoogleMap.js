import React from 'react';
import GoogleMapReact from 'google-map-react';

function GoogleMap() {

    return (
        <div style={{ height: '100vh', width: '100%', padding: '20px' }}>
            <GoogleMapReact 
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }} 
            defaultCenter={{ lat: 44.4268, lng: 26.1025 }} 
            defaultZoom= {10}
            ></GoogleMapReact>
        </div>
    );
}

export default GoogleMap;