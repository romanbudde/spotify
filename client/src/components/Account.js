import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import UserEditData from './UserEditData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import CuidadorBottomBar from './CuidadorBottomBar';

const Account = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const [user, setUser] = useState('');
	const [userTypes, setUserTypes] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [image, setImage] = useState({ preview: '', data: '' });
	const [imageUploadError, setImageUploadError] = useState(false);
	const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
	const [imageUploadMessage, setImageUploadMessage] = useState('');
	const [status, setStatus] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault()
		let formData = new FormData()
		formData.append('file', image.data)
		formData.append('user_id', userId)
		const response = await fetch('http://localhost:5000/upload_image', {
		  method: 'POST',
		  body: formData,
		}).then(response => response.json())
		.then(result => {
			if (!result.error){
				console.log('------- no hay error al subir la imagen');
				setStatus(result.statusText);
				setImageUploadError(false);
				setImageUploadSuccess(true);
				setImageUploadMessage('Foto de perfil actualizada!');
			}
			else {
				console.log('------- hubo un error al subir la imagen');
				setImageUploadSuccess(false);
				setImageUploadError(true);
				setImageUploadMessage(result.error);
			}
		})
	}
	
	const handleFileChange = (e) => {
		const img = {
		  preview: URL.createObjectURL(e.target.files[0]),
		  data: e.target.files[0],
		}
		setImage(img)
	}
    
    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);
	console.log("userId: ", userId);

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

	const getUserData = async () => {
		const response = await fetch("http://localhost:5000/users/" + userId);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

	// get all users function
    const getUserTypes = async () => {
        try {
            const response = await fetch("http://localhost:5000/user_types/");
            const jsonData = await response.json();

			console.log('---- inside getUserTypes ----');
			console.log(jsonData);

			setUserTypes(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    };

	useEffect(() => {
        getUserData();

		getUserTypes();
    }, []);

	console.log('image.preview: ', image.preview)

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='space-y-5 flex flex-col justify-center items-center rounded-md bg-slate-200z'>
					<div className='flex flex-row items-center justify-center relative border-b-2 border-b-gray-200 w-full'>
						<FontAwesomeIcon
							className='absolute left-5'
							icon={faChevronLeft}
							onClick={ redirectLanding }
						/>
						<h1 className='flex justify-center font-bold text-lg py-4'>Mi perfil</h1>
						<FontAwesomeIcon icon={faPenToSquare} className='text-2xl absolute right-5' onClick={handleShow} />
					</div>
					{ user.type === 1 && (
						<CuidadorBottomBar/>
					)}
					{ user.type === 0 && (
						<ClientBottomBar/>
					)}
					<div className='w-full flex flex-col items-center px-5 space-y-3'>
						<h1 className='font-medium text-lg'>Hola, {user.name}!</h1>

						<form onSubmit={handleSubmit} className='flex flex-col gap-3 items-center justify-center'>
							<div className='relative'>
								<input type='file' name='file' id='file' onChange={handleFileChange} className='z-50 absolute opacity-0 focus:outline-none w-full h-full'></input>
								{image.preview ? (
									<img src={image.preview} className='rounded-full border-2 border-gray-200' width='125' height='100' />
								) : (
									user.profile_picture_url !== '' ? (
										<img src={`http://localhost:5000/${user.profile_picture_url}`} alt='Profile pic' className='rounded-full border-2 border-gray-200' width='125' height='100' />
									) : (
										<img src={`http://localhost:5000/no_picture.jpg`} alt='Profile pic' className='rounded-full border-2 border-gray-200' width='125' height='100' />
									)
								)}
								<FontAwesomeIcon icon={faCirclePlus} className='absolute right-2 bottom-1 text-3xl bg-white rounded-full'/>
							</div>
							{ image.preview && (
								<button className='bg-gray-800 text-white py-3 px-10 font-medium text-sm' type='submit'>Guardar foto</button>
							)}
						</form>
						{imageUploadError && (
							<div className='bg-red-500 mx-5 p-2 rounded-lg'>
								<p className='text-center text-white font-medium'>{imageUploadMessage}</p>
							</div>
						)}
						{imageUploadSuccess && (
							<div className='bg-green-500 w-full mx-5 p-2 rounded-lg'>
								<p className='text-center text-white font-medium'>{imageUploadMessage}</p>
							</div>
						)}

						<UserEditData
							user={user}
							setUser={setUser}
							show={showEditModal}
							userTypes={userTypes}
							onClose={handleClose}
						/>
						<div className='flex flex-col text-left space-y-4'>
							<p>Tu mail actual es {user.mail}</p>
							<p>Tu descripcion es: {user.description}</p>
							<p>Tu dirección es: {user.address}</p>
							{ user.type === 1 && (
								<>
									<p>Tarifa por media hora: {user.hourly_rate}</p>
									<p>Puntaje promedio segun las reseñas: {user.average_review_score}</p>
								</>
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

export default Account;