import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

import useWebSocket from 'react-use-websocket';

import VerDisponibilidad from './VerDisponibilidad';
import VerMapaSede from './VerMapaSede';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import Paginate from './Paginate';

const VerSedes = () => {

	// const WS_URL = 'ws://localhost:5000/';
	
	// const socket = new WebSocket('ws://localhost:5000');
	
	// const testingWebsocket = useWebSocket(WS_URL, {
	// 	onOpen: () => {
	// 	  console.log('WebSocket connection established.');
	// 	}
	// });

	const { isAuthenticated } = useContext(AuthContext);
	const [search, setSearch] = useState('');
	const [tarifaMinima, setTarifaMinima] = useState('');
	const [tarifaMaxima, setTarifaMaxima] = useState('');
	const [checkboxesReviews, setCheckboxesReviews] = useState({
		satisfactorio: false,
		bueno: false,
		muybueno: false,
		fantastico: false
	});
	const [sedes, setSedes] = useState([]);
	const [displayedSedes, setDisplayedSedes] = useState([]);
	const [showDisponibilidadModal, setShowDisponibilidadModal] = useState(false);
	const [showMapaSedeModal, setShowMapaSedeModal] = useState(false);
	

	// -- Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedSedes.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const handleCheckboxReviewsChange = (event) => {
		const { name, checked } = event.target;
		setCheckboxesReviews(prevState => ({
			...prevState,
			[name]: checked
		}));
	};

	const navigate = useNavigate();
	const cookies = new Cookies();

	// console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectLanding = () => {
		navigate('/landing');
	}

	// const handleShowDisponibilidadModal = (cuidador) => setShowDisponibilidadModal(true);

	const handleShowMapaSede = (sede) => () => {
		// Use sede inside this function
		console.log('Clicked on:', sede);
		setShowMapaSedeModal(sede);
	  };

	const handleShowDisponibilidadModal = (sede) => () => {
		// Use sede inside this function
		console.log('Clicked on:', sede);
		setShowDisponibilidadModal(sede);
	  };

    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowDisponibilidadModal(false);
    }

    const handleCloseMapaSede = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowMapaSedeModal(false);
    }

	 // get all users function
	 const getSedes = async () => {
        try {
            const response = await fetch("http://localhost:5000/sedes/");
            const jsonData = await response.json();

            setSedes(jsonData);
            setDisplayedSedes(jsonData);

        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get all Users
    useEffect(() => {
        getSedes();
    }, []);

	console.log('sedes: ', sedes)
	// console.log(cuidadores)

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='rounded-md bg-slate-200z'>
					<ClientBottomBar />
					<div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Sedes</h1>
					</div>
				</div>
				{
					console.log('sedes length: ', sedes.length)
				}
				{ sedes.length > 0 && (
					<div className='flex flex-col space-y-4 mx-auto items-center rounded-md justify-start w-9/12 py-2 my-5 mb-28'>
						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedSedes.length}
							paginate={paginate}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						{currentPosts.length > 0 && currentPosts.map(sede => (
							<div 
								className='bg-gray-200 border border-gray-500 p-4 w-full rounded-md text-black font-semibold shadow-gray-400 shadow-lg'
								key={sede.id}
							>
								<div className='flex flex-row items-center justify-end mb-1'>
									<div
										className='flex flex-row items-center gap-2 p-1.5 bg-gray-300 border border-gray-300 rounded-md'
										onClick={handleShowMapaSede(sede)}
									>
										<FontAwesomeIcon className='text-xl text-black' icon={faLocationDot} />
										<p className='text-gray-800'>Ver en mapa</p>
									</div>
									<VerMapaSede
										sede={sede}
										show={showMapaSedeModal === sede}
										onClose={handleCloseMapaSede}
									/>
								</div>
								<h2>Sede: {sede.name}</h2>
								<h2>Direccion: {sede.address}</h2>
								<h2>Cupos por turno: {sede.max_cupo}</h2>
								<button
									className='w-full text-white bg-gradient-to-r from-yellow-400 to-yellow-500 focus:ring-4 focus:outline-none rounded-lg text-sm px-5 py-2.5 mt-2 text-center font-semibold'
									onClick={handleShowDisponibilidadModal(sede)}
								>
									Ver turnos
								</button>
								<VerDisponibilidad
									sede={sede}
									show={showDisponibilidadModal === sede}
									onClose={handleClose}
								/>
							</div>
						))}
					</div>
				)}
				{ sedes.length <= 0 && (
					<div className='flex flex-col space-y-4 mx-auto items-center rounded-md justify-start w-96 py-2 my-5'>
						<h1 className='flex justify-center font-bold text-md py-4'>No existen sedes por ahora.</h1>
					</div>
				)}
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default VerSedes;