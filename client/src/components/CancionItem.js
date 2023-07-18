import React, { Fragment, useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import moment from 'moment';
import EditSede from './EditSede';
import UserEditData from './UserEditData';

const SongItem = ({ song, songs, setSongs, displayedSongs, setDisplayedSongs }) => {

    console.log('song at songItem: ', song);

    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

    // delete song function
    const disableSong = async (id) => {
        try {
            console.log('song id to disable: ', id);
            let disabledUser = {};
            const disableSong = await fetch(`http://localhost:5000/songs/${id}`, {
                method: "DELETE"
            })
                .then(response => response.json());

            console.log('disableSong: ');
            console.log(disableSong.rowCount);

            if(disableSong.rowCount > 0) {
                setSongs(songs.map((song) => song.id === id ? { ...song, enabled: false } : song));
                setDisplayedSongs(songs.map((song) => song.id === id ? { ...song, enabled: false } : song));
            }

        } catch (error) {
            console.error(error);
        }
    }

    // enable song function
    const enableSong = async (id, song) => {
        try {
            let bodyJSON = { 
                description: song.description, 
                email: song.mail, 
                firstname: song.name, 
                lastname: song.last_name, 
                songType: song.type, 
                enabled: true
            };
            const enabledSong = await fetch(
                `http://localhost:5000/songs/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            )
                .then(response => response.json());

            console.log('enabledSong: ');
            console.log(enabledSong.id);

            if(enabledSong.id) {
                setSongs(songs.map((song) => song.id === id ? { ...song, enabled:true } : song));
                setDisplayedSongs(songs.map((song) => song.id === id ? { ...song, enabled:true } : song));
            }

        } catch (error) {
            console.error(error);
        }
    }

    // useEffect(() => {
    //     handleClose()
    // }, [user])

    return (
        <>
            <div
                className={`p-5 m-2 w-1/2 rounded-md flex flex-col items-start text-black bg-green-300 font-medium shadow-lg`}
                key={song.id}
            >
                <p>{song.name}</p>
                <p>
                    Archivo musica: {song.song_path}
                </p>

                <p>Artistas: {song.artists_ids}</p>
                <p>Generos: {song.genres_ids}</p>

                {
                    song.enabled ? (
                        <button
                            className='bg-red-700 text-white hover:bg-red-500 font-semibold hover:text-white py-2 px-4 rounded'
                            onClick={() => disableSong(song.id)}
                        >
                            Desactivar
                        </button>

                    ) : (
                        <button
                            className='bg-green-700 text-white hover:bg-green-500 font-semibold hover:text-white py-2 px-4 border border-green-600 hover:border-transparent rounded'
                            onClick={() => enableSong(song.id, song)}
                        >
                            Activar
                        </button>
                    )
                }

                {/* <div
                    className='bg-gray-900 flex flex-row items-center gap-3 p-2 mb-3 mt-3 rounded-lg shadow-md w-full'
                    onClick={handleShow}
                >
                    <FontAwesomeIcon
                        icon={faPenToSquare}
                        className=''
                    />
                    <p>Editar datos</p>
                </div> */}
                {/* <EditSede
                    song={song}
                    songs={songs}
                    setSongs={setSongs}
                    displayedSongs={displayedSongs}
                    setDisplayedSongs={setDisplayedSongs}
                    show={showEditModal}
                    onClose={handleClose}
                /> */}
            </div>
        </>
    )
}

export default SongItem;