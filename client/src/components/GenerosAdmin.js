import React, { Fragment, useEffect, useState } from 'react';
import AddGenero from './AddGenero';

import '@geoapify/geocoder-autocomplete/styles/minimal.css';

import { json, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import '../css/datepicker.css';
import dayjs from 'dayjs';
import GeneroItem from './GeneroItem';
import Paginate from './Paginate';

const GenerosAdmin = () => {
	const navigate = useNavigate();
	const cookies = new Cookies();
	const moment = require('moment');

	const { isAuthenticated, userId } = useContext(AuthContext);
    const [genres, setGenres] = useState([]);
    const [displayedGenres, setDisplayedGenres] = useState([]);
    const [user, setUser] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showAddGenreModal, setShowAddGenreModal] = useState(false);
	
	// -- Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedGenres.slice(indexOfFirstPost, indexOfLastPost);

	// console.log('currentPosts: ', currentPosts);

	const handleAddGenreModalOpen = () => {
        setShowAddGenreModal(true);
    }
    const handleAddGenreModalClose = () => {
        setShowAddGenreModal(false); 
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

    const getUserData = async () => {
		const response = await fetch("http://localhost:5000/users/" + userId);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

	// get all users function
	const getGenres = async () => {
        try {
            const response = await fetch("http://localhost:5000/genres/");
            const jsonData = await response.json();

            setGenres(jsonData);
			setDisplayedGenres(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get user data
    useEffect(() => {
        getUserData();
		getGenres();
    }, []);

    console.log('genres: ', genres);
	

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
						<h1 className='flex justify-center font-bold text-lg py-4 mx-auto'>Géneros</h1>
						<button
							className='bg-transparent text-green-500 font-bold text-2xl py-1 px-3 border border-green-600 hover:bg-green-100 rounded-md absolute right-5'
							onClick={handleAddGenreModalOpen}
						>
							+
						</button>
					</div>
					<div className='h-screen bg-gradient-to-b from-white to-gray-300'>

						<AddGenero
							genres={genres}
							setGenres={setGenres}
							displayedGenres={displayedGenres}
							setDisplayedGenres={setDisplayedGenres}
							show={showAddGenreModal}
							onClose={handleAddGenreModalClose}
						/>
						
						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedGenres.length}
							paginate={paginate}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						<div className='w-full flex flex-col items-center'>
							{currentPosts.length > 0 && (
								currentPosts.map(genre => (
									<>
										<GeneroItem
											key={genre.id}
											genre={genre}
											genres={genres}
											setGenres={setGenres}
											displayedGenres={displayedGenres}
											setDisplayedGenres={setDisplayedGenres}
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

export default GenerosAdmin;