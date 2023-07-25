import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import UserEditData from './UserEditData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faComment, faEnvelope, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import CuidadorBottomBar from './CuidadorBottomBar';

const Account = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	console.log('--------- ENV variable - PROD SERVER: ', process.env.PROD_SERVER)
	console.log('--------- ENV variable - PROD SERVER: ', process.env.REACT_APP_PROD_SERVER)

	const [user, setUser] = useState('');
	const [userTypes, setUserTypes] = useState([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [image, setImage] = useState({ preview: '', data: '' });
	const [imageUploadError, setImageUploadError] = useState(false);
	const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
	const [imageUploadMessage, setImageUploadMessage] = useState('');
	const [status, setStatus] = useState('');
	
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
		const response = await fetch(process.env.PROD_SERVER ? `${process.env.PROD_SERVER}/users/${userId}` : "http://localhost:5000/users/" + userId);
		const jsonData = await response.json();

		console.log('---- inside getUserData ----');
		console.log(jsonData);

		setUser(jsonData);
	}

	// get all users function
    const getUserTypes = async () => {
        try {
            const response = await fetch(process.env.PROD_SERVER ? `${process.env.PROD_SERVER}/user_types/` :"http://localhost:5000/user_types/");
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
					<div className='relative h-screen bg-gradient-to-b from-gray-100 to-gray-300 w-full flex flex-col items-center px-5 space-y-3'>
						<h1 className='font-medium text-lg flex flex-row items-center gap-1'>Hola, <p className='p-1 px-2 bg-green-300 rounded-md'>{user.name}!</p>
						</h1>

						<UserEditData
							user={user}
							setUser={setUser}
							show={showEditModal}
							userTypes={userTypes}
							onClose={handleClose}
						/>
						<div className='flex flex-col text-left space-y-4'>
							<div className='flex flex-row gap-3 items-center'>
								<FontAwesomeIcon className='text-2xl' icon={faEnvelope} />
								<p>Tu email actual es {user.mail}</p>
							</div>
							<div className='flex flex-row gap-3 items-center'>
								<FontAwesomeIcon className='text-2xl' icon={faComment} />
								<p>Tu descripción es: {user.description}</p>
							</div>
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