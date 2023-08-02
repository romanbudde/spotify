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

const EditArtist = ({ artist, artists, setArtists, displayedArtists, setDisplayedArtists, show, onClose }) => {

	// console.log('sede passed: ', sede);
	// console.log('--------------- displayed users passed: ', displayedSedes);

    const [name, setName] = useState('');
    const [id, setId] = useState('');
   
	const [editDataMessageError, setEditDataMessageError] = useState(false);
	const [displayEditDataMessage, setDisplayEditDataMessage] = useState(false);
    // const [userType, setUserType] = useState('');
	const navigate = useNavigate();
	const cookies = new Cookies();

	

	const closeEditDataMessage = () => {
        setDisplayEditDataMessage(false);
    }

	const UpdateSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'El nombre es demasiado corto!')
			.max(50, 'El nombre es demasiado largo!')
			.required('Campo requerido!')
	});

	useEffect(() => {
        if (artist) {
            setName(artist.name || '');
            setId(artist.id || '');
        }
    }, [artist]);

    if(!show) return null;

    const updateArtist = async (values) => {
        // console.log(description);

		console.log('values: ', values);

		const authToken = cookies.get('auth-token');
		if(!authToken) {
			return navigate('/');
		}

        // e.preventDefault();
        try {
            const bodyJSON = { ...values };
			console.log('bodyJSON: ', bodyJSON);
            const id = artist.id;
            const artistUpdate = await fetch(
                (process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : `http://localhost:5000/`) + `artist/${artist.id}`,
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
            console.log(artistUpdate);
            
            let updatedArtist = {
                name: name,
                id: id
            }

			// console.log('user updated: ', sedeUpdate);

			// console.log('------------ sedes', sedes);
			// console.log('------------ displayed sedes', displayedSedes);

            setArtists(artists.map((artist) => artist.id === artistUpdate.id ? artistUpdate : artist));
            setDisplayedArtists(displayedArtists.map((artist) => artist.id === artistUpdate.id ? artistUpdate : artist));

			if (artistUpdate.id){
				setEditDataMessageError(false);
				setDisplayEditDataMessage(true);
			}
            
            console.log('updatedArtist:');
            console.log(updatedArtist);
            // console.log('user.id === id? :');
            // console.log(user.id === id ? 'true' : 'false');

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Fragment>
			<Formik
				// innerRef={formik} // Add a ref to the formik object
				initialValues={{
					id: id,
					name: name
				}}
				validationSchema={UpdateSchema}
				// onSubmit={onSubmitUser}
				onSubmit={(values) => {
					// same shape as initial values
					// setFieldValue('address', address);
					console.log('submit form!');
					console.log(values);
					updateArtist(values);
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
								<p className='font-bold my-2'>Edite los datos</p>
								<div className='flex flex-col py-2'>
									<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
										Artist ID (no editable)
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
								<div className='bg-red-500 p-5 rounded w-9/12 max-w-lg flex flex-col gap-5 items-center justify-center relative'>
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
								<div className='bg-green-400 p-5 rounded w-9/12 max-w-lg flex flex-col gap-5 items-center justify-center relative'>
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

export default EditArtist;