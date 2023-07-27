import React, { Fragment, useEffect, useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { songsData } from '../Player/audios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCircleMinus } from '@fortawesome/free-solid-svg-icons';

import {BsFillPlayCircleFill, BsThreeDots, BsSearch, BsPlusCircle, BsHouse, BsFillHouseFill, BsSearchHeart, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill, BsDisplay} from 'react-icons/bs';
import Player from './Player';
// import { faHouse as heartSolido } from '@fortawesome/free-regular-svg-icons'

const UserLanding = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const [searchSongsResult, setSearchSongsResult] = useState([]);
	const [playlistSongs, setPlaylistSongs] = useState([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState();
	const [songs, setSongs] = useState([]);
	const [genres, setGenres] = useState([]);
	const [artists, setArtists] = useState([]);
	const [playlists, setPlaylists] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(false);
    const [homeSelected, setHomeSelected] = useState(true);
    const [searchSelected, setSearchSelected] = useState(false);
    const [songPopupOptions, setSongPopupOptions] = useState({});
	const [activeSongPopup, setActiveSongPopup] = useState(null);
    const [displayNewPlaylistModal, setDisplayNewPlaylistModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState();
    const [displayHome, setDisplayHome] = useState(true);
    const [displaySearch, setDisplaySearch] = useState(false);
    const [displayPlaylistPage, setDisplayPlaylistPage] = useState(false);
    const [playlistOptionsPopup, setPlaylistOptionsPopup] = useState(false);
    const [playlistDeleteModal, setPlaylistDeleteModal] = useState(false);
    const [playlistEditNameModal, setPlaylistEditNameModal] = useState(false);
    const [editedPlaylistName, setEditedPlaylistName] = useState(false);

	// console.log('songPopupOptions: ', songPopupOptions)
	const { userId } = useContext(AuthContext);
	console.log('------------------------- user id: ', userId)

	const [referenceElement, setReferenceElement] = useState(null);
	const [popperElement, setPopperElement] = useState(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement, { placement: "bottom-start"});
	
	// console.log('songs: ', songs);
	// console.log('artists: ', artists);
	// console.log('genres: ', genres);

	const addSongToPlaylist = async (id, playlist) => {
		console.log('----------------- Add song to playlist -------------- ');

		console.log('song id to add: ', id);
		console.log('playlist to add to: ', playlist);
		
		let songs_ids;

		if(playlist.songs_ids && playlist.songs_ids.ids && playlist.songs_ids.ids.length > 0 ) {
			playlist.songs_ids.ids.push(id);
		}
		else{
			playlist.songs_ids.ids = [id];
		}
		
		console.log('playlist.songs_ids.ids after push: ', playlist.songs_ids.ids);
		
        try {
            const body = { id: playlist.id, songs_ids: playlist.songs_ids.ids };
            console.log(JSON.stringify(body));
            console.log('---- end of body to be submitted ----');
            let updatedPlaylist = {};
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `playlist-add-song`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())	
                .then(result => {
                    if(result){
                        console.log('playlist add song result: ');
                        console.log(result);
                        updatedPlaylist = result;
                    }
                });

            // console.log(response.json();

            // setPlaylists(playlists.map((playlist) => playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist));
			// setSelectedPlaylist({
			// 	...selectedPlaylist, 
			// 	name: updatedPlaylist.name
			// });

            // window.location = '/';
        }
        catch (error) {
            console.error(error.message);
        }
	}
	

	const deletePlaylist = async () => {
		console.log('----------------- delete playlist -------------- ');

		console.log('selectedPlaylist: ', selectedPlaylist);
		
        try {
            const body = { playlist: selectedPlaylist };
            console.log(JSON.stringify(body));
            console.log('---- end of body to be submitted ----');
            let newPlaylist = {};
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `playlist?id=${selectedPlaylist.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(result => {
					console.log(result);
                    if(result.id){
                        console.log('playlist creation result: ');
                        console.log(result);
                        newPlaylist = result;
						setPlaylists(playlists.map((playlist) => playlist.id === result.id ? { ...playlist, enabled: false } : playlist));
						setPlaylistDeleteModal(false);
						setDisplayPlaylistPage(false);
						setDisplayHome(true);
                    }
                });

            // console.log(response.json();

			

            // window.location = '/';
        }
        catch (error) {
            console.error(error.message);
        }
	}

	const savePlaylistName = async () => {
		console.log('----------------- Edit playlist name -------------- ');

		console.log('selectedPlaylist: ', selectedPlaylist);
		
        try {
            const body = { playlist: selectedPlaylist, new_name: editedPlaylistName };
            console.log(JSON.stringify(body));
            console.log('---- end of body to be submitted ----');
            let updatedPlaylist = {};
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `playlist`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(result => {
                    if(result.id){
                        console.log('playlist creation result: ');
                        console.log(result);
                        updatedPlaylist = result;
                    }
                });

            // console.log(response.json();

            setPlaylists(playlists.map((playlist) => playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist));
			setSelectedPlaylist({
				...selectedPlaylist, 
				name: updatedPlaylist.name
			});

            // window.location = '/';
        }
        catch (error) {
            console.error(error.message);
        }
	}

	const createPlaylist = async (song) => {
		console.log('----------------- onSubmitSong -------------- ');

		console.log('song: ', song);
		
        try {
            const body = { song, user_id: userId };
            console.log(JSON.stringify(body));
            console.log('---- end of body to be submitted ----');
            let newPlaylist = {};
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `playlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(result => {
                    if(result.id){
                        console.log('playlist creation result: ');
                        console.log(result);
                        newPlaylist = result;
                    }
                });

            // console.log(response.json();

            setPlaylists(newPlaylist.id ? [...playlists, newPlaylist] : playlists);
			

            // window.location = '/';
        }
        catch (error) {
            console.error(error.message);
        }
	}

	const createEmptyPlaylist = async () => {
		console.log('----------------- create EMPTY playlist (just with the name, no songs) -------------- ');
		
        try {
            const body = { playlist_name: newPlaylistName, user_id: userId };
            console.log(JSON.stringify(body));
            console.log('---- end of body to be submitted ----');
            let newPlaylist = {};
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `playlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(result => {
                    if(result.id){
                        console.log('playlist creation result: ');
                        console.log(result);
                        newPlaylist = result;
                    }
                });

            // console.log(response.json();

            setPlaylists(newPlaylist.id ? [...playlists, newPlaylist] : playlists);
			

            // window.location = '/';
        }
        catch (error) {
            console.error(error.message);
        }
	}

	// user functionality for searching songs
	const searchSongs = async (name) => {
		try {
			if(name !== '') {
				const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `songs-search?name=${name}`);
				const jsonData = await response.json();
	
				setSongs(jsonData);
				console.log('searching songs response: ', jsonData)
				// setDisplayedSedes(jsonData);
			}
			else {
				setSongs([]);
			}
        } catch (error) {
            console.error(error.message);
        }
	}

	// get playlist's songs
	const getPlaylistSongs = async (songs_ids) => {
        try {
			let jsonData;
			const body = { songs_ids };
			console.log('getPlaylistSongs, ids to get: ', songs_ids);
			const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `playlist-songs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(result => {
                    if(result){
                        console.log('playlist songs result: ');
                        console.log(result);
                        jsonData = result;
                    }
                });

            setSongs(jsonData);
            // setDisplayedSedes(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	console.log('process.env.REACT_APP_SERVER: ', (process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`))

	// get all songs
	const getSongs = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `songs/`);
            const jsonData = await response.json();

            setSongs(jsonData);
            // setDisplayedSedes(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// get all genres
	const getGenres = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `genres/`);
            const jsonData = await response.json();

            setGenres(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// get all artists
	const getArtists = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `artists/`);
            const jsonData = await response.json();

            setArtists(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// get all playlists for logged in user
	const getPlaylists = async () => {
        try {
		const response = await fetch((process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `playlists?user_id=${userId}`);
            const jsonData = await response.json();

            setPlaylists(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// console.log('playlists: ', playlists)

	// when page loads, get Songs
    useEffect(() => {
        getSongs();
		getGenres();
		getArtists();
		getPlaylists();
    }, []);

	// actually pause or play audio.
	useEffect(() => {
		if(isPlaying) {
			audioElem.current.play();
		}
		else {
			audioElem.current.pause();
		}
	}, [isPlaying]);

	const audioElem = useRef();

	const onPlaying = () => {
		const duration = audioElem.current.duration;
		const currentTime = audioElem.current.currentTime;

		// console.log('duration: ', duration);
		// console.log('currentTime: ', currentTime);
		// console.log('current song completion percentage: ', (currentTime / duration) * 100);

		setCurrentSong({ ...currentSong, "progress": (currentTime / duration) * 100, "length": duration });
	}

	const navigate = useNavigate();
	const cookies = new Cookies();

	// console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='relative min-h-screen bg-black text-white mb-28'>
					<div className='flex flex-row items-center w-full justify-left pl-16 relative border-b-2 border-b-gray-800 bg-black'>
						<h1 className='font-bold text-2xl py-4 text-green-400'>Trackify</h1>
						<p
							className='ml-auto mr-5 cursor-pointer hover:underline font-medium text-sm text-gray-400'
							onClick={() => logout()}
						>
							Cerrar sesión
						</p>
					</div>
					<div className='flex flex-row gap-2 m-2'>
						<div className='flex flex-col gap-3'>
							<div className='flex flex-col bg-gray-900 p-5 rounded-lg gap-5 w-80 pl-7'>
								<div
									className='flex flex-row gap-3 items-center justify-left text-gray-300 hover:text-white'
									onClick={() => {
										getSongs();
										setHomeSelected(true);
										setDisplayHome(true);
										setSearchSongsResult([]);
										setSearchSelected(false);
										setDisplaySearch(false);
										setDisplayPlaylistPage(false);
									}}
								>
									{homeSelected ? (
										<BsFillHouseFill className='text-2xl'/>
										
									) : (
										<BsHouse className='text-2xl'/>
									)}
									<p className='font-medium text-md'>Home</p>
								</div>
								<div
									className='flex flex-row gap-3 items-center justify-left text-gray-300 hover:text-white'
									onClick={() => {
										setSongs([]);
										setHomeSelected(false);
										setDisplayHome(false);
										setSearchSelected(true);
										setDisplaySearch(true);
										setDisplayPlaylistPage(false);
									}}
								>
									{searchSelected ? (
										<BsSearchHeart className='text-2xl'/>

									) : (
										<BsSearch className='text-2xl'/>
									)}
									<p className='font-medium text-md'>Buscar</p>
								</div>
							</div>
							<div className='flex flex-col bg-gray-900 py-5 rounded-lg gap-5 w-80'>
								<div className='flex flex-row px-5 w-full justify-between relative'>
									<p className='font-medium text-md'>Tus playlists</p>
									<BsPlusCircle
										className='text-2xl cursor-pointer hover:opacity-60'
										onClick={() => {
											setDisplayNewPlaylistModal(!displayNewPlaylistModal);
										}}
									/>
									{displayNewPlaylistModal && (
										<div class="absolute -bottom-14 right-0 bg-gray-800 rounded-sm shadow-md">
											<input
												type="text"
												id="floating_outlined"
												class="block pl-2.5 pr-14 pb-2.5 pt-4 w-full text-sm text-gray-300 bg-transparent rounded-sm border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-500 peer"
												placeholder=" " 
												onChange={(e) => {
													console.log('new playlist name: ', e.target.value)
													setNewPlaylistName(e.target.value)
												}}
											/>
											<label for="floating_outlined" class="absolute text-sm text-gray-200 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 flex flex-row justify-between w-full">
												Nombre de la playlist
											</label>
											<p
												className='absolute right-2 top-3 text-white z-50 cursor-pointer font-medium hover:text-gray-500'
												onClick={() => {
													console.log('---- playlist creation, name is: ', newPlaylistName);
													createEmptyPlaylist();
													setDisplayNewPlaylistModal(false);
												}}
											>
												Crear
											</p>
										</div>
									)}
								</div>
								<div className='flex flex-col'>
									<ul className='max-h-screen overflow-y-scroll'>
										{ playlists && playlists.map (playlist => (
											playlist.enabled && (
												<li className='flex flex-row items-center justify-center hover:bg-gray-800 cursor-pointer px-5'>
													<p
														className='w-full p-3'
														onClick={(e) => {
															console.log('---- display playlist name: ', playlist.name);
															console.log('---- display playlist id: ', playlist.id);
															console.log('---- display playlist songs_ids: ', playlist.songs_ids.ids);
															getPlaylistSongs(playlist.songs_ids.ids);
															setSelectedPlaylist(playlist);
															setDisplayPlaylistPage(true);
															setDisplayHome(false);
															setDisplaySearch(false);
														}}
													>
														{playlist.name}
													</p>
													{/* <FontAwesomeIcon icon={faCircleMinus} /> */}
												</li>
											)
										))}
									</ul>
								</div>
							</div>
						</div>
						{ displayHome && (
							<ul className='space-y-1 rounded-lg w-full flex flex-col justify-start items-start bg-gradient-to-b from-gray-700 to-gray-900 overflow-y-auto h-full mb-32'>
								<p className='font-semibold p-5 text-xl mb-7'>Descubre música</p>
								{/* <ul className='w-full overflow-y-scroll overflow-visible relative'> */}
								{ songs.length > 0 && 
									songs.slice(0, 15).map(song => (
										song.enabled && (
											<Fragment key={song.id}>
												<li
													className='flex flex-row gap-3 p-3 rounded-sm bg-transparent justify-left items-center w-full hover:bg-gray-600 cursor-pointer relative'
													key={song.id}
													onClick={() => {
														setCurrentSong(song);
														setIsPlaying(false);
														audioElem.current.currentTime = 0;
													}}
												>
													<BsFillPlayCircleFill className='text-2xl'/>
													<div className='flex flex-col'>
														<p className=''>{song.name}</p>
														<div className='flex flex-row gap-2'>
															{artists.map(artist => (
																song.artists_ids.ids.map(song_artist_id => (
																	parseInt(song_artist_id) === artist.id ? (
																		<p className='text-gray-400 text-sm bg-black p-0.5 rounded-sm opacity-90'>{artist.name}</p>
																	) : (
																		<></>
																	)
																))
															))}
														</div>
													</div>
													<BsThreeDots
														className='absolute text-2xl text-gray-300 right-3'
														onClick={() => {
															setActiveSongPopup(song.id);
															setSongPopupOptions((prevOptions) => ({
																...prevOptions,
																[song.id]: !prevOptions[song.id]
															}))
														}}
													/>
													{activeSongPopup === song.id && songPopupOptions[song.id] && ( 
														<div
															className='bg-gray-800 absolute rounded-md right-10 -bottom-5 overflow-visible z-50 shadow-md'
														>
															<p
																className='text-white rounded-md hover:bg-gray-500 p-2'
																onClick={() => {
																	console.log('----------- crear playlist, song name: ', song.name);
																	createPlaylist(song);
																}}
															>
																Crear playlist
															</p>
															<div className='border border-gray-400'>
															</div>

															<ul className='max-h-40 overflow-y-scroll overflow-visible'>
																{ playlists && playlists.map (playlist => (
																	<p
																		className='text-white rounded-md hover:bg-gray-500 p-2'
																		onClick={() => addSongToPlaylist(song.id, playlist)}
																	>
																		{playlist.name}
																	</p>
																))}
															</ul>
															<div>
																
															</div>
														</div>
													)}
												</li>
											</Fragment>
										)
									))
								}
								{/* </ul> */}
							</ul>
						)}
						{displaySearch && (
							<div className='space-y-1 mb-32 rounded-lg justify-center w-full items-center bg-gray-900'>
								<div className='w-1/3 relative m-3 bg-gray-800 rounded-full flex flex-row items-center border border-transparent hover:border hover:border-gray-600'>
									<BsSearch className='absolute left-4 text-gray-300'></BsSearch>
									<input
										className='pl-11 bg-transparent w-full h-full p-5 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300'
										placeholder='¿Qué deseas escuchar?'
										onChange={(e) => {
											console.log(e.target.value);
											searchSongs(e.target.value);
										}}
									/>
								</div>
								<div className='p-5'>
								{ songs.length > 0 && 
									songs.slice(0, 20).map(song => (
										song.enabled && (
											<Fragment key={song.id}>
												<div
													className='flex flex-row gap-3 p-3 rounded-sm justify-left items-center w-full hover:bg-gray-800 cursor-pointer relative'
													onClick={() => {
														setCurrentSong(song);
														setIsPlaying(false);
														audioElem.current.currentTime = 0;
													}}
												>
													<BsFillPlayCircleFill className='text-2xl'/>
													<div className='flex flex-col'>
														<p className=''>{song.name}</p>
														<div className='flex flex-row gap-2'>
															{artists.map(artist => (
																song.artists_ids.ids.map(song_artist_id => (
																	parseInt(song_artist_id) === artist.id ? (
																		<p className='text-gray-400 text-sm bg-black p-0.5 rounded-sm opacity-90'>{artist.name}</p>
																	) : (
																		<></>
																	)
																))
															))}
														</div>
													</div>
													<BsThreeDots
														className='absolute text-2xl text-gray-300 right-3'
														onClick={() => {
															setActiveSongPopup(song.id);
															setSongPopupOptions((prevOptions) => ({
																...prevOptions,
																[song.id]: !prevOptions[song.id]
															}))
														}}
													/>
													{activeSongPopup === song.id && songPopupOptions[song.id] && ( 
														<div
															className='bg-gray-600 absolute rounded-md right-10 -bottom-5 overflow-visible z-50 shadow-lg'
														>
															<p
																className='text-white rounded-md hover:bg-gray-500 p-2'
																onClick={() => {
																	console.log('----------- crear playlist, song name: ', song.name);
																	createPlaylist(song);
																}}
															>
																Crear playlist
															</p>
															<div className='border border-gray-400'>
															</div>
															<ul className='max-h-40 overflow-y-scroll'>
																{ playlists && playlists.map (playlist => (
																	<p
																		className='text-white rounded-md hover:bg-gray-500 p-2'
																	>
																		{playlist.name}
																	</p>
																))}
															</ul>
														</div>
													)}
												</div>
											</Fragment>
										)
									))
								}
								</div>
							</div>
						)}
						{displayPlaylistPage && (
							<div className='space-y-1 mb-2 rounded-lg justify-center w-full items-center bg-gradient-to-b from-gray-700 to-gray-900'>
								<p className='font-normal mr-auto pl-6 pt-5 text-sm'>Playlist</p>
								<div className='flex flex-row items-center justify-start p-5 mb-1 relative'>
									<p className='font-semibold text-5xl'>{selectedPlaylist.name}</p>
									<div className='relative'>
										<BsThreeDots
											className='text-4xl text-gray-300 right-3 ml-7 cursor-pointer hover:text-white'
											onClick={() => {
												setPlaylistOptionsPopup(!playlistOptionsPopup);
											}}
										/>
										{playlistOptionsPopup && (
											<div
												className='absolute bg-gray-600 rounded-md top-8 left-7 overflow-visible z-50 shadow-lg'
											>
												<p
													className='text-white rounded-md hover:bg-gray-500 p-2 whitespace-nowrap'
													onClick={() => {
														console.log('----------- edit playlist: ', selectedPlaylist);
														setPlaylistEditNameModal(true);
													}}
												>
													Editar nombre
												</p>
												<p
													className='text-white rounded-md hover:bg-gray-500 p-2 whitespace-nowrap'
													onClick={() => {
														console.log('----------- eliminar playlist: ', selectedPlaylist);
														setPlaylistDeleteModal(true);
													}}
												>
													Eliminar playlist
												</p>
											</div>
										)}
									</div>
									{playlistDeleteModal && (
										<div className='fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex justify-center items-center'>
											<div className='bg-gray-100 text-black p-5 relative rounded-lg'>
												<button onClick={ () => setPlaylistDeleteModal(false) } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-hide="defaultModal">
													<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
													<span className="sr-only">Close modal</span>
												</button>
												<p className='mt-5 text-lg font-semibold'>¿Eliminar playlist de tu librería?</p>
												<p className='mt-5 text-sm'>Esto eliminará a <b>{selectedPlaylist.name}</b> de tu librería.</p>
												<div className='mt-10 flex flex-row w-full gap-12 justify-center items-center font-medium'>
													<button
														className='hover:scale-110'
														type='button'
														onClick={() => {
															setPlaylistDeleteModal(false)
														}}
													>
														Cancelar
													</button>
													<button
														className='bg-green-400 py-3 px-7 rounded-full hover:scale-105'
														type='button'
														onClick={() => {
															deletePlaylist();
														}}
													>
														Eliminar
													</button>
												</div>
											</div>
										</div>
									)}
									{playlistEditNameModal && (
										<div className='fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex justify-center items-center'>
											<div className='bg-gray-800 text-white p-5 relative rounded-lg'>
												<button onClick={ () => setPlaylistEditNameModal(false) } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-hide="defaultModal">
													<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
													<span className="sr-only">Close modal</span>
												</button>
												<p className='mt-5 text-lg font-semibold'>Editar nombre</p>

												<div class="relative mt-5 bg-gray-800 rounded-sm shadow-md">
													<input
														type="text"
														id="playlist_name_edited"
														className="block pl-2.5 pr-14 pb-2.5 pt-4 w-full text-sm text-gray-300 bg-transparent rounded-sm border-1 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-green-500 peer"
														placeholder=" " 
														onChange={(e) => {
															console.log('edited playlist name: ', e.target.value)
															setEditedPlaylistName(e.target.value)
														}}
													/>
													<label for="playlist_name_edited" class="absolute text-sm text-gray-200 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-gray-200 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 flex flex-row justify-between w-full">
														Nombre de la playlist
													</label>
												</div>

												<div className='mt-7 flex flex-row w-full gap-12 justify-center items-center font-medium'>
													<button
														className='hover:scale-110'
														type='button'
														onClick={() => {
															setPlaylistEditNameModal(false)
														}}
													>
														Cancelar
													</button>
													<button
														className='bg-green-400 py-3 px-7 rounded-full hover:scale-105'
														type='button'
														onClick={() => {
															savePlaylistName();
														}}
													>
														Guardar
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
								<p className='font-medium text-white opacity-70 mr-auto pl-5 text-md pb-10'>{songs.length ? songs.length : '0'} canciones</p>
								{ songs.length > 0 && 
									songs.map(song => (
										song.enabled && (
											<Fragment key={song.id}>
												<div
													className='flex flex-row gap-3 p-3 rounded-sm bg-transparent justify-left items-center w-full hover:bg-gray-600 cursor-pointer relative'
													onClick={() => {
														setCurrentSong(song);
														setIsPlaying(false);
														audioElem.current.currentTime = 0;
													}}
												>
													<BsFillPlayCircleFill className='text-2xl'/>
													<div className='flex flex-col'>
														<p className=''>{song.name}</p>
														<div className='flex flex-row gap-2'>
															{artists.map(artist => (
																song.artists_ids.ids.map(song_artist_id => (
																	parseInt(song_artist_id) === artist.id ? (
																		<p className='text-gray-400 text-sm bg-black p-0.5 rounded-sm opacity-90'>{artist.name}</p>
																	) : (
																		<></>
																	)
																))
															))}
														</div>
													</div>
													<BsThreeDots
														className='absolute text-2xl text-gray-300 right-3'
														onClick={() => {
															setActiveSongPopup(song.id);
															setSongPopupOptions((prevOptions) => ({
																...prevOptions,
																[song.id]: !prevOptions[song.id]
															}))
														}}
													/>
													{activeSongPopup === song.id && songPopupOptions[song.id] && ( 
														<div
															className='bg-gray-600 absolute rounded-md right-10 -bottom-5 overflow-visible z-50 shadow-lg'
														>
															<p
																className='text-white rounded-md hover:bg-gray-500 p-2'
																onClick={() => {
																	console.log('----------- crear playlist, song name: ', song.name);
																	createPlaylist(song);
																}}
															>
																Crear playlist
															</p>
															<div className='border border-gray-400'>
															</div>

															<ul className='max-h-40 overflow-y-scroll'>
																{ playlists && playlists.map (playlist => (
																	<p
																		className='text-white rounded-md hover:bg-gray-500 p-2'
																	>
																		{playlist.name}
																	</p>
																))}
															</ul>
															<div>
																
															</div>
														</div>
													)}
												</div>
											</Fragment>
										)
									))
								}
							</div>
						)}
					</div>
				</div>
				<audio
					src={songs.length > 0 ? (process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `${currentSong.song_path}` : ''}
					ref={audioElem}
					onTimeUpdate={onPlaying}
				/>
				<Player
					songs={songs}
					setSongs={setSongs}
					isPlaying={isPlaying}
					currentSong={currentSong}
					setCurrentSong={setCurrentSong}
					setIsPlaying={setIsPlaying}
					audioElem={audioElem}
				/>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default UserLanding;