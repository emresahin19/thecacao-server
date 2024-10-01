import React, { useRef, useEffect, useState } from 'react';
import { PaginationProps } from '../table.props';
import Button from '../../Button/components/button.component';

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange, loading = false }) => {
    const prevTotalPages = useRef(totalPages);
    const [pagesList, setPagesList] = useState<number[]>([]);

    useEffect(() => {
        if (!loading) {
            setPagesList(Array.from({ length: totalPages }, (_, i) => i));
            prevTotalPages.current = totalPages;
        }
    }, [totalPages, loading, onPageChange, currentPage]);

    return (
        <div className="pagination">
            <div className="pagination-container">
                {pagesList.length > 0 && pagesList.map((page) => (
                    <Button
                        key={page}
                        property={`${page % 2 === 1 ? 'reverse' : 'default'}`}
                        className={`${page === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {`${page + 1}`}
                    </Button>
                ))}
            </div>
            <small>
                Page {currentPage + 1} of {!isNaN(totalPages) ? totalPages : 0}
            </small>
        </div>
    );
};

export default Pagination
