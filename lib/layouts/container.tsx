import Header from '../components/Layout/components/www/header.component';
import Footer from '../components/Layout/components/www/footer.component';
import Modal from '../components/Modal/components/modal.component';
// import dynamic from 'next/dynamic';
// const Modal = dynamic(() => import('../components/Modal/components/modal.component'));

const Container = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Header />
            <main className="main">{children}</main>
            <Footer />
            <Modal />
        </>

    )
}

export default Container