import React, { Fragment, useEffect, useState, useRef } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { songsData } from '../Player/audios';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import moment from 'moment';
import {BsFillPlayCircleFill, BsFillPauseCircleFill, BsFillSkipStartCircleFill, BsSkipEndCircleFill, BsFillSkipEndCircleFill} from 'react-icons/bs';
// import { faHouse as heartSolido } from '@fortawesome/free-regular-svg-icons'

const Player = ({ songs, setSongs, isPlaying, currentSong, setCurrentSong, setIsPlaying, audioElem}) => {
	const { isAuthenticated } = useContext(AuthContext);

	const numberToTime = (number) => {
		if (number && typeof number === 'number') {
			const duration = moment.duration(number, 'seconds');
			return moment.utc(duration.asMilliseconds()).format('mm:ss');
		}
		return '00:00';
	};

	console.log('songs: ', songs);
	console.log('current song: ', currentSong);
	// console.log('current song duration: ', numberToTime(currentSong.length));
	// console.log('current song progress: ', numberToTime(currentSong.progress));

	const nextSong = () => {
		console.log('play next song in Songs');
		const index = songs.findIndex(song => song.id === currentSong.id);

		// Find the index of the next enabled song
		let nextEnabledIndex = index + 1;
		while (nextEnabledIndex < songs.length && !songs[nextEnabledIndex].enabled) {
		  nextEnabledIndex++;
		}
	  
		// If no enabled song is found, wrap around to the beginning
		if (nextEnabledIndex >= songs.length) {
		  nextEnabledIndex = 0;
		  while (nextEnabledIndex < index && !songs[nextEnabledIndex].enabled) {
			nextEnabledIndex++;
		  }
		}
	  
		// Set the next enabled song as the current song
		setCurrentSong(songs[nextEnabledIndex]);

		setIsPlaying(false);
		audioElem.current.currentTime = 0;
	}

	const prevSong = () => {
		const index = songs.findIndex(song => song.id === currentSong.id);

		// Find the index of the previous enabled song
		let previousEnabledIndex = index - 1;
		while (previousEnabledIndex >= 0 && !songs[previousEnabledIndex].enabled) {
		  previousEnabledIndex--;
		}
	  
		// If no enabled song is found, go back to the end of the list
		if (previousEnabledIndex < 0) {
		  previousEnabledIndex = songs.length - 1;
		  while (previousEnabledIndex >= 0 && !songs[previousEnabledIndex].enabled) {
			previousEnabledIndex--;
		  }
		}
	  
		// Set the previous enabled song as the current song
		setCurrentSong(songs[previousEnabledIndex]);

		setIsPlaying(false);
		audioElem.current.currentTime = 0;
	}

	const clickRef = useRef();

	const checkWidth = (e) => {
		let width = clickRef.current.clientWidth;
		const offset = e.nativeEvent.offsetX;

		console.log('width: ', width);
		console.log('offset: ', offset);
		console.log('current song length: ', currentSong.length);
		console.log('% of song at clicked point: ', offset/width * 100);
		
		audioElem.current.currentTime = offset/width * currentSong.length;
	}

	const PlayPause = () => {
		setIsPlaying(!isPlaying);
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='flex flex-col justify-center items-center bg-black fixed bottom-0 w-full z-40'>
					<div className='player_container'>
						<div className='title'>
							<p className='text-white font-medium text-lg my-2'>
								{ audioElem.current ? 
									currentSong.name :
									'-'
								}
							</p>
						</div>
					</div>
					<div className='navigation w-10/12 p-2'>
						<div className='flex flex-row justify-between text-md pb-1'>
							<p className='text-white'>
								{ audioElem.current && audioElem.current.currentTime ? 
									numberToTime(audioElem.current.currentTime) :
									'00:00'
								}
							</p>
							<p className='text-white'>
								{ audioElem.current ?
									numberToTime(currentSong.length) :
									'00:00'
								}
							</p>
						</div>
						<div
							className='navigation_wrapper bg-gray-600 cursor-pointer'
							onClick={checkWidth}
							ref={clickRef}
							>
							<div
								className='seek_bar w-1/2 rounded-3xl h-1.5 bg-green-500'
								style={{width: `${currentSong.progress ? currentSong.progress + '%' : '0%'}`}}
								>
							</div>
						</div>
					</div>
					<div className='controls flex flex-row gap-4 items-center justify-center text-white pt-3 pb-5'>
						<BsFillSkipStartCircleFill 
							className='btn_action text-4xl cursor-pointer hover:opacity-70'
							onClick={() => prevSong()}
						/>
						{ isPlaying ? (
							<BsFillPauseCircleFill
								className='btn_action text-5xl hover:scale-105 cursor-pointer'
								onClick={PlayPause}
							/>
						) : (
							<BsFillPlayCircleFill
								className='btn_action text-5xl hover:scale-105'
								onClick={PlayPause}
							/>
						)}
						<BsFillSkipEndCircleFill
							className='btn_action text-4xl cursor-pointer hover:opacity-70'
							onClick={() => nextSong()}
						/>
					</div>
				</div>
			</Fragment>
		);
	}
	else {
		// navigate('/');
	}
}

export default Player;