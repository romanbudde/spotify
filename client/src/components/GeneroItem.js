import React, { Fragment, useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faHouse, faCheck, faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import moment from 'moment';
import EditGenre from './EditGenre';
import UserEditData from './UserEditData';

const GeneroItem = ({ genre, genres, setGenres, displayedGenres, setDisplayedGenres }) => {

    console.log('genre at GeneroItem: ', genre);

    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShow = () => setShowEditModal(true);
    const handleClose = () => {
        console.log('----------- HANDLE CLOSE() -----------')
        setShowEditModal(false);
    }

    return (
        <>
            <div
                className={`p-5 m-2 w-1/2 rounded-md flex flex-col items-start text-black bg-green-300 font-medium shadow-lg relative`}
                key={genre.id}
            >
                <p>{genre.name}</p>

                <FontAwesomeIcon
                    icon={faPenToSquare}
                    className='text-2xl absolute right-5 hover:scale-110 cursor-pointer'
                    onClick={handleShow}
                />
                <EditGenre
                    genre={genre}
                    genres={genres}
                    setGenres={setGenres}
                    displayedGenres={displayedGenres}
                    setDisplayedGenres={setDisplayedGenres}
                    show={showEditModal}
                    onClose={handleClose}
                />
            </div>
        </>
    )
}

export default GeneroItem;