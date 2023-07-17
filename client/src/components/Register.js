import React, { Fragment, useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { AuthProvider, AuthContext } from './AuthContext';
// import { Autocomplete } from '@lob/react-address-autocomplete';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import Autocomplete from "react-google-autocomplete";
import '../css/autocomplete.css';


const Register = () => {

  const cookies = new Cookies();
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { userId, setUserId } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');

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
	  email: Yup.string().email('Invalid email').required('Campo requerido!'),
	  address: Yup.string()
	  .min(4, 'Dirección demasiado corta!')
	  .max(100, 'La dirección es demasiado larga')
	  .matches(/^.*\b\w+\b.*\d.*,.*/, 'La dirección no posee altura de la calle.')
	  .required('Campo requerido!'),
  });

  const onSubmitUser = async (values) => {
    console.log('----------------- on function onSubmitUser -------------- ');

    // e.preventDefault();
    try {
        const body = {...values};

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
                if(result.user.id){
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

                    switch(newUser.type){
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
        console.error (error.message);
    }
  } 

//   const formik = useFormik({
//     initialValues: {
//       firstname: '',
//       lastname: '',
//       password: '',
//       address: '', // Initialize the 'address' field
//       email: '',
//     },
//     validationSchema: SignupSchema,
//     onSubmit: onSubmitUser,
//   });

  return (
    <Fragment>
      {/* <form className="min-w-70 w-96 rounded-md"> */}
	  <Formik
        // innerRef={formik} // Add a ref to the formik object
      initialValues={{
        firstname: '',
        lastname: '',
        password: '',
        address: '',
        email: '',
      }}
      validationSchema={SignupSchema}
      // onSubmit={onSubmitUser}
      onSubmit={(values) => {
        // same shape as initial values
        // setFieldValue('address', address);
        console.log(values);
        onSubmitUser(values);
      }}
    >
		{({ errors, touched, setFieldValue, setFieldError }) => (
			<Form>
				<div className='gap-2 px-10 py-5 mx-auto flex flex-col justify-center items-center'>
					<div className='flex flex-row items-center w-full justify-center relative border-b-2 border-b-gray-200'>
						<h1 className='flex justify-center font-bold text-lg py-4'>Cuidar</h1>
					</div>
					<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
						Nombre
					</label>
					<Field
						name="firstname"
						placeholder="ej: Pedro"
						className={`${errors.firstname && touched.firstname ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
						'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`} 
					/>
						{errors.firstname && touched.firstname ? (
							<div className='text-red-500 font-normal w-full text-sm text-left'>
								{errors.firstname}
							</div>
						) : null}
					<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
						Apellido
					</label>
					<Field name="lastname" placeholder="ej: Gomez" className={`${errors.lastname && touched.lastname ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
					'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
						{errors.lastname && touched.lastname ? (
							<div className='text-red-500 font-normal w-full text-sm text-left'>
								{errors.lastname}
							</div>
						) : null}
					<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
						Email
					</label>
					<Field name="email" type="email" placeholder="ej: pedrogomez@hotmail.com" className={`${errors.email && touched.email ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
					'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
						{errors.email && touched.email ? (
							<div className='text-red-500 font-normal w-full text-sm text-left'>
								{errors.email}
							</div>
						) : null}
					<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
						Contraseña
					</label>
					<Field name="password" type="password" placeholder="••••••" className={`${errors.password && touched.password ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
					'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}/>
						{errors.password && touched.password ? (
							<div className='text-red-500 font-normal w-full text-sm text-left'>
								{errors.password}
							</div>
						) : null}
					<label className="block mr-auto text-sm font-medium text-gray-900 dark:text-white">
						Dirección
					</label>
					<Autocomplete
						apiKey={'AIzaSyDdEqsnFUhTgQJmNN1t4iyn3VhMLJY6Yk4'}
						debounce={1000}
						name='address'
						placeholder='Escriba su dirección'
						className={`${errors.address && touched.address ?  'bg-gray-50 border text-red-500 placeholder-red-500 text-sm focus:ring-red-500 focus:border-red-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-solid border-opacity-100 focus:outline-none focus:outline-0 border-red-500' : 
						'bg-gray-50 border text-gray-900 text-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 bg-transparent rounded-lg border-b border-gray-400 border-solid border-opacity-100 focus:outline-none focus:outline-0'}`}
						style={{ width: "100%" }}
						// onPlaceSelected={(place) => {
						// 	console.log(place);
						// 	console.log('formated address: ', place.formatted_address);
						// 	setAddress(place.formatted_address);
						// }}
						onChange={(e) => {
							setFieldValue('address', e.target.value);
							// setFieldError('address', 'Selecciona una direccion del menu desplegable!');
							console.log(e.target.value)
						}}
						onPlaceSelected={(place) => {
							console.log(place);
							console.log('formated address: ', place.formatted_address);
							setFieldValue('address', place.formatted_address);
						}}
						options={{
							types: ["address"],
							componentRestrictions: { country: "ar" },
						}}
						defaultValue=""
					/>
					{errors.address && touched.address ? (
						<div className='text-red-500 font-normal w-full text-sm text-left'>
							{errors.address}
						</div>
					) : null}
					<button 
						type="submit"
						className="w-full text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-12"
					>
						Crear cuenta
					</button>
				</div>
			</Form>
        )}
	  </Formik>

    </Fragment>
    
  )
}

export default Register;