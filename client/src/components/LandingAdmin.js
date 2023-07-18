import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse } from '@fortawesome/free-solid-svg-icons';
import CuidadorBottomBar from './CuidadorBottomBar';

const LandingAdmin = () => {
	const { isAuthenticated } = useContext(AuthContext);
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

	const redirectProfile = () => {
		navigate('/account');
	}
	
	const redirectUsuarios = () => {
		navigate('/users');
	}

	const redirectCanciones = () => {
		navigate('/canciones-admin');
	}

	const redirectArtistas = () => {
		navigate('/artistas-admin');
	}

	const redirectGeneros = () => {
		navigate('/generos-admin');
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='relative h bg-black'>
					<CuidadorBottomBar />
					<div className='flex flex-row items-center w-full justify-left pl-16 relative border-b-2 border-b-gray-800 bg-black'>
						<h1 className='flex justify-center font-bold text-2xl py-4 text-green-400'>Trackify</h1>
						<p className='text-md text-gray-500 ml-3'>Panel de Administrador</p>
					</div>
					<div className='space-y-5 p-7 my-2 mx-auto w-1/2 flex flex-col justify-center items-center bg-black'>
						<button
							className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectCanciones(e) }}
						>
							Canciones
						</button>
						<button
							className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectArtistas(e) }}
						>
							Artistas
						</button>
						<button
							className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectGeneros(e) }}
						>
							Generos
						</button>
						<button
							className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectUsuarios(e) }}
						>
							Usuarios
						</button>
						<button
							className='w-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={ (e) => { redirectProfile(e) }}
						>
							Mi perfil
						</button>
					</div>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default LandingAdmin;