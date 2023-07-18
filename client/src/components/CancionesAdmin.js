import React, { Fragment, useEffect, useState } from 'react';
import AddCancion from './AddCancion';
import User from './User';
import EditUser from './EditUser';
import EditSede from './EditSede';

import * as Yup from 'yup';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import Autocomplete from "react-google-autocomplete";

import { json, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Datepicker from "react-tailwindcss-datepicker";
import '../css/datepicker.css';
import dayjs from 'dayjs';
import moment from 'moment';
import ClientBottomBar from './ClientBottomBar';
import CancionItem from './CancionItem';
import Paginate from './Paginate';
import Select from 'react-select';

import mercado_pago_icon from "../images/mercado-pago-icon.svg";
import cash_bill_icon from "../images/cash-bill.svg";

const CancionesAdmin = () => {
	const navigate = useNavigate();
	const cookies = new Cookies();
	const moment = require('moment');

	const { isAuthenticated, userId } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [displayedSongs, setDisplayedSongs] = useState([]);
	const [selectedDatesInterval, setSelectedDatesInterval] = useState({});
    const [user, setUser] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showAddSongModal, setShowAddSongModal] = useState(false);
	
	// -- Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedSongs.slice(indexOfFirstPost, indexOfLastPost);

	// console.log('currentPosts: ', currentPosts);

	const handleAddCancionModalOpen = () => {
        setShowAddSongModal(true);
    }
    const handleAddSongModalClose = () => {
        setShowAddSongModal(false); 
    }

	const handleShow = () => setShowEditModal(true);

	const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

	const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	console.log("isAuthenticated: ", isAuthenticated);
	console.log("userId: ", userId);
	console.log("user: ", user);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectLanding = () => {
		if(user.type === 2) {
			navigate('/landing-admin');
		}
		if(user.type === 1) {
			navigate('/landing-cuidador');
		}
		if(user.type === 0) {
			navigate('/landing');
		}
	}

	// Convert a date from the format "yyyy-mm-dd" to "dd/mm/yyyy".
	const formatDate = (dateString) => {
		console.log('dateString to format: ', dateString);
		const date = dayjs(dateString);
		const formattedDate = date.format('DD/MM/YYYY');
		
		console.log(formattedDate);
		return formattedDate;
	};

	

	console.log('selected dates interval: ', selectedDatesInterval);

    const getUserData = async () => {
		const response = await fetch("http://localhost:5000/users/" + userId);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

	// get all users function
	const getSongs = async () => {
        try {
            const response = await fetch("http://localhost:5000/songs/");
            const jsonData = await response.json();

            setSongs(jsonData);
			setDisplayedSongs(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get user data
    useEffect(() => {
        getUserData();
		getSongs();
    }, []);

    console.log('songs: ', songs);
	

	if(isAuthenticated){
		return (
			<Fragment>
                <div className='relative'>
					<ClientBottomBar />
					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Canciones</h1>
					</div>
					<div className='mb-28'>

						<div className='flex flex-row justify-center w-full'>
							<button
								className='bg-transparent text-green-500 font-semibold py-2 px-4 border border-green-600 rounded-lg w-2/3 my-5'
								onClick={handleAddCancionModalOpen}
							>
								Crear cancion
							</button>
							{/* <button
								className='text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/3 py-2.5 text-center shadow-lg'
								onClick = {searchUsers}
							>
								Buscar usuarios
							</button> */}
						</div>
						<AddCancion
							songs={songs}
							setSongs={setSongs}
							displayedSongs={displayedSongs}
							setDisplayedSongs={setDisplayedSongs}
							show={showAddSongModal}
							onClose={handleAddSongModalClose}
						/>
						
						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedSongs.length}
							paginate={paginate}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						<div className='w-full flex flex-col items-center'>
							{currentPosts.length > 0 && (
								currentPosts.map(song => (
									<>
										<CancionItem
											key={song.id}
											song={song}
											songs={songs}
											setSongs={setSongs}
											displayedSongs={displayedSongs}
											setDisplayedSongs={setDisplayedSongs}
										/>
										
									</>
								))
							)}
						</div>
					</div>
                </div>

			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default CancionesAdmin;