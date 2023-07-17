import React, { Fragment, useEffect, useState } from 'react';
import AddUser from './AddUser';
import User from './User';
import EditUser from './EditUser';

import { json, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faMoneyBillWave, faHandshake } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import Paginate from './Paginate';
import moment from 'moment';
import Select from 'react-select';

import mercado_pago_icon from "../images/mercado-pago-icon.svg";
import cash_bill_icon from "../images/cash-bill.svg";

const MisContratos = () => {
	const { isAuthenticated, userId } = useContext(AuthContext);
    const [reservas, setReservas] = useState([]);
    const [displayedReservas, setDisplayedReservas] = useState([]);
    const [dateFilter, setDateFilter] = useState('newest');
    const [user, setUser] = useState([]);
	
	// -- Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage] = useState(3);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = displayedReservas.slice(indexOfFirstPost, indexOfLastPost);

	console.log('currentPosts: ', currentPosts);


	const navigate = useNavigate();
	const cookies = new Cookies();
	const moment = require('moment');

	const optionsFecha = [
		{ value: 'newest', label: 'Más nuevos' },
		{ value: 'oldest', label: 'Más viejos' },
	];

	const optionsEstado = [
		{ value: 'active', label: 'Activos' },
		{ value: 'inactive', label: 'Inactivos' },
		{ value: 'cancelled', label: 'Cancelados' },
		{ value: 'completed', label: 'Completados' },
		{ value: 'all', label: 'Todos' },
	];

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
	
	const handleDateFilterChange = (e) => {
		setDateFilter(e.value);
		newSortReservas(e.value, '');
		setCurrentPage(1);
	}

	

	const newSortReservas = (date, status) => {
		// de todos los contratos (contracts) filtrarlos por fecha, y luego por estado, todo en esta func, y 
		// hacer un setDisplayedContracts($contractsFiltered)

		console.log('dateFilter: ', date);
		console.log('statusFilter: ', status);

		let reservasFiltered = [];

		if(date !== '') {
			if(date === 'newest'){
				reservasFiltered = sortReservasByNewest(reservasFiltered);
			}
			if(date === 'oldest'){
				reservasFiltered = sortReservasByOldest(reservasFiltered);
			}
		}
		
		setDisplayedReservas(reservasFiltered);
	}

	const sortContractsByActive = (reservasFiltered) => {
		console.log('sortContractsByActive');

		reservasFiltered = reservasFiltered.filter(contract => contract.status === 'active');

		console.log('by active contracts: ', reservasFiltered);

		return reservasFiltered;
	}

	const sortContractsByInactive = (contractsFiltered) => {
		console.log('sortContractsByInactive');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'inactive');

		console.log('by inactive contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByCompleted = (contractsFiltered) => {
		console.log('sortContractsByCompleted');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'completed');

		console.log('by completed contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByCancelled = (contractsFiltered) => {
		console.log('sortContractsByCancelled');

		contractsFiltered = contractsFiltered.filter(contract => contract.status === 'cancelled');

		console.log('by cancelled contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortContractsByAll = (contractsFiltered) => {
		console.log('sortContractsByAll');

		console.log('by all contracts: ', contractsFiltered);

		return contractsFiltered;
	}

	const sortReservasByOldest = () => {
		console.log('sortReservasByOldest');

		setDateFilter('oldest');

		let sortedArray = [...reservas];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateA.diff(dateB);
		});

		setDisplayedReservas(sortedArray);

		console.log('by oldest reservas: ', sortedArray);

		return sortedArray;
	}
	
	const sortReservasByNewest = () => {
		console.log('sortReservasByNewest');

		setDateFilter('newest');

		let sortedArray = [...reservas];

		sortedArray.sort((a, b) => {
			const dateA = moment(a.date, 'DD/MM/YYYY');
			const dateB = moment(b.date, 'DD/MM/YYYY');
			return dateB.diff(dateA);
		});

		console.log('by newest reservas: ', sortedArray);

		return sortedArray;
	}

    // get all reservas
    const getReservas = async () => {
        try {
            console.log(`http://localhost:5000/reservas?user_id=${userId}`)

            const response = await fetch(`http://localhost:5000/reservas?user_id=${userId}`);
            const jsonData = await response.json();

			jsonData.sort((a, b) => {
				const dateA = moment(a.date, 'DD/MM/YYYY');
				const dateB = moment(b.date, 'DD/MM/YYYY');
				return dateB.diff(dateA);
			});

			console.log('jsonData: ');
			console.log(jsonData);

            setReservas(jsonData);
			setDisplayedReservas(jsonData);

        } catch (error) {
            console.error(error.message);
        }
    };

    const getUserData = async () => {
		const response = await fetch("http://localhost:5000/users/" + userId);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

    // when page loads, get all Users
    useEffect(() => {
        getReservas();
        getUserData();
    }, []);

    // console.log('contracts');
    // console.log(contracts);

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
						<h1 className='flex justify-center font-bold text-lg py-4'>Mis reservas</h1>
					</div>
					<div className='mb-28'>
						<div className='flex flex-row'>
							<Select
								// value={selectedHoraDesde}
								onChange={e => handleDateFilterChange(e)}
								placeholder={'Fecha:'}
								options={optionsFecha}
								isSearchable={false}
								maxMenuHeight={240}
								className='rounded-md m-5 w-1/2'
								theme={(theme) => ({
									...theme,
									borderRadius: 10,
									colors: {
									...theme.colors,
									primary25: '#8FD5FF',
									primary: 'black',
									},
								})}
							/>
							
						</div>
						<Paginate
							postsPerPage={postsPerPage}
							totalPosts={displayedReservas.length}
							paginate={paginate}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
						/>
						{/* <p className='m-5'>Más nuevos</p> */}
						{currentPosts.length > 0 && (
							currentPosts.map(reserva => (
								<div 
									className={`${reserva.status === 'active' ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' 
									: reserva.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-400'
									: reserva.status === 'cancelled' ? 'bg-red-500'
									: 'bg-gray-700'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium`}
									key={reserva.id}
								>
									<p>Fecha: {reserva.date}</p>
									<p>Hora: {reserva.horario}</p>
									<p>Sede: </p>
									<p>Ubicacion de la sede: </p>
								</div>
							))
						)}
					</div>
                </div>

			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default MisContratos;