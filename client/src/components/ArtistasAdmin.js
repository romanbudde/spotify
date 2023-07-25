import React, { Fragment, useEffect, useState } from 'react';
import AddArtista from './AddArtista';
import User from './User';

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
import ArtistaItem from './ArtistaItem';
import Paginate from './Paginate';
import Select from 'react-select';

import mercado_pago_icon from "../images/mercado-pago-icon.svg";
import cash_bill_icon from "../images/cash-bill.svg";

const ArtistasAdmin = () => {
	const navigate = useNavigate();
	const cookies = new Cookies();
	const moment = require('moment');

	const { isAuthenticated, userId } = useContext(AuthContext);
    const [artists, setArtists] = useState([]);
    const [displayedArtists, setDisplayedArtists] = useState([]);
	const [selectedDatesInterval, setSelectedDatesInterval] = useState({});
    const [user, setUser] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showAddArtistModal, setShowAddArtistModal] = useState(false);
	
	// -- Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedArtists.slice(indexOfFirstPost, indexOfLastPost);

	// console.log('currentPosts: ', currentPosts);

	const handleAddArtistaModalOpen = () => {
        setShowAddArtistModal(true);
    }
    const handleAddArtistModalClose = () => {
        setShowAddArtistModal(false); 
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
	const getArtists = async () => {
        try {
            const response = await fetch("http://localhost:5000/artists/");
            const jsonData = await response.json();

            setArtists(jsonData);
			setDisplayedArtists(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get user data
    useEffect(() => {
        getUserData();
		getArtists();
    }, []);

    console.log('artists: ', artists);
	

	if(isAuthenticated){
		return (
			<Fragment>
                <div className='relative'>
					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200'>
						<FontAwesomeIcon
							className='absolute left-5 cursor-pointer'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4 mx-auto'>Artistas</h1>
						<button
							className='bg-transparent text-green-500 font-bold text-2xl py-1 px-3 border border-green-600 hover:bg-green-100 rounded-md absolute right-5'
							onClick={handleAddArtistaModalOpen}
						>
							+
						</button>
					</div>
					<div className='h-screen bg-gradient-to-b from-gray-100 to-gray-300'>

						<div className='flex flex-row justify-center w-full'>
							
						</div>
						<AddArtista
							artists={artists}
							setArtists={setArtists}
							displayedArtists={displayedArtists}
							setDisplayedArtists={setDisplayedArtists}
							show={showAddArtistModal}
							onClose={handleAddArtistModalClose}
						/>
						
						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedArtists.length}
							paginate={paginate}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						<div className='w-full flex flex-col items-center'>
							{currentPosts.length > 0 && (
								currentPosts.map(artist => (
									<>
										<ArtistaItem
											key={artist.id}
											artist={artist}
											artists={artists}
											setArtists={setArtists}
											displayedArtists={displayedArtists}
											setDisplayedArtists={setDisplayedArtists}
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

export default ArtistasAdmin;