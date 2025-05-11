import '../styling/Pagination.css';
import { useState } from 'react';

function Pagination({ totalPages, onPageChange, loading }) {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageBack = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            onPageChange(newPage);
        }
    };

    const handlePageForward = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            onPageChange(newPage);
        }
    };

    return (
        <div className="pagination">
            <button 
                onClick={handlePageBack} 
                disabled={currentPage === 1 || loading}
            >
                Page back
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
                onClick={handlePageForward} 
                disabled={currentPage === totalPages || loading}
            >
                Page forward
            </button>
        </div>
    );
}

export default Pagination;