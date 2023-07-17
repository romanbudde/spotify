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
		const duration = moment.duration(number, 'seconds');
		return moment.utc(duration.asMilliseconds()).format('mm:ss');
	};

	console.log('current song: ', currentSong);
	console.log('current song duration: ', numberToTime(currentSong.length));

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
				<div className='flex flex-col justify-center items-center bg-black fixed bottom-0 w-full z-50'>
					<div className='player_container'>
						<div className='title'>
							<p className='text-white font-medium text-lg my-2'>first song</p>
						</div>
					</div>
					<div className='navigation w-10/12 p-2'>
						<div className='flex flex-row justify-between text-md pb-1'>
							<p className='text-white'>{numberToTime(audioElem.current.currentTime)}</p>
							<p className='text-white'>{numberToTime(currentSong.length)}</p>
						</div>
						<div
							className='navigation_wrapper bg-gray-600 cursor-pointer'
							onClick={checkWidth}
							ref={clickRef}
							>
							<div
								className='seek_bar w-1/2 rounded-3xl h-1.5 bg-green-500'
								style={{width: `${currentSong.progress  + '%'}`}}
								>
							</div>
						</div>
					</div>
					<div className='controls flex flex-row gap-4 items-center justify-center text-white pt-3 pb-5'>
						<BsFillSkipStartCircleFill 
							className='btn_action text-5xl'
						/>
						{ isPlaying ? (
							<BsFillPauseCircleFill
								className='btn_action text-6xl'
								onClick={PlayPause}
							/>
						) : (
							<BsFillPlayCircleFill
								className='btn_action text-6xl'
								onClick={PlayPause}
							/>
						)}
						<BsFillSkipEndCircleFill
							className='btn_action text-5xl'
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