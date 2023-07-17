import React, { Fragment, useEffect, useState } from 'react';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const EditUser = ({ user, show, onClose, users, setUsers, displayedUsers, setDisplayedUsers }) => {

    const [description, setDescription] = useState(user.description);
    const [email, setEmail] = useState(user.mail);
    const [firstname, setFirstname] = useState(user.name);
    const [lastname, setLastname] = useState(user.last_name);
    const [userType, setUserType] = useState(user.type);
	const navigate = useNavigate();
	const cookies = new Cookies();

    if(!show) return null;

    const updateUser = async (e) => {
        // console.log(description);

		const authToken = cookies.get('auth-token');
		if(!authToken) {
			return navigate('/');
		}

        e.preventDefault();
        try {
            const bodyJSON = { 
                description,
                email,
                firstname,
                lastname,
                userType,
                enabled: user.enabled
            };
            const id = user.id;
            const userUpdate = await fetch(
                `http://localhost:5000/cuidadores/${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            )
                .then(response => response.json())

            console.log('update response:');
            console.log(userUpdate);
            
            let updatedUser = {
                description: description,
                mail: email,
                name: firstname,
                last_name: lastname,
                type: userType,
                created_at: userUpdate.created_at, 
                modified_at: userUpdate.modified_at,
                enabled: userUpdate.enabled, 
                id: id
            }
            
            console.log('updatedUser:');
            console.log(updatedUser);
            console.log('user.id === id? :');
            console.log(user.id === id ? 'true' : 'false');


            setUsers(users.map((user) => user.id === id ? updatedUser : user));
            setDisplayedUsers(users.map((user) => user.id === id ? updatedUser : user));
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Fragment>
            <div className='fixed inset-0 bg-gray-800 bg-opacity-40 z-50 flex justify-center items-center'>
                <div className='flex flex-col relative'>
                    <button onClick={ onClose } type="button" className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className='bg-white p-5 rounded flex flex-col gap-5'>
                        <div className="flex items-start justify-between border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Edit user
                            </h3>
                            
                        </div>
                        <form className="space-y-6">
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    User ID (non editable)
                                </label>
                                <input
                                    type="text"
                                    name="id"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={user.id}
                                    disabled
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email ? email : ''}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <input 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={description ? description : ''}
                                    onChange={e => setDescription(e.target.value)}
                                    name="description" 
                                    placeholder="The user's description"
                                    required/>
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    User type
                                </label>
                                <select 
                                    id="user_type"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={e => setUserType(e.target.value)}
                                >
                                    <option defaultValue={userType}>Tipo de usuario</option>
                                    <option value="0">Cliente</option>
                                    <option value="1">Cuidador</option>
                                    <option value="2">Admin</option>
                                </select>
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={firstname ? firstname : ''}
                                    onChange={e => setFirstname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className="block mb-2 mr-auto text-sm font-medium text-gray-900 dark:text-white">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                    value={lastname ? lastname : ''}
                                    onChange={e => setLastname(e.target.value)}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={(e) => { 
                                    updateUser(e);
                                    onClose();
                                }}
                            >
                                Save user
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default EditUser;