import React, { useRef, useEffect, useState } from 'react';
import { PaginationProps } from '../table.props';
import Button from '../../Button/components/button.component';
import MultipleSelectBox from 'lib/components/Input/components/multiple-selectbox.component';

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, perPage, onPageChange, onPerPageChange, loading = false }) => {
    const prevTotalPages = useRef(totalPages);
    const [pagesList, setPagesList] = useState<(number | string)[]>([]);

    useEffect(() => {
        if (!loading) {
            const computePagesList = (totalPages: number, currentPage: number) => {
                const pages: (number | string)[] = [];

                if (totalPages <= 7) {
                    // Display all pages if total pages are less than or equal to 7
                    for (let i = 0; i < totalPages; i++) {
                        pages.push(i);
                    }
                } else {
                    // Always display the first page
                    pages.push(0);

                    if (currentPage > 2) {
                        pages.push('prevEllipsis');
                    }

                    // Determine start and end pages
                    let startPage = currentPage - 1;
                    let endPage = currentPage + 1;

                    // Adjust if currentPage is near the start
                    if (currentPage <= 2) {
                        startPage = 1;
                        endPage = 3;
                    }

                    // Adjust if currentPage is near the end
                    if (currentPage >= totalPages - 3) {
                        startPage = totalPages - 4;
                        endPage = totalPages - 2;
                    }

                    for (let i = startPage; i <= endPage; i++) {
                        if (i > 0 && i < totalPages - 1) {
                            pages.push(i);
                        }
                    }

                    if (currentPage < totalPages - 3) {
                        pages.push('nextEllipsis');
                    }

                    // Always display the last page
                    pages.push(totalPages - 1);
                }

                return pages;
            };

            setPagesList(computePagesList(totalPages, currentPage));
            prevTotalPages.current = totalPages;
        }
    }, [totalPages, loading, currentPage]);

    const onPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);

        if (value > 0 && value <= totalPages) {
            onPageChange(value - 1);
        }
    };

    const onPerPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);

        if (value > 0) {
            onPerPageChange && onPerPageChange(value);
        }
    };

    return (
        <div className="pagination">
            <div className="pagination-container">
                {pagesList.length > 0 && pagesList.map((page, index) => {
                    if (page === 'prevEllipsis' || page === 'nextEllipsis') {
                        return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
                    } else {
                        return (
                            <Button
                                key={page}
                                property={`${(page as number) % 2 === 1 ? 'reverse' : 'default'}`}
                                className={`${page === currentPage ? 'active' : ''}`}
                                onClick={() => onPageChange(page as number)}
                            >
                                {`${(page as number) + 1}`}
                            </Button>
                        );
                    }
                })}
            </div>
            {perPage && (
                <div className="paginate-props">
                    <small>
                        Page 
                        {<MultipleSelectBox
                            clearable={false}
                            size='sm'
                            options={Array.from({ length: totalPages }, (_, i) => i + 1)}
                            value={currentPage + 1}
                            onChange={onPageInputChange}
                        />}
                        of {totalPages}
                    </small>
                    <small>
                        Per Page
                        {<MultipleSelectBox
                            clearable={false}
                            size='sm'
                            options={Array.from(new Set([...[perPage], ...[10, 20, 50, 100]].sort((a, b) => a - b)))}
                            value={perPage}
                            onChange={onPerPageInputChange}
                        />}
                    </small>
                </div>
            ) || null}
        </div>
    );
};

export default Pagination;
