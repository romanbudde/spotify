import React, { Fragment, useContext, useState, useEffect } from 'react';

const SongItem = ({ song, songs, setSongs, displayedSongs, setDisplayedSongs, artists, genres }) => {

    console.log('song at songItem: ', song);
    console.log('artists at songItem: ', artists);
    console.log('genres at songItem: ', genres);
    console.log('song.artists_ids.ids at songItem: ', song.artists_ids.ids);

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
                className={`p-5 m-2 w-1/2 rounded-md flex flex-col items-start text-black bg-green-300 font-medium shadow-lg relative`}
                key={song.id}
            >
                <div className='flex flex-row absolute right-5 gap-3'>
                    { genres && (
                        <>
                            {genres.map(genre => (
                                song.genres_ids.ids.map(song_genre_id => (
                                    parseInt(song_genre_id) === genre.id ? (
                                        <p className='bg-gray-200 p-1 rounded-md text-sm'>{genre.name}</p>
                                    ) : (
                                        <></>
                                    )
                                ))))
                            }
                        </>
                    )}
                </div>
                <div className='mt-7 flex flex-col gap-1 mb-3'>
                    <p className='font-semibold'>{song.name}</p>
                    <p>
                        Archivo musica: {song.song_path}
                    </p>

                    { artists && (
                        <div className='flex flex-row gap-2'>
                            {artists.map(artist => (
                                song.artists_ids.ids.map(song_artist_id => (
                                    parseInt(song_artist_id) === artist.id ? (
                                        <p className='bg-black text-gray-300 p-0.5 rounded-sm'>{artist.name}</p>
                                    ) : (
                                        <></>
                                    )
                                ))))
                            }
                        </div>
                    )}
                </div>

                {/* <p>Artistas: {song.artists_ids}</p> */}
                {/* <p>Generos: {song.genres_ids}</p> */}

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
            </div>
        </>
    )
}

export default SongItem;