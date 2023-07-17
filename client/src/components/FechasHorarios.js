import React, { Fragment, useEffect, useState } from 'react';

import '../css/datepicker.css';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import Calendar from 'react-calendar';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Datepicker from "react-tailwindcss-datepicker";
import CuidadorBottomBar from './CuidadorBottomBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faXmark, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
// import { registerLocale, setDefaultLocale } from  "react-tailwindcss-datepicker";
import es from 'date-fns/locale/es';
// registerLocale('es', es)
import dayjs from 'dayjs';
import moment from 'moment';

const FechasHorarios = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);
    const [date, setDate] = useState(new Date());
    const [selectedHoraDesde, setSelectedHoraDesde] = useState();
    const [selectedHoraHasta, setSelectedHoraHasta] = useState();
    const [selectedDatesInterval, setSelectedDatesInterval] = useState({ 
		startDate: new Date(), 
		endDate: new Date()
	});
	const [horariosDisponibles, setHorariosDisponibles] = useState([]);
	const [datesArrayToAdd, setDatesArrayToAdd] = useState([]);
	const [optionsFiltered, setOptionsFiltered] = useState([]);
	const [displayEliminarDisponibilidadError, setDisplayEliminarDisponibilidadError] = useState(false);
	const [eliminarDisponibilidadError, setEliminarDisponibilidadError] = useState('');
	const navigate = useNavigate();
	const cookies = new Cookies();

	let formattedDate = date.toLocaleDateString("en-GB");
	console.log(formattedDate);

	const optionsUnfiltered = [
		{ value: '00:00', label: '00:00' },
		{ value: '00:30', label: '00:30' },
		{ value: '01:00', label: '01:00' },
		{ value: '01:30', label: '01:30' },
		{ value: '02:00', label: '02:00' },
		{ value: '02:30', label: '02:30' },
		{ value: '03:00', label: '03:00' },
		{ value: '03:30', label: '03:30' },
		{ value: '04:00', label: '04:00' },
		{ value: '04:30', label: '04:30' },
		{ value: '05:00', label: '05:00' },
		{ value: '05:30', label: '05:30' },
		{ value: '06:00', label: '06:00' },
		{ value: '06:30', label: '06:30' },
		{ value: '07:00', label: '07:00' },
		{ value: '07:30', label: '07:30' },
		{ value: '08:00', label: '08:00' },
		{ value: '08:30', label: '08:30' },
		{ value: '09:00', label: '09:00' },
		{ value: '09:30', label: '09:30' },
		{ value: '10:00', label: '10:00' },
		{ value: '10:30', label: '10:30' },
		{ value: '11:00', label: '11:00' },
		{ value: '11:30', label: '11:30' },
		{ value: '12:00', label: '12:00' },
		{ value: '12:30', label: '12:30' },
		{ value: '13:00', label: '13:00' },
		{ value: '13:30', label: '13:30' },
		{ value: '14:00', label: '14:00' },
		{ value: '14:30', label: '14:30' },
		{ value: '15:00', label: '15:00' },
		{ value: '15:30', label: '15:30' },
		{ value: '16:00', label: '16:00' },
		{ value: '16:30', label: '16:30' },
		{ value: '17:00', label: '17:00' },
		{ value: '17:30', label: '17:30' },
		{ value: '18:00', label: '18:00' },
		{ value: '18:30', label: '18:30' },
		{ value: '19:00', label: '19:00' },
		{ value: '19:30', label: '19:30' },
		{ value: '20:00', label: '20:00' },
		{ value: '20:30', label: '20:30' },
		{ value: '21:00', label: '21:00' },
		{ value: '21:30', label: '21:30' },
		{ value: '22:00', label: '22:00' },
		{ value: '22:30', label: '22:30' },
		{ value: '23:00', label: '23:00' },
		{ value: '23:30', label: '23:30' },
		{ value: '00:00', label: '00:00' },
	];

	const options = optionsUnfiltered.filter( time => time.value > moment().format('HH:mm'));

	console.log('options: ', options);
	console.log('current time: ', moment().format('HH:mm'));

	console.log("isAuthenticated: ", isAuthenticated);
	console.log("userId: ", userId);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectLanding = () => {
		navigate('/landing-cuidador');
	}

	const redirectFechasYHorarios = () => {
		navigate('/fechas-y-horarios');
	}

	const redirectProfile = () => {
		navigate('/filter-cuidadores');
	}

	const onChange = (selectedDate) => {
		// esto deberia tambien llamar al backend y traer los horarios disponibles para esa fecha.

		setDate(selectedDate);
		console.log("selected date: ", selectedDate);
	};

	const handleHoraDesdeChange = (e) => {
		console.log('change hora desde: ', e.value);
		setSelectedHoraDesde(e.value);
	}
	
	const handleHoraHastaChange = (e) => {
		console.log('change hora hasta: ', e.value);
		setSelectedHoraHasta(e.value);
	}

	const handleSelectedDatesIntervalChange = (newInterval) => {
		console.log("Dates interval new value:", newInterval);
		let startDate = formatDate(newInterval.startDate);
		let endDate = formatDate(newInterval.endDate);

		console.log(`startDate at Interval Change: ${startDate}`);
		console.log(`endDate at Interval Change: ${endDate}`);

		// console.log("Formatted dates interval new value:", newInterval);
		setSelectedDatesInterval(newInterval);

		console.log('start date: ', startDate);
		console.log('end date: ', endDate);
		console.log('horarios Disponibles: ', horariosDisponibles);

		let newHorariosDisponibles = {...horariosDisponibles};
		// newHorariosDisponibles[formattedDate] = timeArray;

		// const datesArrayToAdd = createDatesArray(startDate, endDate);
		setDatesArrayToAdd(createDatesArray(startDate, endDate));

		console.log('dates interval in between the 2 selected dates: ', createDatesArray(startDate, endDate));

		// console.log('---------newHorariosDisponibles ---------');
		// console.log(newHorariosDisponibles);
		// console.log('---------newHorariosDisponibles[25/05/2023] ---------');
		// console.log(newHorariosDisponibles['25/05/2023']);

		// setHorariosDisponibles(newHorariosDisponibles);

		// api_caregiver_update_available_dates(newHorariosDisponibles);

	}

	const closeDisponibilidadErrorMessage = () => {
		setDisplayEliminarDisponibilidadError(false);
	}

	// delete horario function
    const deleteHorario = async (horario) => {
        try {
            let disabledUser = {};
			console.log('delete horario: ', horario);
			console.log('horarios disponibles en formatted date: ', horariosDisponibles[formattedDate]);

			const body = {
				"caregiver_id": userId,
				"date": formattedDate,
				"timeToDelete": horario
			};

            const deleteTime = await fetch(`http://localhost:5000/caregiver_delete_single_time`, {
                method: "POST",
				headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
				.then(result => {
					console.log('result: ', result);
					
					if(result.error){
						setDisplayEliminarDisponibilidadError(true);
						setEliminarDisponibilidadError(result.error);
					}
					if(result.newAvailabilities){
						// si el borrado en la DB es exitoso, ahi updateamos el front
						let newHorariosDisponibles = {...horariosDisponibles};
			
						console.log('newHorariosDisponibles: ', newHorariosDisponibles);
						newHorariosDisponibles[formattedDate] = newHorariosDisponibles[formattedDate].filter(time => time !== horario);
						console.log('newHorariosDisponibles pero ahora filtrados: ', newHorariosDisponibles);
			
						setHorariosDisponibles(newHorariosDisponibles);
					}
				});


        } catch (error) {
            console.error(error);
        }
    }

	function createDatesArray(startDate, endDate) {
		const dates = [];
		const startDateParts = startDate.split('/');
		const endDateParts = endDate.split('/');

		console.log('startDateParts: ', startDateParts)
	  
		const start = new Date(
		  startDateParts[2],
		  startDateParts[1] - 1,
		  startDateParts[0]
		);

		console.log('start: ', start);
		const end = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]);
	  
		// Loop through each date and add it to the array
		for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
		  const formattedDate = `${date
			.getDate()
			.toString()
			.padStart(2, '0')}/${(date.getMonth() + 1)
			.toString()
			.padStart(2, '0')}/${date.getFullYear()}`;
	  
		  dates.push(formattedDate);
		}
	  
		return dates;
	}
	  

	// get all users function
    const getHorarios = async () => {
        try {
            const response = await fetch("http://localhost:5000/caregiver_get_available_dates?caregiver_id=" + userId);
            const jsonData = await response.json();

			console.log('---- inside getHorarios ----');
			console.log(jsonData);

			console.log('Longitud de claves del objecto jsonData dentro de getHorarios:', Object.keys(jsonData).length);
			if(Object.keys(jsonData).length === 0) {
				// entonces el cuidador no tiene ningun horario disponible
				setHorariosDisponibles([]);
			}
			else {
				// el cuidador ya ha disponibilizado horarios en algun otro momento
				setHorariosDisponibles(jsonData.availabilities.dates);
			}
        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get all Users
    useEffect(() => {
        getHorarios();

		const today = moment().format('DD/MM/YYYY');
		setDatesArrayToAdd([today]);
    }, []);

	const api_caregiver_update_available_dates = async newHorariosDisponibles => {
		// backend call para updatear la DB con los nuevos horarios para el dia

		console.log('----- newHorariosDisponibles at backend call -----');
		console.log(newHorariosDisponibles);

		let bodyJSON = { 
			caregiver_id: userId, 
			dates: newHorariosDisponibles
		};

		const response = await fetch("http://localhost:5000/caregiver_update_available_dates/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(bodyJSON)
		})
			.then(response => response.json())
			.then(result => {
				if(result){
					console.log('newAvailabilities: ');
					console.log(result);
				}
			});
	}

	const createTimeArray = (startTime, endTime) => {
		console.log('in createTimeArray');
		// const start = new Date(`01/01/2000 ${startTime}`);
		// const end = new Date(`01/01/2000 ${endTime}`);
		console.log('formattedDate at createTimeArray(): ');
		console.log(formattedDate);
		// if(horariosDisponibles())

		let newHorariosDisponibles = {...horariosDisponibles};
		let currentTime;
		let end;
		let timeArray = [];

		// console.log(`----- datesArrayToAdd: -----`);
		// console.log(datesArrayToAdd);

		datesArrayToAdd.forEach(day => {
			// console.log('day we are adding (foreach loop): ', day);
			if (horariosDisponibles[day] && horariosDisponibles[day].length > 0) {
				timeArray = horariosDisponibles[day];
			}
			else {
				timeArray = [];
			}
			
			// currentTime = new Date(`${day} ${startTime}`);
			// end = new Date(`${day} ${endTime}`);

			currentTime = moment(`${day} ${startTime}`, 'DD/MM/YYYY HH:mm');
			end = moment(`${day} ${endTime}`, 'DD/MM/YYYY HH:mm');

			// console.log(`time array for day ${day}: `, timeArray);

			// console.log(`startTime: ${startTime}, endTime: ${endTime}`);
			// console.log(`currentTime: ${currentTime}`);
			// console.log(`end: ${end}`);
			
			while (currentTime < end) {
				const formattedTime = currentTime.format('HH:mm')

				// console.log(`formated time inside while ${formattedTime}`);
			
				
				if (!timeArray.includes(formattedTime)) {
					timeArray.push(formattedTime);
				}
		
				currentTime.add(30, 'minutes');
			}
	
			// Sort the timeArray
			timeArray.sort(timeComparator);
			
			newHorariosDisponibles[day] = timeArray;
	
			console.log('---------newHorariosDisponibles ---------');
			console.log(newHorariosDisponibles);
		});

		setHorariosDisponibles(newHorariosDisponibles);

		api_caregiver_update_available_dates(newHorariosDisponibles);
	}

	const disponibilizarHorarios = async () => {
		console.log('disponibilizar horarios');
		// para la hora desde a hora hasta, armar de a media hora cada horario disponible, y armarlo en un arreglo
		// de horariosDisponibles, por ej: ['00:00', '00:30', '01:00', ...]

		createTimeArray(selectedHoraDesde, selectedHoraHasta);
	}

	const renderHorarios = () => {
		// console.log('-------formattedDate---------');
		// console.log(formattedDate.toString());
		// console.log('-------horariosDisponibles---------');
		// console.log(horariosDisponibles);
		// console.log('-------horariosDisponibles[formattedDate]---------');
		// console.log(horariosDisponibles['25/05/2023']);
		if (horariosDisponibles && horariosDisponibles[formattedDate] && horariosDisponibles[formattedDate].length > 0) {
			return horariosDisponibles[formattedDate].map((horario) => (
				<li className="p-2 pl-5 flex flex-row justify-between pr-5">
					<p>{horario}</p>
					<FontAwesomeIcon
						icon={faCircleXmark}
						size="md"
						className='text-2xl'
						style={{color: "#000",}} 
						onClick={ () => deleteHorario(horario) }
					/>
				</li>
			));
		}
		else {
			return (
				<li className="p-2 pl-5 bg-slate-300">
				<p>Aún no hay horarios disponibles para este día</p>
				</li>
			);
		}
	};

	// Custom comparator function to sort time strings.
	const timeComparator = (a, b) => {
		const timeA = new Date(`1970/01/01 ${a}`);
		const timeB = new Date(`1970/01/01 ${b}`);
		return timeA - timeB;
	}

	// Convert a date from the format "yyyy-mm-dd" to "dd/mm/yyyy".
	const formatDate = (dateString) => {
		console.log('dateString to format: ', dateString);
		const date = dayjs(dateString);
		const formattedDate = date.format('DD/MM/YYYY');
		
		console.log(formattedDate);
		return formattedDate;
	};

	console.log('1 day earlier: ', moment().subtract(1, 'day').format('DD/MM/YYYY'));

	// console.log('horariosDisponibles');
	// console.log(horariosDisponibles);
	// console.log('horariosDisponibles 14/05/2023');
	// console.log(horariosDisponibles['14/05/2023']);

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='min-w-70 w-96 rounded-md'>
					<CuidadorBottomBar />
					<div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Tus dias y horarios disponibles</h1>
					</div>
					<div className='space-y-5 p-10 mx-auto flex flex-col justify-center items-center mb-20'>
						<p>Elija un día y vea sus horarios disponibles</p>
						<Calendar
							className={'rounded-md border-transparent'}
							onChange={onChange}
							value={date}
							minDate={new Date()} 
							locale={'es-ES'}
						/>
						<div className='w-full flex flex-row items-center gap-10'>
							<div className='flex flex-col justify-between w-full'>
								<p>Puede seleccionar un intervalo de fechas:</p>
								<Datepicker
									primaryColor={"emerald"}
									i18n={"es"} 
									minDate={moment().subtract(1, 'day')} 
									// dateFormat="MMMM eeee d, yyyy h:mm aa"
									separator={"a"}
									displayFormat={"DD/MM/YYYY"} 
									value={selectedDatesInterval}
									locale="es"
									onChange={handleSelectedDatesIntervalChange}
								/>
							</div>
						</div>
						<div className='w-full flex flex-row items-center gap-10'>
							<div className='flex flex-col justify-between w-full'>
								<p className='pl-2'>Desde</p>
								<Select
									value={selectedHoraDesde}
									onChange={e => handleHoraDesdeChange(e)}
									placeholder={selectedHoraDesde ? selectedHoraDesde : 'Hora'}
									options={options}
									maxMenuHeight={160}
									className='rounded-md'
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
							<div className='flex flex-col justify-between w-full'>
								<p className='pl-2'>Hasta</p>
								<Select
									value={selectedHoraHasta}
									onChange={e => handleHoraHastaChange(e)}
									placeholder={selectedHoraHasta ? selectedHoraHasta : 'Hora'}
									options={options}
									maxMenuHeight={160}
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
						</div>
						<button
							className='w-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick = {disponibilizarHorarios}
						>
							Disponibilizar horarios
						</button>
						<h4>Tus horarios para el día {formattedDate}</h4>
						{console.log('horariosDisponibles[formattedDate] in return')}
						{console.log(horariosDisponibles[formattedDate])}
						<ul className="flex flex-col w-full rounded-md bg-green-300 max-h-60 overflow-auto">
							{console.log('date: ', date)}
							{console.log('formatted date: ', formattedDate)}
							{renderHorarios()}
						</ul>
					</div>
					
					
				</div>
				{ displayEliminarDisponibilidadError && (
					<div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
						<div className='bg-red-500 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
							<button onClick={ closeDisponibilidadErrorMessage } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
								<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
								<span className="sr-only">Close modal</span>
							</button>
							<p className='font-bold text-2xl text-white'>Error!</p>
							<p className='text-white text-center font-medium'>{ eliminarDisponibilidadError }</p>
							<FontAwesomeIcon icon={faCircleXmark} size="2xl" className='text-8xl' style={{color: "#fff",}} />
							<button
								className='bg-red-800 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
								onClick={ closeDisponibilidadErrorMessage }
							>
								Continuar
							</button>
						</div>
					</div>
				)}
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default FechasHorarios;