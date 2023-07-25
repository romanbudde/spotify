import React, { Fragment, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';

const Home = () => {
	
	const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
	const { userId, setUserId } = useContext(AuthContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [credentialsErrorMessage, setCredentialsErrorMessage] = useState(false);
	const navigate = useNavigate();
	const cookies = new Cookies();
  
    const loginUser = async (e) => {
		console.log('----------------- onLoginUser -------------- ');
		e.preventDefault();
		try {
			const body = {email, password};
			console.log(JSON.stringify(body));
			console.log('---- end of body to be submitted ----');
			const response = await fetch("https://spotify-server-v0hq.onrender.com/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			})
				.then(response => {
					console.log(response);
					if(!response.ok) {
						// console.log('CREDENTIALS ERROR');
						setCredentialsErrorMessage(true);
					}

					return response.json();
				})
				.then(result => {
					console.log('there is a result: ');
					console.log(result);
					if(result){
						console.log('login returns the token: ');
						console.log(result);

						// set the cookie
						cookies.set('auth-token', result.auth_token, { path: '/' });
						
						// set global context for isAuthenticated to true.
						setIsAuthenticated(true);
						
						// set global context for userId
						cookies.set('user-id', result.user_id, { path: '/' });
						setUserId(result.user_id);

						// redirect a landing de user o de cuidadores o de admin segun el tipo de usuario.
						console.log('user type: ', result.user_type);

						switch(result.user_type){
							case 0: 
								navigate('/landing');
								break;
							case 1: 
								navigate('/landing-cuidador');
								break;
							case 2: 
								navigate('/landing-admin');
								break;
						}
					}
				});

			// console.log(response.json());
			
			// setUsers(newUser.id ? [...users, newUser] : users);
			// window.location = '/';
		}
		catch (error) {
			console.error(error);
			// console.error (error.message);
		}
    };

	return (
		<Fragment>
		<form className="min-w-70 rounded-md bg-black">
			<div className='flex flex-row items-center w-full justify-left pl-16 relative border-b-2 border-b-gray-800 bg-black'>
				<h1 className='flex justify-center font-bold text-2xl py-4 text-green-400'>Trackify</h1>
			</div>
			<div className='w-full h-screen bg-gradient-to-b from-gray-900 to-black'>
				<div className='flex flex-row justify-center'>
					<div className='space-y-2 py-14 px-28 max-w-lg mt-7 flex flex-col justify-center items-center bg-black rounded-md'>
						<div className='w-full pb-4'>
							<h1 className='text-left font-medium text-3xl mb-2 text-white'>Bienvenido!</h1>
							<h4 className='text-left font-semibold mb-16 text-white'>Inicia sesión con tu cuenta</h4>
							<label
								className={`${ credentialsErrorMessage ? 'block mb-1 mr-auto text-sm font-medium text-red-500 dark:text-white' : 'block mb-1 mr-auto text-sm font-medium text-white dark:text-white'}`}
								>
								Email
							</label>
							<input
								type="email"
								name="email"
								className={`${ credentialsErrorMessage ? 'bg-red-500 border text-gray-900 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-sm border-b border-red-500 border-solid border-opacity-100 focus:outline-none focus:outline-0 placeholder-red-500' : 'bg-gray-50 border text-white text-sm focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5 bg-transparent rounded-sm border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'} shadow-md`}
								placeholder="youremail@email.com"
								value={email}
								onChange={e => setEmail(e.target.value)}
								/>
						</div>
				
						<div className='w-full'>
							<label
								className={`${ credentialsErrorMessage ? 'block mb-1 mr-auto text-sm font-medium text-red-500 dark:text-white' : 'block mb-1 mr-auto text-sm font-medium text-white dark:text-white'}`}
								>
								Password
							</label>
							<input
								type="password"
								name="password"
								className={`${ credentialsErrorMessage ? 'bg-red-500 border text-white text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-sm border-b border-red-500 border-solid border-opacity-100 focus:outline-none focus:outline-0 placeholder-red-500' : 'bg-gray-50 border text-white text-sm focus:ring-gray-300 focus:border-gray-300 block w-full p-2.5 bg-transparent rounded-sm border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'} shadow-md`}
								value={password}
								placeholder="•••••••••"
								onChange={e => setPassword(e.target.value)}
							/>
						</div>
						<a className="text-white ml-auto font-bold text-md pb-2 hover:text-green-400 hover:underline" href="">
							Olvidaste tu contraseña?
						</a>
						{ credentialsErrorMessage && (
							<p className='w-full text-left text-red-500'>
								Email o contraseña incorrectos.
							</p>
						)}
						<button 
							type="submit"
							className="w-full text-black bg-green-400 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md  px-5 py-2.5 text-center"
							onClick={ (e) => { loginUser(e) }}
							>
							Iniciar sesión
						</button>
						<div className="flex flex-row w-full justify-center gap-2 text-white">
							<p>No tienes una cuenta?</p>
							<a className="font-bold hover:text-green-400 hover:underline" href="/register">Crear cuenta</a>
						</div>
					</div>
				</div>
			</div>
		</form>
	
		</Fragment>
	)
}

export default Home;