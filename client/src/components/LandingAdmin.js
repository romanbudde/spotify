import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faRecordVinyl, faIcons } from '@fortawesome/free-solid-svg-icons';
import {BsHeadphones} from 'react-icons/bs';

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
				<div className='relative h-screen bg-gradient-to-b from-gray-400 to-gray-100'>
					<div className='flex flex-row items-center w-full justify-left pl-16 relative border-b-2 border-b-gray-800 shadow-lg bg-black'>
						<h1 className='flex justify-center font-bold text-2xl py-4 text-green-400'>Trackify</h1>
						<p className='text-md text-gray-500 ml-3'>Panel de Administrador</p>
						<div className='ml-auto flex flex-row items-center gap-16 mr-5'>
							<p
								className='text-white ml-auto font-medium text-sm cursor-pointer hover:underline hover:scale-105'
								onClick={ (e) => { redirectProfile(e) }}
							>
								Mi perfil
							</p>
							<p
								className='ml-auto mr-5 cursor-pointer hover:underline font-medium text-sm text-gray-400'
								onClick={() => logout()}
							>
								Cerrar sesión
							</p>
						</div>
					</div>
					<div className='gap-5 my-10 mx-auto w-1/2 grid grid-cols-2 grid-rows-2'>
						<button
							className='h-52 flex flex-col gap-5 items-center justify-center w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center'
							onClick={ (e) => { redirectCanciones(e) }}
						>
							<BsHeadphones className='text-8xl'></BsHeadphones>
							<p className='font-bold text-xl text-white'>Canciones</p>
						</button>
						<button
							className='h-52 flex flex-col gap-5 items-center justify-center w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center'
							onClick={ (e) => { redirectArtistas(e) }}
						>
							<FontAwesomeIcon className='text-8xl' icon={faRecordVinyl} />
							<p className='font-bold text-xl text-white'>Artistas</p>
						</button>
						<button
							className='h-52 flex flex-col gap-5 items-center justify-center w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center'
							onClick={ (e) => { redirectGeneros(e) }}
						>
							<FontAwesomeIcon className='text-8xl' icon={faIcons} />
							<p className='font-bold text-xl text-white'>Géneros</p>
						</button>
						<button
							className='h-52 flex flex-col gap-5 items-center justify-center w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center'
							onClick={ (e) => { redirectUsuarios(e) }}
						>
							<FontAwesomeIcon className='text-8xl' icon={faUserGroup} />
							<p className='font-bold text-xl text-white'>Usuarios</p>
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