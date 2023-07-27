import React, { Fragment, useState, useEffect } from 'react';

import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from "react-google-autocomplete";
import { faCircleXmark, faCircleCheck, faPenToSquare, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import Select from 'react-select';

const AddCancion = ( {songs, setSongs, show, onClose, displayedSongs, setDisplayedSongs, optionsArtists, optionsGenres} ) => {
	const { isAuthenticated } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [artists, setArtists] = useState('');
	const [artistsData, setArtistsData] = useState();
	const [genresData, setGenresData] = useState();
	// const [optionsArtists, setOptionsArtists] = useState();
	// const [optionsGenres, setOptionsGenres] = useState();
    const [genres, setGenres] = useState('');
    const [file, setFile] = useState('');
	const [songUploadError, setSongUploadError] = useState(false);
	const [songUploadSuccess, setSongUploadSuccess] = useState(false);
	const [songUploadMessage, setSongUploadMessage] = useState('');
	const [editDataMessageError, setEditDataMessageError] = useState(false);
	const [displayEditDataMessage, setDisplayEditDataMessage] = useState(false);
	const [checkedHorarios, setCheckedHorarios] = useState([]);
	
	const UpdateSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'El nombre es demasiado corto!')
			.max(50, 'El nombre es demasiado largo!')
			.required('Campo requerido!'),
		artist: Yup.array()
			.max(15, 'Demiados artistas!'),
			// .required('Campo requerido!'),
		genre: Yup.array()
			.max(15, 'Demasiados generos!'),
			// .required('Campo requerido!'),
	});

	const navigate = useNavigate();
	const cookies = new Cookies();

	const handleFileChange = (e) => {
		const file = {
		  preview: URL.createObjectURL(e.target.files[0]),
		  data: e.target.files[0],
		}
		setFile(file)
	}

	

	console.log('------- genres data: ', genresData)

	// when page loads, get Songs
    useEffect(() => {
        // getSongs();
		// getGenres();
		// getArtists();
    }, []);

	const closeEditDataMessage = () => {
        setDisplayEditDataMessage(false);
    }

    const onSubmitSong = async (values) => {
        console.log('----------------- onSubmitSong -------------- ');

		const authToken = cookies.get('auth-token');
		if(!authToken) {
			return navigate('/');
		}
		
        try {

			// upload song file first
			// e.preventDefault();
			console.log('file: ', file);
			console.log('file.data.name: ', file.data.name);
			let formData = new FormData();
			formData.append('file', file.data);
			// formData.append('song_id', userId);
			const response_file = await fetch('http://localhost:5000/upload_song', {
				method: 'POST',
				body: formData,
			}).then(response_file => response_file.json())
			.then(result => {
				if (!result.error){
					console.log('------- no hay error al subir la cancion');
					// setStatus(result.statusText);
					setSongUploadError(false);
					setSongUploadSuccess(true);
					setSongUploadMessage('Archivo subido con éxito!');
				}
				else {
					console.log('------- hubo un error al subir la cancion');
					setSongUploadSuccess(false);
					setSongUploadError(true);
					setSongUploadMessage(result.error);
				}
			})

            const body = { ...values };
			body.file = file.data.name;
            console.log(JSON.stringify(body));
            console.log('---- end of body to be submitted ----');
            let newSong = {};
            const response = await fetch("http://localhost:5000/songs/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then(result => {
                    if(result.id){
                        console.log('add user result: ');
                        console.log(result);
                        newSong = result;
                    }
                });

            // console.log(response.json();

            setSongs(newSong.id ? [...songs, newSong] : songs);
            setDisplayedSongs(newSong.id ? [...songs, newSong] : songs);

			if (newSong.id){
				setEditDataMessageError(false);
				setDisplayEditDataMessage(true);
			}
			else {
				setEditDataMessageError(true);
				setDisplayEditDataMessage(true);
			}

            // window.location = '/';
        }
        catch (error) {
            console.error(error.message);
        }
    }

    if(!show) return null;

	if(isAuthenticated){
		return (
			<Fragment>
				<Formik
					// innerRef={formik} // Add a ref to the formik object
					initialValues={{
						name: name,
						artists: artists,
						genres: genres,
						file: file
					}}
					validationSchema={UpdateSchema}
					// onSubmit={onSubmitUser}
					onSubmit={(values) => {
						// same shape as initial values
						// setFieldValue('address', address);
						console.log('submit form!');
						console.log(values);
						onSubmitSong(values);
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
									<p className='font-bold text-center my-2'>Datos de la cancion</p>
									<div className='flex flex-col py-2'>
										<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
											Nombre
										</label>
										<Field
											name="name"
											placeholder="ej: Welcome to the Jungle"
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
											Artista
										</label>
										<Select
											// defaultValue={}
											// onChange={ }
											placeholder={'Artistas'}
											options={optionsArtists}
											maxMenuHeight={240}
											className='rounded-md w-full'
											isMulti={true}
											isSearchable={true}
											onChange={(values) => {
												setFieldValue('artists', values);
												console.log(values);
											}}
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
										{/* {errors.artists && touched.artists ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.artists}
											</div>
										) : null} */}
									</div>
									<div className='flex flex-col py-2'>
										<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
											Generos
										</label>
										<Select
											// defaultValue={}
											// onChange={ }
											placeholder={'Generos'}
											options={optionsGenres}
											maxMenuHeight={240}
											className='rounded-md w-full'
											isMulti={true}
											isSearchable={true}
											onChange={(values) => {
												setFieldValue('genres', values);
												console.log(values);
											}}
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
									<div className='flex flex-col py-2'>
										<label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
											Archivo musica
										</label>

										<div className='relative'>
											<input
												type='file'
												name='file'
												id='file'
												onChange={ (e) => {
													handleFileChange(e);
													setFieldValue('file changed', e.target.value);
													console.log(e.target)
												}}
												placeholder='Elija el archivo'
												className='z-50 opacity-90 focus:outline-none w-full h-full'>	
											</input>
										</div>
										{songUploadError && (
											<div className='bg-red-500 mx-5 p-2 rounded-lg'>
												<p className='text-center text-white font-medium'>{songUploadMessage}</p>
											</div>
										)}
										{songUploadSuccess && (
											<div className='p-2 rounded-lg mt-3'>
												<p className='text-left text-green-500 font-medium'>{songUploadMessage}</p>
											</div>
										)}
										{/* { file.data && (
											<button className='bg-gray-800 text-white py-3 px-10 font-medium text-sm' type='submit'>Guardar cancion</button>
										)} */}
									</div>
									
									<button 
										type="submit"
										className="w-full text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-12"
									>
										Guardar cancion
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
										<p className='text-white text-center font-medium'>No se ha podido crear la cancion.</p>
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
										<p className='text-white text-center font-medium'>Cancion creada con éxito</p>
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
	else {
		navigate('/');
	}
}

export default AddCancion;