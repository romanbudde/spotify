import React, { Fragment, useEffect, useState } from 'react';
import AddUser from './AddUser';
import User from './User';
import EditUser from './EditUser';

import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const ListUsers = () => {
	const { isAuthenticated } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
	const navigate = useNavigate();
	const cookies = new Cookies();

	console.log("isAuthenticated: ", isAuthenticated);

    const handleAddUserModalOpen = () => {
        setShowAddUserModal(true);
    }
    const handleAddUserModalClose = () => {
        setShowAddUserModal(false); 
    }

	const logout = () => {
		// unset cookie
		cookies.remove('auth-token');
		
		navigate('/');
	}

    // delete user function
    const disableUser = async (id) => {
        try {
            let disabledUser = {};
            const disableUser = await fetch(`http://localhost:5000/cuidadores/${id}`, {
                method: "DELETE"
            })
                .then(response => response.json());

            console.log('disableUser: ');
            console.log(disableUser.rowCount);

            if(disableUser.rowCount > 0) {
                setUsers(users.map((user) => user.id === id ? { ...user, enabled:false } : user));
            }

        } catch (error) {
            console.error(error);
        }
    }

    // enable user function
    const enableUser = async (id, user) => {
        try {
            let bodyJSON = { 
                description: user.description, 
                email: user.mail, 
                firstname: user.name, 
                lastname: user.last_name, 
                userType: user.type, 
                enabled: true 
            };
            const enabledUser = await fetch(
                `http://localhost:5000/cuidadores/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bodyJSON)
                }
            )
                .then(response => response.json());

            console.log('enabledUser: ');
            console.log(enabledUser.id);

            if(enabledUser.id) {
                setUsers(users.map((user) => user.id === id ? { ...user, enabled:true } : user));
            }

        } catch (error) {
            console.error(error);
        }
    }

    // get all users function
    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/cuidadores/");
            const jsonData = await response.json();

            setUsers(jsonData);

        } catch (error) {
            console.error(error.message);
        }
    };

    // when page loads, get all Users
    useEffect(() => {
        getUsers();
    }, []);

	if(isAuthenticated){
		return (
			<Fragment>
				<AddUser 
					users={users}
					setUsers={setUsers}
					show={showAddUserModal}
					onClose={handleAddUserModalClose}
				/>
				<h1 className='mt-10 text-3xl text-center'>Users list</h1>
				<button
					className='ml-10 bg-transparent hover:bg-blue-500 text-green-500 font-semibold hover:text-white py-2 px-4 border border-green-600 hover:border-transparent rounded'
					onClick={handleAddUserModalOpen}
				>
					Add new user
				</button>
				<button
					className='ml-10 bg-transparent text-black font-semibold py-2 px-4'
					onClick={logout}
				>
					Logout
				</button>
                {users.map( user => (

                    <User 
                        user={user}
                        users={users}
                        setUsers={setUsers}
                        disableUser = {disableUser}
                        enableUser = {enableUser}
                        key={user.id}
                    />
                    
                ))}
			</Fragment>
		);
	}
	else {
		navigate('/');
	}
}

export default ListUsers;