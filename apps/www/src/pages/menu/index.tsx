// apps/www/src/pages/menu/index.tsx
import type { CategoryProps, ContactProps, MenuProps } from "lib/interfaces";
import { apiUrl } from "lib/constants";
import axios from "axios";
import Head from "next/head";
import Menu from "lib/views/Menu/menu.component";

export const getStaticProps = async () => {
    console.log(`${apiUrl}/menu`)
    const { data } = await axios.get(`${apiUrl}/menu`) ?? {};
    const { items, contacts }: { items: CategoryProps[], contacts: ContactProps} = data;
    
    return {
        props: {
            data: items,
            contacts,
        }
    };
};

const MenuHome: React.FC<MenuProps> = ({ data, contacts }) => {
    return (
        <>
            <Head>
                <title>Menü - The Cacao</title>
                <link rel="canonical" href="https://thecacao.com.tr/menu" />
            </Head>
            <Menu 
                data={data}
                contacts={contacts}
            />
        </>
    );
};

export default MenuHome;
