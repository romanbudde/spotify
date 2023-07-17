import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import UserEditData from './UserEditData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import ClientBottomBar from './ClientBottomBar';
import CuidadorBottomBar from './CuidadorBottomBar';

const Failure = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);

	const [user, setUser] = useState('');
	const [userTypes, setUserTypes] = useState([]);

	const [showEditModal, setShowEditModal] = useState(false);
    
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
		const response = await fetch("http://localhost:5000/cuidadores/" + userId);
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
					</div>
					{ user.type === 1 && (
						<CuidadorBottomBar/>
					)}
					{ user.type === 1 && (
						<ClientBottomBar/>
					)}
					<div className='w-full flex flex-col items-center px-5 space-y-3'>
						<h1>Lo sentimos, ha habido un error en la acreditación del pago.</h1>
					</div>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default Failure;