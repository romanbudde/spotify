import React, { Fragment, useEffect, useState, useRef } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import moment from 'moment';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircle, faCircleCheck, faMoneyBillWave, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { GoogleMap, LoadScript, useLoadScript, MarkerF, useJsApiLoader, Circle, CircleF, SymbolPath } from "@react-google-maps/api";
import '../css/calendar.css';

const VerMapaSede = ({ sede, show, onClose }) => {

    const [currentLocation, setCurrentLocation] = useState(null);
    const [map, setMap] = useState();
    const [stillLocatingYouMessage, setStillLocatingYouMessage] = useState(true);
    const accuracyCircle = useRef(null);
    console.log('current Location: ', currentLocation);

    useEffect(() => {
        if (navigator.geolocation) {
            

            navigator.geolocation.getCurrentPosition( position => {
                setStillLocatingYouMessage(false);
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                console.log('current locationnn: ', position.coords);
                const errorRange = position.coords.accuracy;
                // if (accuracyCircle.current) {
                //     accuracyCircle.current.setMap(null);
                // }
                // accuracyCircle.current = new google.maps.Circle({
                //     center: position.coords,
                //     fillColor: color['blue-700'],
                //     fillOpacity: 0.4,
                //     radius: errorRange,
                //     strokeColor: color['blue-200'],
                //     strokeOpacity: 0.4,
                //     strokeWeight: 1,
                //     zIndex: 1,
                // });
                // accuracyCircle.current.setMap(mapObject); // ADDED
            },
            (error) => {
                console.error('Error getting the current location:', error);
            });
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDdEqsnFUhTgQJmNN1t4iyn3VhMLJY6Yk4"
    })

    const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const navigate = useNavigate();
	const cookies = new Cookies();

    const center = {
        lat: parseFloat(sede.latitude),
        lng: parseFloat(sede.longitude)
    };

    const containerStyle = {
        width: '300px',
        height: '600px'
    };

    const blueDot = {
        fillColor: 'red',
        fillOpacity: 1,
        scale: 8,
        strokeColor: 'green',
        strokeWeight: 2,
    };

    if(!show) return null;

    return (
        <Fragment>
            {/* <LoadScript
            googleMapsApiKey="AIzaSyDdEqsnFUhTgQJmNN1t4iyn3VhMLJY6Yk4"
            >
            </LoadScript> */}

            <div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
                <div className='flex flex-col relative w-5/6 max-h-screen'>
                    <button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className='bg-white p-5 rounded flex flex-col gap-5 items-center justify-center'>
                        <p>Google maps</p>
                        { isLoaded ? (
                            <>
                                <GoogleMap
                                    mapContainerStyle = {containerStyle}
                                    center = {center}
                                    zoom = {15}
                                    onLoad = {map => setMap(map)}
                                >
                                    <>
                                        <MarkerF
                                            position={center}
                                        />
                                        {currentLocation && (
                                        <>
                                            <MarkerF
                                                position={currentLocation}
                                                icon={{
                                                    path: window.google.maps.SymbolPath.CIRCLE,
                                                    fillColor: '#4285F4',
                                                    fillOpacity: 1,
                                                    strokeColor: 'white',
                                                    strokeWeight: 2,
                                                    scale: 8
                                                    // url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToc9tHuRl0_jAOBSnFblVXbCrBCKRKQj0ZAykfMpABo4lYC1EgbXWQTUIwPqYUvVAWJ5s&usqp=CAU',
                                                    // scale: 5.0
                                                }}  
                                            />
                                            {/* <MarkerF
                                                position = {currentLocation}
                                                label = 'currentLocation'
                                            /> */}
                                            <CircleF
                                                radius={150}
                                                visible={true}
                                                options={{
                                                    fillColor: '#61a0bf',
                                                    fillOpacity: 0.25,
                                                    strokeColor: 'grey',
                                                    strokeOpacity: 0.4,
                                                    strokeWeight: 1,
                                                    zIndex: 1,
                                                }}
                                                center={{ 
                                                    lat: currentLocation.lat,
                                                    lng: currentLocation.lng
                                                }}
                                            >
                                            </CircleF>
                                        </>
                                        )}
                                    </>
                                </GoogleMap>
                                <button 
                                    onClick={()=> map.panTo({lat: currentLocation.lat, lng: currentLocation.lng})}
                                    className='w-full py-3'
                                    disabled={stillLocatingYouMessage}
                                >
                                    Ver mi ubicacion
                                </button>
                                {stillLocatingYouMessage && (
                                    <p className='font-medium py-2'>Buscando su ubicación, aguarde...</p>
                                )}
                            </>
                        ) : (
                            <p>Cargando mapa</p>
                        )}

                    </div>
                </div>
            </div>
            
        </Fragment>
    );
}

export default VerMapaSede;