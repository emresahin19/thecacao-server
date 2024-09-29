// pages/menu/[[...slug]].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import Menu from 'lib/views/Menu/menu.component';
import { fetchMenuData } from '../api/menu';
import type { MenuProps, MenuInitialProps, CategoryProps, ProductProps } from "lib/interfaces";

export const getStaticPaths: GetStaticPaths = async () => {
    const { items }: MenuInitialProps = await fetchMenuData();
    const paths: { params: { slug: string[] } }[] = [];

    paths.push({
        params: {
            slug: [], 
        },
    });

    items?.forEach((category: CategoryProps) => {
        if (category.slug && category.products) {
            category.products.forEach((product: ProductProps) => {
                if (product.slug) {
                    paths.push({
                        params: {
                            slug: [category.slug.toString(), product.slug.toString()],
                        },
                    });
                }
            });
        }
    });

    return {
        paths,
        fallback: 'blocking',
    };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { items, contacts }: MenuInitialProps = await fetchMenuData();

    if(!items) {
        return {
            notFound: true,
        };
    }

    const { slug } = params || { slug: [] };
    const [categorySlug, productSlug] = slug || [undefined, undefined];

    if (!categorySlug || !productSlug) {
        return {
            props: {
                data: items,
                contacts,
            },
            // revalidate: 60,
        };
    }

    const category: CategoryProps | undefined = items && items.find((item: CategoryProps) => item.slug === categorySlug) || undefined;
    const product: ProductProps | undefined = category?.products.find((product: ProductProps) => product.slug === productSlug) || undefined;

    if (!category || !product) {
        return { notFound: true };
    }

    return {
        props: {
            data: items,
            contacts,
            initialModalData: {
                show: true,
                component: 'ProductDetailCard',
                data: product,
            }, 
        },
        // revalidate: 60,
    };
}

const MenuPage: React.FC<MenuProps> = (props) => <Menu {...props} />;

export default MenuPage;
