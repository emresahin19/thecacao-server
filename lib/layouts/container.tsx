import React from 'react';
import Header from '../components/Layout/components/www/header.component';
import Footer from '../components/Layout/components/www/footer.component';
import BackButton from '../components/Button/components/back-button.component';

const Container = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Header />
            {children}
            <BackButton />
            <Footer />
        </>

    )
}

export default Container