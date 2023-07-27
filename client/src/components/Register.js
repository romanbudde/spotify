import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Register = () => {

	const cookies = new Cookies();
	const navigate = useNavigate();
	const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
	const { userId, setUserId } = useContext(AuthContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');

	const redirectHome = () => {
		navigate('/');
	}

	const SignupSchema = Yup.object().shape({
		firstname: Yup.string()
			.min(2, 'El nombre es demasiado corto!')
			.max(50, 'El nombre es demasiado largo!')
			.required('Campo requerido!'),
		lastname: Yup.string()
			.min(2, 'El apellido es demasiado corto!')
			.max(50, 'El apellido es demasiado largo!')
			.required('Campo requerido!'),
		password: Yup.string()
			.min(8, 'La contraseña debe ser mayor a 8 caracteres de largo!')
			.max(50, 'La contraseña es demasiado larga')
			.matches(/^[a-zA-Z0-9]{8,}$/, 'La contraseña tiene que contener solamente números y/o letras!.')
			.required('Campo requerido!'),
		email: Yup.string().email('Email inválido').required('Campo requerido!'),
	});

	const onSubmitUser = async (values) => {
		console.log('----------------- on function onSubmitUser -------------- ');

		// e.preventDefault();
		try {
			const body = { ...values };

			console.log(JSON.stringify(body));
			console.log('---- end of body to be submitted ----');
			let newUser = {};
			const response = await fetch("http://localhost:5000/register/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			})
				.then(response => response.json())
				.then(result => {
					console.log('register user result: ');
					console.log(result);
					if (result.user.id) {
						console.log(result);
						newUser = result.user;

						// set the cookie
						cookies.set('auth-token', result.token, { path: '/' });

						// set global context for isAuthenticated to true.
						setIsAuthenticated(true);

						// set global context for userId
						cookies.set('user-id', newUser.id, { path: '/' });
						setUserId(newUser.id);

						// redirect a landing de user o de cuidadores o de admin segun el tipo de usuario.
						console.log('user type: ', newUser.type);

						switch (newUser.type) {
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

		}
		catch (error) {
			console.error(error.message);
		}
	}

	return (
		<Fragment>
			{/* <form className="min-w-70 w-96 rounded-md"> */}
			<Formik
				// innerRef={formik} // Add a ref to the formik object
				initialValues={{
					firstname: '',
					lastname: '',
					password: '',
					email: '',
				}}
				validationSchema={SignupSchema}
				// onSubmit={onSubmitUser}
				onSubmit={(values) => {
					// same shape as initial values
					console.log(values);
					onSubmitUser(values);
				}}
			>
				{({ errors, touched, setFieldValue, setFieldError }) => (
					<Form>
						<div className='relative'>

							<div className='relative '>
								<div className='w-full flex flex-row items-center justify-center relative border-b-2 border-b-gray-200'>
									<FontAwesomeIcon
										className='absolute cursor-pointer left-5'
										icon={faChevronLeft}
										onClick={redirectHome}
									/>
									<h1 className='flex justify-center font-bold text-2xl py-4 mx-auto'>Trackify</h1>
								</div>
								<div className='h-screen bg-gradient-to-b from-white to-gray-300 pt-10'>
									<div className='max-w-2xl mx-auto flex flex-col justify-center items-center gap-3'>
										<label className="block mr-auto text-sm font-semibold text-gray-900">
											Nombre
										</label>
										<Field
											name="firstname"
											placeholder="ej: Pedro"
											className={`${errors.firstname && touched.firstname ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
												'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}
										/>
										{errors.firstname && touched.firstname ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.firstname}
											</div>
										) : null}
										<label className="block mr-auto text-sm font-semibold text-gray-900 dark:text-white">
											Apellido
										</label>
										<Field name="lastname" placeholder="ej: Gomez" className={`${errors.lastname && touched.lastname ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
											'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
										{errors.lastname && touched.lastname ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.lastname}
											</div>
										) : null}
										<label className="block mr-auto text-sm font-semibold text-gray-900 dark:text-white">
											Email
										</label>
										<Field name="email" type="email" placeholder="ej: pedrogomez@hotmail.com" className={`${errors.email && touched.email ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
											'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
										{errors.email && touched.email ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.email}
											</div>
										) : null}
										<label className="block mr-auto text-sm font-semibold text-gray-900 dark:text-white">
											Contraseña
										</label>
										<Field name="password" type="password" placeholder="••••••" className={`${errors.password && touched.password ? 'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' :
											'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} />
										{errors.password && touched.password ? (
											<div className='text-red-500 font-normal w-full text-sm text-left'>
												{errors.password}
											</div>
										) : null}
										<button
											type="submit"
											className="bg-green-400 mt-5 py-3 px-7 rounded-full font-semibold text-black border border-transparent hover:scale-105 hover:border-black"
										>
											Crear cuenta
										</button>
									</div>
								</div>
							</div>
						</div>
					</Form>
				)}
			</Formik>

		</Fragment>

	)
}

export default Register;