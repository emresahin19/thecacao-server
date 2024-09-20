import React from 'react';
import Header from '../components/Layout/components/www/header.component';
import Footer from '../components/Layout/components/www/footer.component';

const Container = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>

    )
}

export default Container