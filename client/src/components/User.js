import React, { Fragment, useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import moment from 'moment';
import EditUser from './EditUser';
import UserEditData from './UserEditData';

const User = ({ user, users, setUsers, displayedUsers, setDisplayedUsers, disableUser, enableUser }) => {

    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

    // useEffect(() => {
    //     handleClose()
    // }, [user])

    return (
        <>
            <div
                className={`${user.enabled ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : 'bg-gradient-to-r from-red-500 to-red-400'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium relative`}
                // key={user.id}
            >
                <div className='flex flex-row w-full justify-between'>
                    <div className={`${user.enabled ? 'bg-green-700 ' : 'bg-red-700'} flex flex-row items-center gap-3 p-2 mb-3 rounded-lg shadow-md`}>
                        { user.enabled ? (
                            <FontAwesomeIcon icon={faCheck} className=''/>
                        ) : (
                            <FontAwesomeIcon icon={faCircleXmark} className=''/>
                        )}
                        <p>{user.enabled ? 'Activado' : 'Desactivado'}</p>
                    </div>
                    <div
                        className='bg-gray-700 flex flex-row items-center gap-3 p-2 mb-3 rounded-lg shadow-md'
                        onClick={handleShow}
                    >
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className=''
                        />
                        <p>Editar datos</p>
                    </div>
                    <EditUser
                        user={user}
                        users={users}
                        setUsers={setUsers}
                        displayedUsers={displayedUsers}
                        setDisplayedUsers={setDisplayedUsers}
                        show={showEditModal}
                        onClose={handleClose}
                    />
                    {/* <UserEditData
                        user={user}
                        users={users}
                        setUsers={setUsers}
                        displayedUsers={displayedUsers}
                        setDisplayedUsers={setDisplayedUsers}
                        show={showEditModal}
                        onClose={handleClose}
                    /> */}
                </div>
                <p>ID: {user.id}</p>
                <p>Email: {user.mail}</p>
                <p>Nombre: {user.name}</p>
                <p>Apellido: {user.last_name}</p>
                <p>Dirección: {user.address}</p>
                <p>Fecha de creación: {moment(user.created_at).format('DD/MM/YYYY')}</p>
            </div>

            {/* <tr key={user.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                <td className='p-2'>{user.id}</td>
                <td className='p-2'>{user.description}</td>
                <td className='p-2'>{user.name}</td>
                <td className='p-2'>{user.last_name}</td>
                <td className='p-2'>{user.mail}</td>
                <td className='p-2'>{user.type}</td>
                <td className='p-2'>{user.created_at}</td>
                <td className='p-2'>{user.modified_at}</td>
                { user.enabled ? (
                    <td className='p-2 font-semibold text-green-500'>Enabled</td>
                    ) : (
                    <td className='p-2 font-semibold text-orange-400'>Disabled</td>
                )}
                <td className='p-2'>
                    <button
                        className='bg-transparent hover:bg-blue-500 text-blue-600 font-semibold hover:text-white py-2 px-4 border border-blue-600 hover:border-transparent rounded'
                        onClick={handleShow}
                    >
                        Edit
                    </button>
                    <EditUser
                        user={user}
                        users={users}
                        setUsers={setUsers}
                        show={showEditModal}
                        onClose={handleClose}
                    />
                </td>
                <td className='p-2'>
                    {
                        user.enabled ? (
                            <button
                                className='bg-transparent hover:bg-red-500 text-red-600 font-semibold hover:text-white py-2 px-4 border border-red-600 hover:border-transparent rounded'
                                onClick={() => disableUser(user.id)}
                            >
                                Disable
                            </button>

                        ) : (
                            <button
                                className='bg-transparent hover:bg-green-500 text-green-500 font-semibold hover:text-white py-2 px-4 border border-green-600 hover:border-transparent rounded'
                                onClick={() => enableUser(user.id, user)}
                            >
                                Enable
                            </button>
                        )
                    }
                </td>
            </tr> */}
        </>
    )
}

export default User;