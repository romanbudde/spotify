import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faHouse, faCheck } from '@fortawesome/free-solid-svg-icons';
 
const Paginate = ({ postsPerPage, totalPosts, paginate, currentPage, setCurrentPage }) => {
    const pageNumbers = [];
    const amountOfPages = Math.ceil(totalPosts / postsPerPage);
    const lastPage = Math.ceil(totalPosts / postsPerPage);
    
    // console.log('------ current page: ', currentPage);
    // console.log('------ amount of pages calculation: ', Math.ceil(totalPosts / postsPerPage));
    
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if(i <= 0){

        }
        else if(i > lastPage) {

        }
        else {
            pageNumbers.push(i);
        }
    }
 
//    console.log('-------pageNumbers[0]: ', pageNumbers[0]);
//    console.log('-------pageNumbers[al final]: ', pageNumbers[pageNumbers.length - 1]);
//    console.log('-------amount of pages: ', amountOfPages);

    // estamos en la primer pagina

    if(amountOfPages > 2) {
        if(pageNumbers[0] === currentPage) {
            pageNumbers.push(3);
            // console.log()
        }
    
        // estamos en la ultima pagina
        if(lastPage === currentPage) {
            pageNumbers.unshift(lastPage - 2);
            // console.log('AT LAST PAGEEEEEEEEEEEEEEEEEE')
        }
    }

    const handlePreviousPage = () => {
        if(currentPage > 1){
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNextPage = () => {
        if(currentPage < lastPage){
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <Fragment>
            { amountOfPages > 1 && (
                <div className="pagination-container">
                    <ul className="pagination flex flex-row justify-evenly items-center my-3 w-full">
                        <FontAwesomeIcon
							className={`${currentPage === 1 ? 'absolute left-5 text-lg opacity-25' : 'absolute left-5 text-lg'}`}
							icon={faChevronLeft}
							onClick={ handlePreviousPage }
						/>
                        <div className='flex flex-row w-1/4 justify-end'>
                            { amountOfPages > 3 && currentPage > 2 && (
                                <>
                                        <li
                                            key={1}
                                            onClick={() => paginate(1)}
                                            className={`page-number px-3 py-1 rounded-md ${1 === currentPage ? 'bg-blue-200' : ''}`}
                                        >
                                            1
                                        </li> 
                                        <p className='mt-auto'>...</p>
                                </>
                            )}
                        </div>
                        <div className='flex flex-row gap-4 justify-evenly w-2/4'>
                            {pageNumbers.map((number) => (
                                <li
                                key={number}
                                onClick={() => paginate(number)}
                                className={`page-number px-3 py-1 rounded-md ${number === currentPage ? 'bg-blue-200' : ''}`}
                                >
                                    {number}
                                </li>
                            ))}
                        </div>
                        <div className='flex flex-row w-1/4'>
                            { amountOfPages > 3 && currentPage < amountOfPages - 1 && (
                                <>
                                    <p className='mt-auto'>...</p>
                                    <div className='flex flex-row'>
                                        <li
                                            key={lastPage}
                                            onClick={() => paginate(lastPage)}
                                            className={`page-number px-3 py-1 rounded-md ${lastPage === currentPage ? 'bg-blue-200' : ''}`}
                                            >
                                            {lastPage}
                                        </li> 
                                    </div>
                                </>
                            )}
                        </div>
                        <FontAwesomeIcon
							className={`${currentPage === lastPage ? 'absolute right-5 text-lg opacity-25' : 'absolute right-5 text-lg'}`}
							icon={faChevronRight}
							onClick={ handleNextPage }
						/>
                    </ul>
                </div>
            )}
        </Fragment>
    );
};
 
export default Paginate;