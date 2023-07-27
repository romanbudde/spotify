import React, { Fragment, useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import moment from 'moment';
import EditArtist from './EditArtist';
import UserEditData from './UserEditData';

const ArtistaItem = ({ artist, artists, setArtists, displayedArtists, setDisplayedArtists }) => {

    console.log('artist at ArtistaItem: ', artist);

    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

    return (
        <>
            <div
                className={`p-5 m-2 w-1/2 rounded-md flex flex-col items-start text-black bg-green-300 font-medium shadow-lg relative`}
                key={artist.id}
            >
                <p>{artist.name}</p>
                {/* {
                    artist.enabled ? (
                        <button
                            className='bg-red-700 text-white hover:bg-red-500 font-semibold hover:text-white py-2 px-4 rounded'
                            onClick={() => disableArtist(artist.id)}
                        >
                            Desactivar
                        </button>

                    ) : (
                        <button
                            className='bg-green-700 text-white hover:bg-green-500 font-semibold hover:text-white py-2 px-4 border border-green-600 hover:border-transparent rounded'
                            onClick={() => enableArtist(artist.id, artist)}
                        >
                            Activar
                        </button>
                    )
                } */}

                <FontAwesomeIcon
                    icon={faPenToSquare}
                    className='text-2xl absolute right-5 hover:scale-110'
                    onClick={handleShow}
                />
                <EditArtist
                    artist={artist}
                    artists={artists}
                    setArtists={setArtists}
                    displayedArtists={displayedArtists}
                    setDisplayedArtists={setDisplayedArtists}
                    show={showEditModal}
                    onClose={handleClose}
                />
            </div>
        </>
    )
}

export default ArtistaItem;