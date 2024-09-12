import React from 'react';
import Spinner from './spinner.component';
import { useLoading } from '@asim-ui/contexts';

const GlobalLoading = () => {
    const { loaded } = useLoading();
    
    if (loaded) return null;

    return (
        <div className='global-loading'>
            <Spinner />
        </div>
    );
};

export default GlobalLoading;