import React, { Fragment, useEffect, useState, useRef } from 'react';
import { usePopper } from 'react-popper';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { songsData } from '../Player/audios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse } from '@fortawesome/free-solid-svg-icons';

import {BsFillPlayCircleFill, BsThreeDots, BsSearch, BsPlusCircle, BsHouse, BsFillHouseFill, BsSearchHeart, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill} from 'react-icons/bs';
import Player from './Player';
// import { faHouse as heartSolido } from '@fortawesome/free-regular-svg-icons'

const UserLanding = () => {
	const { isAuthenticated } = useContext(AuthContext);
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

	// console.log('songPopupOptions: ', songPopupOptions)
	const { userId } = useContext(AuthContext);
	console.log('------------------------- user id: ', userId)

	const [referenceElement, setReferenceElement] = useState(null);
	const [popperElement, setPopperElement] = useState(null);
	const { styles, attributes } = usePopper(referenceElement, popperElement, { placement: "bottom-start"});
	

	// console.log('songs: ', songs);
	// console.log('artists: ', artists);
	// console.log('genres: ', genres);

	const createPlaylist = async (song) => {
		console.log('----------------- onSubmitSong -------------- ');

		console.log('song: ', song);
		
        try {
            const body = { song, user_id: userId };
            console.log(JSON.stringify(body));
            console.log('---- end of body to be submitted ----');
            let newPlaylist = {};
            const response = await fetch("http://localhost:5000/playlist", {
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

	// get all users function
	const getSongs = async () => {
        try {
            const response = await fetch("http://localhost:5000/songs/");
            const jsonData = await response.json();

            setSongs(jsonData);
            // setDisplayedSedes(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// get all users function
	const getGenres = async () => {
        try {
            const response = await fetch("http://localhost:5000/genres/");
            const jsonData = await response.json();

            setGenres(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// get all users function
	const getArtists = async () => {
        try {
            const response = await fetch("http://localhost:5000/artists/");
            const jsonData = await response.json();

            setArtists(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	// get all users function
	const getPlaylists = async () => {
        try {
		const response = await fetch(`http://localhost:5000/playlists?user_id=${userId}`);
            const jsonData = await response.json();

            setPlaylists(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	console.log('playlists: ', playlists)

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
				<div className='relative h bg-black text-white'>
					<div className='flex flex-row items-center w-full justify-left pl-16 relative border-b-2 border-b-gray-800 bg-black'>
						<h1 className='flex justify-center font-bold text-2xl py-4 text-green-400'>Trackify</h1>
					</div>
					<div className='flex flex-row gap-2 m-2'>
						<div className='flex flex-col gap-3'>
							<div className='flex flex-col bg-gray-900 p-5 rounded-lg gap-5 w-80 pl-7'>
								<div
									className='flex flex-row gap-3 items-center justify-left text-gray-300 hover:text-white'
									onClick={() => {
										setHomeSelected(true)
										setSearchSelected(false)
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
										setHomeSelected(false)
										setSearchSelected(true)
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
							<div className='flex flex-col bg-gray-900 p-5 rounded-lg gap-5 w-80 pl-7'>
								<div className='flex flex-row w-full justify-between'>
									<p className='font-medium text-md'>Tus playlists</p>
									<BsPlusCircle className='text-2xl'/>
								</div>
								<div className='flex flex-col'>
									{ playlists && playlists.map (playlist => (
										<p className='w-full hover:bg-gray-800 p-3'>{playlist.name}</p>
									))}
								</div>
							</div>
						</div>
						<div className='space-y-1 my-2 w-1/2 mx-auto flex flex-col justify-center items-center'>
							<p className='font-medium text-lg mb-7'>Nuevas canciones que debes escuchar!</p>
							{ songs.length > 0 && 
								songs.map(song => (
									song.enabled && (
										<Fragment key={song.id}>
											<div
												className='flex flex-row gap-3 p-3 rounded-sm bg-green-900 justify-left items-center w-full hover:bg-green-800 cursor-pointer relative'
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
														className='bg-gray-600 absolute rounded-md right-3 -bottom-5 overflow-visible z-50 shadow-lg'
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


														{ playlists && playlists.map (playlist => (
															<p
																className='text-white rounded-md hover:bg-gray-500 p-2'
															>
																{playlist.name}
															</p>
														))}

														<p
															className='text-white rounded-md hover:bg-gray-500 p-2'
														>
															Playlist 1
														</p>
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
					</div>
				</div>
				<audio
					src={songs.length > 0 ? `http://localhost:5000/${currentSong.song_path}` : ''}
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