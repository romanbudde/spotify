import React, { Fragment, useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import moment from 'moment';
import EditSede from './EditSede';
import UserEditData from './UserEditData';

const SedeItem = ({ sede, sedes, setSedes, displayedSedes, setDisplayedSedes }) => {

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
                className={`${sede.status === 'active' ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' 
                : sede.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-green-400'
                : sede.status === 'cancelled' ? 'bg-red-500'
                : 'bg-gray-700'} p-5 m-5 rounded-md flex flex-col items-start text-white font-medium`}
                key={sede.id}
            >
                <p>Sede: {sede.name}</p>
                <p>
                    Horarios: {sede.horarios && sede.horarios.horarios && sede.horarios.horarios.length > 0 ? sede.horarios.horarios.join(', ') + '.' : 'Aun no tiene horarios.'}
                </p>

                <p>Cupo: {sede.max_cupo}</p>
                <p>Dirección: {sede.address}</p>
                <div
                    className='bg-gray-900 flex flex-row items-center gap-3 p-2 mb-3 mt-3 rounded-lg shadow-md w-full'
                    onClick={handleShow}
                >
                    <FontAwesomeIcon
                        icon={faPenToSquare}
                        className=''
                    />
                    <p>Editar datos</p>
                </div>
                <EditSede
                    sede={sede}
                    sedes={sedes}
                    setSedes={setSedes}
                    displayedSedes={displayedSedes}
                    setDisplayedSedes={setDisplayedSedes}
                    show={showEditModal}
                    onClose={handleClose}
                />
            </div>
        </>
    )
}

export default SedeItem;