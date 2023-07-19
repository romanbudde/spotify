import React, { Fragment, useEffect, useState, useRef } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { songsData } from '../Player/audios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';

import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill} from 'react-icons/bs';
import Player from './Player';
// import { faHouse as heartSolido } from '@fortawesome/free-regular-svg-icons'

const UserLanding = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const [songs, setSongs] = useState([]);
	const [genres, setGenres] = useState([]);
	const [artists, setArtists] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(false);

	console.log('songs: ', songs);
	console.log('artists: ', artists);
	console.log('genres: ', genres);

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

	// when page loads, get Songs
    useEffect(() => {
        getSongs();
		getGenres();
		getArtists();
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

		console.log('duration: ', duration);
		console.log('currentTime: ', currentTime);
		console.log('current song completion percentage: ', (currentTime / duration) * 100);

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
					<div className='space-y-1 p-10 my-2 w-1/2 mx-auto flex flex-col justify-center items-center'>
						<p className='font-medium text-lg mb-7'>Nuevas canciones que debes escuchar!</p>
						{ songs.length > 0 && 
							songs.map(song => (
								song.enabled && (
									<Fragment key={song.id}>
										<div
											className='flex flex-row gap-3 p-3 rounded-sm bg-green-900 justify-left items-center w-full hover:bg-green-800 cursor-pointer'
											onClick={() => {
												setCurrentSong(song);
												setIsPlaying(false);
												audioElem.current.currentTime = 0;
											}}
										>
											<BsFillPlayCircleFill />
											<p className=''>{song.name}</p>
											<p className=''>{artists.map(artist => (
												song.artists_ids.ids.map(song_artist_id => (
													song_artist_id === artist.id ? (
														<p>{artist.name}</p>
													) : (
														<p>Artista desconocido</p>
													)
												))
											))}
											</p>
											
										</div>
									</Fragment>

								)

							))
						}
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