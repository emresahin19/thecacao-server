import { apiUrl } from "@asim-ui/constants";
import axios from "axios";
import Head from "next/head";
import { CategoryProps, ContactProps, MenuProps } from "@asim-ui/interfaces";
import { Menu } from "@asim-ui/views";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setContacts, setMenuData } from '@asim-ui/store';
import { useLoading } from "@asim-ui/contexts";
import redis from 'redis';
import { promisify } from 'util';

// Redis client oluşturma
const client = redis.createClient({url: 'redis://localhost:6379'});
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Static Props ile sayfayı al
export const getStaticProps = async () => {
    const cacheKey = "menuPageData";
    const cachedData = await getAsync(cacheKey); // Redis'ten kontrol et
    
    if (cachedData) {
        // Redis'te veri varsa, onu kullan
        return {
            props: JSON.parse(cachedData), // Cache'den okunan veriyi döndür
        };
    }

    // Eğer Redis'te veri yoksa API'den veriyi çek
    const { data } = await axios.get(`${apiUrl}/menu`) ?? {};
    const { items, contacts }: { items: CategoryProps[], contacts: ContactProps } = data;

    const pageData = {
        data: items,
        contacts,
    };

    // Veriyi Redis'e kaydet (1 saatlik cache)
    await setAsync(cacheKey, JSON.stringify(pageData), 'EX', 3600);

    return {
        props: pageData,
    };
};

const MenuHome: React.FC<MenuProps> = ({ data, contacts }) => {
    const dispatch = useDispatch();
    const { setLoaded } = useLoading();

    useEffect(() => {
        data && dispatch(setMenuData({ data }));
        contacts && dispatch(setContacts(contacts));
        setLoaded(true);
    }, [data, dispatch, contacts]);

    return (
        <>
            <Head>
                <title>Menü - The Cacao</title>
                <link rel="canonical" href="https://thecacao.com.tr/menu" />
            </Head>

            <Menu data={data} contacts={contacts} />
        </>
    );
};

export default MenuHome;
