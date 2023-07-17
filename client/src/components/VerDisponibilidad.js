import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import moment from 'moment';
import Select from 'react-select';
import Datepicker from "react-tailwindcss-datepicker";
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faMoneyBillWave, faHandshake } from '@fortawesome/free-solid-svg-icons';
import '../css/calendar.css';

const VerDisponibilidad = ({ sede, show, onClose }) => {

	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const navigate = useNavigate();
	const cookies = new Cookies();
    const [date, setDate] = useState(new Date());
	const [horariosDisponibles, setHorariosDisponibles] = useState([]);
	const [checkedHorario, setCheckedHorario] = useState('');
	const [displayCreateContractMessage, setDisplayCreateContractMessage] = useState(false);
	const [createContractMessage, setCreateContractMessage] = useState('');
	const [contractResponseError, setContractResponseError] = useState(false);
    const [horariosReservasExistentes, setHorariosReservasExistentes] = useState([]);
    const [userCantCreateReservaToday, setUserCantCreateReservaToday] = useState(false);
    const [horaDelTurnoYaReservadoPorUsuario, setHoraDelTurnoYaReservadoPorUsuario] = useState('');


	let formattedDate = date.toLocaleDateString("en-GB");

    // console.log('horarios disponibles: ', horariosDisponibles);
    
	// get all users function
    const getReservationsForSelectedSede = async () => {
        try {
            console.log('---------- sede.id: ', sede.id);
            const response = await fetch("http://localhost:5000/reservas?sede_id=" + sede.id);
            const jsonData = await response.json();

			console.log('---- inside getReservationsForSelectedSede ----');
			console.log(jsonData);

            const today = moment().format("DD/MM/YYYY");
            console.log('today is: ', today);

            let horarios_reservados = {};
            jsonData.map(reservation => {
                // console.log('reservation: ', reservation);
                // console.log('reservation.user_id: ', reservation.user_id);
                // console.log('user_id: ', userId);
                // console.log('reservation.user_id === user_id: ', reservation.user_id.toString() === userId);
                if(reservation.date === today && reservation.sede_id === sede.id && reservation.user_id.toString() === userId){
                    setUserCantCreateReservaToday(true);
                    setHoraDelTurnoYaReservadoPorUsuario(reservation.horario);
                }
                if(reservation.sede_id === sede.id && today === reservation.date ){
                    if (horarios_reservados[reservation.horario]) {
                        horarios_reservados[reservation.horario]++;
                    } else {
                        horarios_reservados[reservation.horario] = 1;
                    }
                }
            })

            setHorariosReservasExistentes(horarios_reservados);
        } catch (error) {
            console.error(error.message);
        }
    };

    // when modal loads, get reservations for that sede, to know what quota there is available
    useEffect(() => {
        getReservationsForSelectedSede();
		// const today = moment().format('DD/MM/YYYY');
    }, []);

    // const handleHorariosArray = (horario) => {
    //     console.log('clicked an horario: ', horario);
    // }
    
    // console.log('checkedHorario: ', checkedHorario);
    // console.log(checkedHorario);
    // console.log('horarios reservas existentes: ', horariosReservasExistentes);
    
    const handleCheckboxChange = (horario) => {
        console.log('clicked an horario: ', horario);
        setCheckedHorario(horario);
        // if (checkedHorarios.includes(horario)) {
        //   setCheckedHorarios(checkedHorarios.filter((item) => item !== horario));
        // } else {
        //   setCheckedHorarios([...checkedHorarios, horario]);
        // }
    };

    const closeContractResponseModal = () => {
        setDisplayCreateContractMessage(false);
    }

    // console.log('checkedHorarios: ');
    // console.log(checkedHorarios);
    // console.log('date selected: ', date);
    
    const createReservation = async () => {
        // usando los datos de: checkedHorarios, date, userId, cuidadorId. voy al backend y creo el contract.
        const reservationDate = date.toLocaleDateString("en-GB");
        console.log('reservationDate: ', reservationDate);
        console.log('contractCheckedHorario: ', checkedHorario);
        console.log('user id: ', userId);

        // resetear checkedHorarios

        setCheckedHorario('');

        // let cuidador_id = cuidador.id;

        const body = {
            sede_id: sede.id, 
            user_id: userId, 
            date: reservationDate, 
            horario: checkedHorario
        };

        const response = await fetch("http://localhost:5000/reservas/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        
        const result = await response.json();

        console.log('111111111');
        console.log(result);
        if(result.error){
            console.log('Display error: ', result.error);
            setCreateContractMessage(result.error);
            setDisplayCreateContractMessage(true);
            setContractResponseError(true);
        }
        else {
            let newHorariosReservasExistentes = { ...horariosReservasExistentes };
            // newHorariosReservasExistentes = newHorariosReservasExistentes.map(horario => {
                //     console.log('--------horario: ', horario);
                // })
                // console.log('-------------- checkedHorario: ', checkedHorario);
                // console.log('-------------- newHorariosReservasExistentes.checkedHorario: ', newHorariosReservasExistentes[checkedHorario]);
                // console.log('-------------- newHorarioReservas existentes en la creacion de reserva: ', newHorariosReservasExistentes);
                newHorariosReservasExistentes[checkedHorario] = newHorariosReservasExistentes[checkedHorario] ? 
                    newHorariosReservasExistentes[checkedHorario] + 1 : 1;  
                setHorariosReservasExistentes(newHorariosReservasExistentes);
                setContractResponseError(false);
                setDisplayCreateContractMessage(true);
                setCreateContractMessage('Reserva registrada con exito.');
                setUserCantCreateReservaToday(true);
                console.log('setHoraDelTurnoYaReservadoPorUsuario: ', result.horario);
                setHoraDelTurnoYaReservadoPorUsuario(result.horario);
            }
        console.log('222222222');
    }

	const renderHorarios = () => {
        const currentTime = moment().format('HH:mm');
		if (sede.horarios && sede.horarios.horarios && sede.horarios.horarios.length > 0) {
            return sede.horarios.horarios.map((horario, index) => {
                // console.log('checkedHorarios: ', checkedHorarios);
                // checkedHorarios.includes(horario) ? console.log('includes') : console.log('does NOT include');
                if ( moment(currentTime, 'HH:mm').isBefore(moment(horario, 'HH:mm')) ) {
                    return(
                        <li className='flex flex-row items-center p-7 gap-2 relative text-black' key={index}>
                            <label htmlFor={horario} className='w-full flex items-center cursor-pointer'>
                                <span className={`absolute p-5 inset-0 transition bg-gray-400 ${checkedHorario === horario ? 'bg-green-400' : ''}`}>
                                    {horario}
                                </span>
                                <p className='absolute text-white right-5'>
                                {horario in horariosReservasExistentes
                                 ? `${horariosReservasExistentes[horario]}/${sede.max_cupo}`
                                 : `0/${sede.max_cupo}`
                                }
                                </p>
                                <input
                                    type='checkbox'
                                    className='hidden'
                                    value={horario}
                                    name={horario}
                                    id={horario}
                                    // onClick={ (e) => console.log('clicked an horario: ', horario)}
                                    onChange={() => handleCheckboxChange(horario)}
                                />
                            </label>
                        </li>
                    );
                }
            });
		}
		else {
			return (
				<li className="p-2 pl-5 bg-slate-400 ">
				    <p>No hay horarios disponibles</p>
				</li>
			);
		}
	};
    
    if(!show) return null;

    return (
        <Fragment>
            <div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
                <div className='flex flex-col relative w-5/6 max-h-screen'>
                    <button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className='bg-white p-5 rounded flex flex-col gap-5 items-center justify-center'>
                        { !userCantCreateReservaToday ? (
                            <>
                                <div className="flex items-start justify-between border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-5">
                                        Horarios disponibles para la sede {sede.name}
                                    </h3>
                                </div>
                                <p className='text-black'>Turnos para hoy</p>
                                <ul className="flex flex-col w-full rounded-md max-h-56 overflow-scroll">
                                    {console.log('date: ', date)}
                                    {/* {console.log('formatted date: ', formattedDate)} */}
                                    {renderHorarios()}
                                </ul>
                                {sede.horarios && sede.horarios.horarios && sede.horarios.horarios.length > 0 && (
                                    <button 
                                        className='bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                        onClick={ createReservation }
                                    >
                                        Crear reserva para este turno
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <div className='flex flex-col gap-3 mt-4'>
                                    <p className='text-black opacity-70'>Ya tienes un turno para hoy en esta sede!</p>
                                    <p className='text-black opacity-70 text-left'>Horario: {horaDelTurnoYaReservadoPorUsuario}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {  displayCreateContractMessage && contractResponseError === true  &&(
                <div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
                    <div className='bg-red-500 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
                        <button onClick={ closeContractResponseModal } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <p className='font-bold text-2xl text-white'>Error!</p>
                        <p className='text-white text-center font-medium'>{ createContractMessage }</p>
                        <FontAwesomeIcon icon={faCircleXmark} size="2xl" className='text-8xl' style={{color: "#fff",}} />
                        <button
                            className='bg-red-800 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
                            onClick={ closeContractResponseModal }
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}
            {  displayCreateContractMessage && contractResponseError === false && (
                <div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
                    <div className='bg-green-400 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
                        <button onClick={ closeContractResponseModal } type="button" className="absolute top-2 right-2 text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <p className='font-bold text-2xl text-white'>Reserva creada!</p>
                        <p className='text-white text-center font-medium'>{ createContractMessage }</p>
                        <FontAwesomeIcon icon={faCircleCheck} size="2xl" className='text-8xl' style={{color: "#fff",}} />
                        <button
                            className='bg-green-600 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
                            onClick={ closeContractResponseModal }
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default VerDisponibilidad;