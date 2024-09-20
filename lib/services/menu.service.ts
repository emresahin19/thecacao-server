import { axiosInstance } from 'lib/utils';
import { MenuInitialProps } from 'lib/interfaces';

export const fetchMenuData = async () => {
    try {
        const { data } = await axiosInstance.get(`/menu`);
        const { items, contacts }: MenuInitialProps = data;
        return { items, contacts };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}
