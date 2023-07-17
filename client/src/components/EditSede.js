import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import Autocomplete from "react-google-autocomplete";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import '../css/autocomplete.css';

const EditSede = ({ sede, sedes, setSedes, displayedSedes, setDisplayedSedes, show, onClose }) => {

	// console.log('sede passed: ', sede);
	// console.log('--------------- displayed users passed: ', displayedSedes);

    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [cupo, setCupo] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
	const [editDataMessageError, setEditDataMessageError] = useState(false);
	const [displayEditDataMessage, setDisplayEditDataMessage] = useState(false);
    const [horarios, setHorarios] = useState(sede.horarios ? sede.horarios.horarios : '');
	const [checkedHorarios, setCheckedHorarios] = useState(sede.horarios ? sede.horarios.horarios : '');
    // const [userType, setUserType] = useState('');
	const navigate = useNavigate();
	const cookies = new Cookies();

	const handleCheckboxChange = (horario) => {
        console.log('clicked an horario: ', horario);
        if (checkedHorarios.includes(horario)) {
			setCheckedHorarios(checkedHorarios.filter((item) => item !== horario).sort());
			setHorarios(checkedHorarios.filter((item) => item !== horario).sort());
        } else {
			setCheckedHorarios([...checkedHorarios, horario].sort());
			setHorarios([...checkedHorarios, horario].sort());
        }
    };

	const closeEditDataMessage = () => {
        setDisplayEditDataMessage(false);
    }

	const UpdateSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'El nombre es demasiado corto!')
			.max(50, 'El nombre es demasiado largo!')
			.required('Campo requerido!'),
		cupo: Yup.number()
			.min(1, 'Muy pocos cupos!')
			.max(999, 'Demiados cupos!')
			.required('Campo requerido!'),
		address: Yup.string()
			.min(4, 'Dirección demasiado corta!')
			.max(100, 'La dirección es demasiado larga.')
			.matches(/^.*\b\w+\b.*\d.*,.*/, 'La dirección no posee altura de la calle.')
			.required('Campo requerido!'),
		horarios: Yup.array()
			.max(24, 'Horarios demasiado largos')
			// .required('Elija al menos un horario.'),
	});

	useEffect(() => {
        if (sede) {
            setAddress(sede.address || '');
            setCupo(sede.max_cupo || '');
            setName(sede.name || '');
            setId(sede.id || '');
        }
    }, [sede]);

    if(!show) return null;

    const updateSede = async (values) => {
        // console.log(description);

		console.log('values: ', values);

		const authToken = cookies.get('auth-token');
		if(!authToken) {
			return navigate('/');
		}

        // e.preventDefault();
        try {
            const bodyJSON = { ...values };
			// bodyJSON.userType = user.type;
			// bodyJSON.enabled = user.enabled;
			// console.log('userType: ', user.type);
			// console.log('enabled: ', user.enabled);
			bodyJSON.horarios = { horarios: horarios };
			bodyJSON.latitude = latitude;
			bodyJSON.longitude = longitude;
			console.log('bodyJSON: ', bodyJSON);
			console.log('----------------- AT SUBMIT, Horarios: ', horarios)
            const id = sede.id;
            const sedeUpdate = await fetch(
                `http://localhost:5000/sedes/${sede.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            )
                .then(response => response.json())

            console.log('update response:');
            console.log(sedeUpdate);
            
            let updatedSede = {
                address: address,
                name: name,
                cupo: cupo,
				horarios: horarios,
                id: id
            }

			// console.log('user updated: ', sedeUpdate);

			// console.log('------------ sedes', sedes);
			// console.log('------------ displayed sedes', displayedSedes);

            setSedes(sedes.map((sede) => sede.id === sedeUpdate.id ? sedeUpdate : sede));
            setDisplayedSedes(displayedSedes.map((sede) => sede.id === sedeUpdate.id ? sedeUpdate : sede));

			if (sedeUpdate.id){
				setEditDataMessageError(false);
				setDisplayEditDataMessage(true);
			}
            
            console.log('updatedSede:');
            console.log(updatedSede);
            // console.log('user.id === id? :');
            // console.log(user.id === id ? 'true' : 'false');

        } catch (error) {
            console.error(error.message);
        }
    };

	const optionsUnfiltered = [
		{ value: '00:00', label: '00:00' },
		{ value: '01:00', label: '01:00' },
		{ value: '02:00', label: '02:00' },
		{ value: '03:00', label: '03:00' },
		{ value: '04:00', label: '04:00' },
		{ value: '05:00', label: '05:00' },
		{ value: '06:00', label: '06:00' },
		{ value: '07:00', label: '07:00' },
		{ value: '08:00', label: '08:00' },
		{ value: '09:00', label: '09:00' },
		{ value: '10:00', label: '10:00' },
		{ value: '11:00', label: '11:00' },
		{ value: '12:00', label: '12:00' },
		{ value: '13:00', label: '13:00' },
		{ value: '14:00', label: '14:00' },
		{ value: '15:00', label: '15:00' },
		{ value: '16:00', label: '16:00' },
		{ value: '17:00', label: '17:00' },
		{ value: '18:00', label: '18:00' },
		{ value: '19:00', label: '19:00' },
		{ value: '20:00', label: '20:00' },
		{ value: '21:00', label: '21:00' },
		{ value: '22:00', label: '22:00' },
		{ value: '23:00', label: '23:00' },
	];

	// console.log('options unfiltered: ', optionsUnfiltered)
	console.log('--------- horarios: ', horarios)
	console.log('--------- sede.horarios: ', sede.horarios)
	console.log('--------- checked horarios: ', checkedHorarios)

    return (
        <Fragment>
			<Formik
				// innerRef={formik} // Add a ref to the formik object
				initialValues={{
					id: id,
					address: address,
					name: name,
					cupo: cupo,
					horarios: horarios
				}}
				validationSchema={UpdateSchema}
				// onSubmit={onSubmitUser}
				onSubmit={(values) => {
					// same shape as initial values
					// setFieldValue('address', address);
					console.log('submit form!');
					console.log(values);
					updateSede(values);
				}}
			>
				{({ errors, touched, setFieldValue, setFieldError }) => (
					<Form>
						<div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
							<div className='flex flex-col relative w-5/6 bg-gray-100 p-7 rounded-md'>
								<button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
									<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
									<span className="sr-only">Close modal</span>
								</button>
								<p className='font-bold my-2'>Edite sus datos</p>
								<div className='flex flex-col py-2'>
									<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
										Sede ID (no editable)
									</label>
									<Field
										name="id"
										placeholder=""
                                        disabled
										className={`${errors.id && touched.id ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
										'bg-gray-200 text-gray-500 border text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} 
									/>
										{errors.id && touched.id ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.id}
											</div>
										) : null}
								</div>
								<div className='flex flex-col py-2'>
									<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
										Nombre
									</label>
									<Field
										name="name"
										placeholder="ej: Sede Centro"
										className={`${errors.name && touched.name ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
										'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} 
									/>
										{errors.name && touched.name ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.name}
											</div>
										) : null}
								</div>
								<div className='flex flex-col py-2'>
									<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
										Cupo máximo
									</label>
									<Field name="cupo" placeholder="ej: Gomez" className={`${errors.cupo && touched.cupo ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
									'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
										{errors.cupo && touched.cupo ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.cupo}
											</div>
										) : null}
								</div>

								<div className='flex flex-col py-2'>
									<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
										Horarios
									</label>
									<Field readOnly value={horarios} name="horarios" placeholder="ej: 09:00, 10:00, 11:00, 12:00" className={`${errors.horarios && touched.horarios ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
									'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'} overflow-x-scroll`}/>
										{errors.horarios && touched.horarios ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.horarios}
											</div>
										) : null}
									<ul className="text-black flex flex-col w-full rounded-md max-h-44 mt-2 overflow-scroll">
										{ optionsUnfiltered.map((horario, index) => (
											<li className='flex flex-row items-center p-7 gap-2 relative' key={index}>
												<label htmlFor={horario.value} className='w-full flex items-center cursor-pointer'>
													<span className={`absolute p-5 text-md inset-0 transition ${checkedHorarios.includes(horario.value) ? 'bg-green-400' : 'bg-gray-300'}`}>
														{horario.value}
													</span>
													<input
														type='checkbox'
														className='hidden'
														value={horario.value}
														name={horario.value}
														id={horario.value}
														// onClick={ (e) => console.log('clicked an horario: ', horario.value)}
														onChange={() => handleCheckboxChange(horario.value)}
													/>
												</label>
											</li>
										
										))}
									</ul>
									{/* <Horarios
										s
									/> */}
								</div>
								
								<div className='flex flex-col py-1'>
									<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
										Dirección
									</label>
									<Autocomplete
										apiKey={'AIzaSyDdEqsnFUhTgQJmNN1t4iyn3VhMLJY6Yk4'}
										debounce={1000}
										name='address'
										placeholder='Escriba su dirección'
										className={`${errors.address && touched.address ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
										'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}
										style={{ width: "100%" }}
										onChange={(e) => {
											setFieldValue('address', e.target.value);
											// setFieldError('address', 'Selecciona una direccion del menu desplegable!');
											console.log(e.target.value)
										}}
										onPlaceSelected={(place) => {
											console.log(place);
											console.log('formated address: ', place.formatted_address);
											setLatitude(place.geometry.location.lat());
											setLongitude(place.geometry.location.lng());
											setFieldValue('address', place.formatted_address);
										}}
										options={{
											types: ["address"],
											componentRestrictions: { country: "ar" },
										}}
										defaultValue={address}
									/>
									{errors.address && touched.address ? (
										<div className='text-red-500 font-normal w-full text-sm text-left'>
											{errors.address}
										</div>
									) : null}
								</div>
								<button 
									type="submit"
									className="w-full text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-12"
								>
									Guardar mis datos
								</button>
							</div>
						</div>
						{  displayEditDataMessage && editDataMessageError === true  &&(
							<div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
								<div className='bg-red-500 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
									<button onClick={ closeEditDataMessage } type="button" className="absolute top-2 right-2 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
										<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
										<span className="sr-only">Close modal</span>
									</button>
									<p className='font-bold text-2xl text-white'>Error!</p>
									<p className='text-white text-center font-medium'>No se han podido guardar los datos.</p>
									<FontAwesomeIcon icon={faCircleXmark} size="2xl" className='text-8xl' style={{color: "#fff",}} />
									<button
										className='bg-red-800 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
										onClick={ closeEditDataMessage }
									>
										Continuar
									</button>
								</div>
							</div>
						)}
						{ displayEditDataMessage && editDataMessageError === false && (
							<div className='fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex justify-center items-center'>
								<div className='bg-green-400 p-5 rounded w-9/12 flex flex-col gap-5 items-center justify-center relative'>
									<button onClick={ closeEditDataMessage } type="button" className="absolute top-2 right-2 text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
										<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
										<span className="sr-only">Close modal</span>
									</button>
									<p className='font-bold text-2xl text-white'>Genial!</p>
									<p className='text-white text-center font-medium'>Datos guardados con éxito</p>
									<FontAwesomeIcon icon={faCircleCheck} size="2xl" className='text-8xl' style={{color: "#fff",}} />
									<button
										className='bg-green-600 mt-10 hover:bg-blue-700 text-white font-bold py-2 px-16 rounded-full'
										onClick={ closeEditDataMessage }
									>
										Continuar
									</button>
								</div>
							</div>
						)}
					</Form>
				)}
			</Formik>
        </Fragment>
    );
}

export default EditSede;