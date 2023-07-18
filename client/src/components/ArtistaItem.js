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

    // delete song function
    // const disableSong = async (id) => {
    //     try {
    //         console.log('song id to disable: ', id);
    //         let disabledUser = {};
    //         const disableSong = await fetch(`http://localhost:5000/songs/${id}`, {
    //             method: "DELETE"
    //         })
    //             .then(response => response.json());

    //         console.log('disableSong: ');
    //         console.log(disableSong.rowCount);

    //         if(disableSong.rowCount > 0) {
    //             setSongs(songs.map((song) => song.id === id ? { ...song, enabled: false } : song));
    //             setDisplayedSongs(songs.map((song) => song.id === id ? { ...song, enabled: false } : song));
    //         }

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // // enable song function
    // const enableSong = async (id, song) => {
    //     try {
    //         let bodyJSON = { 
    //             description: song.description, 
    //             email: song.mail, 
    //             firstname: song.name, 
    //             lastname: song.last_name, 
    //             songType: song.type, 
    //             enabled: true
    //         };
    //         const enabledSong = await fetch(
    //             `http://localhost:5000/songs/${id}`,
    //             {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify(bodyJSON)
    //             }
    //         )
    //             .then(response => response.json());

    //         console.log('enabledSong: ');
    //         console.log(enabledSong.id);

    //         if(enabledSong.id) {
    //             setSongs(songs.map((song) => song.id === id ? { ...song, enabled:true } : song));
    //             setDisplayedSongs(songs.map((song) => song.id === id ? { ...song, enabled:true } : song));
    //         }

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // useEffect(() => {
    //     handleClose()
    // }, [user])

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