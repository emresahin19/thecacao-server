import React from 'react';
import MdArrowDropUp from 'lib/assets/icon/svg/MdArrowDropUp.svg';
import MdArrowDropDown from 'lib/assets/icon/svg/MdArrowDropDown.svg';

interface SortButtonProps {
    direction?: 'ASC' | 'DESC' | null | undefined;
}

const SortButton = ({ direction }: SortButtonProps) => {
    return (
        <div className={`sort-button ${direction && (direction === 'ASC' ? 'asc' : 'desc')}`}>
            <MdArrowDropUp />
            <MdArrowDropDown />
        </div>
    );
};

export default SortButton;