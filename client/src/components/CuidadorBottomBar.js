import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import UserEditData from './UserEditData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse } from '@fortawesome/free-solid-svg-icons';

const BottomBar = (userType) => {
	const { isAuthenticated } = useContext(AuthContext);
	const { userId } = useContext(AuthContext);
    
	const navigate = useNavigate();
	const cookies = new Cookies();

	const redirectLanding = () => {
		navigate('/landing-cuidador');
	}

	if(isAuthenticated){
		return (
			<Fragment>
				<div className='fixed z-50 bg-white bottom-0 py-5 w-full flex flex-row justify-center items-center border-t-1 shadow-[0_30px_50px_-9px_rgba(0,0,0,1)]'>
					<div
						className='flex flex-col justify-center items-center'
						onClick={ redirectLanding }
					>
						<FontAwesomeIcon className='text-2xl' icon={faHouse} />
						{/* <FontAwesomeIcon className='text-2xl' icon={heartSolido} /> */}
						<p className='text-sm font-medium'>
							Inicio
						</p>
					</div>
				</div>
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default BottomBar;