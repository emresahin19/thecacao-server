import { Modal } from "@asim-ui/components"
import { Header, Footer } from "@asim-ui/components"

const Container = ({children}: {children: React.ReactNode}) => {
    return (
        <>
            <Modal />
            <Header />
            <main className="main">{children}</main>
            <Footer />
        </>

    )
}

export default Container