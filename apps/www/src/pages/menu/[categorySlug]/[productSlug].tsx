import { Menu } from "@asim-ui/views";
import { wwwUrl, metaDescription, metaImage } from "@asim-ui/constants";
import axios from "axios";
import Head from 'next/head';
import { CategoryProps, ContactProps, ProductProps } from "@asim-ui/interfaces";
import { useDispatch } from "react-redux";
import { setMenuData, selectCategory, selectProduct, setContacts } from '@asim-ui/store';
import { useEffect } from "react";

export const getServerSideProps = async ({ params }: { params: any }) => {
    const { data } = await axios.post(`${wwwUrl}/api/menu`);

    const { items, contacts } = data;
    
    const category: CategoryProps = items.find((item: CategoryProps) => item.slug === params.categorySlug);
    const product: ProductProps | undefined = category.products.find((product: ProductProps) => product.slug === params.productSlug);

    if (!product) {
        throw new Error('Product not found');
    }

    return {
        props: {
            data: items,
            sliderItems: [],
            category,
            contacts,
            product
        },
    };
};

const ProductDetail: React.FC<{ 
    data: CategoryProps[], 
    category: CategoryProps, 
    product: ProductProps,
    contacts: ContactProps
}> = ({ data, category, product, contacts }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setMenuData({ data }));
        dispatch(selectCategory(category));
        dispatch(selectProduct(product));
        dispatch(setContacts(contacts));
    }, [data, contacts, category, product, dispatch]);

    if (!product) {
        return <div>Product not found</div>;
    }

    const productDescription = `${product.name} ${metaDescription}`;
    const metaTitle = `${product.name} - The Cacao`;
    const productImage = product.images.length > 0 ? product.images[0].url : metaImage;
    const metaKeywords = product.description ? product.description.split(' ').join(', ') : '';

    return (
        <>
            <Head>
                <title>{metaTitle}</title>

                <meta name="description" content={productDescription} />
                <meta name="keywords" content={`çikolata, tatlı, kahve, dünya mutfağı, cacao, the cacao, gebze, ${metaKeywords}`} />

                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={productDescription} />
                <meta property="og:image" content={productImage} />
                <meta property="og:image:type" content="image/webp" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:url" content={`https://thecacao.com.tr/menu/${category.slug}/${product.slug}`} />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={metaTitle} />
                <meta property="twitter:description" content={productDescription} />
                <meta property="twitter:image:src" content={metaImage} />
                <meta property="twitter:image:width" content="1200" />
                <meta property="twitter:image:height" content="630" />
                <meta property="twitter:site" content="@asim-ui" />
            </Head>
            <Menu 
                category={category}
                product={product}
                data={data}
            />
        </>
    );
};

export default ProductDetail;
