// apps/www/src/pages/menu/index.tsx
import { apiUrl } from "@asim-ui/constants";
import axios from "axios";
import Head from "next/head";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setContacts, setMenuData } from '@asim-ui/store';
import { CategoryProps, ContactProps, MenuProps } from "@asim-ui/interfaces";
import { Menu } from "@asim-ui/views";

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${apiUrl}/api/menu`) ?? {};
    const { items, contacts }: { items: CategoryProps[], contacts: ContactProps} = data;

    return {
        props: {
            data: items,
            contacts,
        },
    };
};

const MenuHome: React.FC<MenuProps> = ({ data, contacts }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        data && dispatch(setMenuData({data}));
        contacts && dispatch(setContacts(contacts));
    }, [data, dispatch, contacts]);
    
    return (
        <>
            <Head>
                <title>Menü - The Cacao</title>
                <link rel="canonical" href="https://thecacao.com.tr/menu" />
            </Head>

            <Menu />
        </>
    );
};

export default MenuHome;
