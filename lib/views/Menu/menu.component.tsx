// lib/views/Menu/menu.component.tsx
import React, { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { closeModal, openModal } from "lib/store/modal.slice";
import MetaData from 'lib/components/Layout/components/www/meta-data.component';
import MetaSubData from 'lib/components/Layout/components/www/meta-sub-data.component';
import CategoryCarousel from '../../components/Layout/components/www/category-thumbnail.component';
import CategorySection from '../../components/Card/components/category-card.component';
import type { CategoryProps, MenuProps, ProductProps } from "../../interfaces";
import Modal from 'lib/components/Modal/components/modal.component';
import { setContacts, setMenuData } from "lib/store";

const Menu: React.FC<MenuProps> = ({ data, contacts, initialModalData }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [category, setCategory] = useState<CategoryProps | null>(null);
    const [product, setProduct] = useState<ProductProps | null>(null);
    const [categorySlug, productSlug] = Array.isArray(router.query.slug) ? router.query.slug : [undefined, undefined];
    
    const handleProductClick = useCallback(
        ({categorySlug, productSlug}: { categorySlug: string; productSlug: string }) => {
            modalRouteHandler(`${categorySlug}/${productSlug}`);
        },
        [router]
    );

    useEffect(() => {
        data && dispatch(setMenuData({ data }));
        contacts && dispatch(setContacts(contacts));
    }, [])

    const modalRouteHandler = useCallback((path?: string) => {
        return path 
            ? router.push(`/menu/${path}`, undefined, { shallow: true, scroll: false })
            : router.asPath !== '/menu' && router.push('/menu', undefined, { shallow: true, scroll: false });
    }, [handleProductClick, router]);

    useEffect(() => {
        if (data && categorySlug) {
            const foundCategory = data.find((cat) => cat.slug === categorySlug) || null;
            setCategory(foundCategory);
            
            if (foundCategory && productSlug) {
                const foundProduct = foundCategory.products.find((prod) => prod.slug === productSlug) || null;
                if(!foundProduct) {
                    setProduct(null);
                    modalRouteHandler();
                    return;
                }
                setProduct(foundProduct);
                dispatch(
                    openModal({
                        component: 'ProductDetailCard',
                        data: foundProduct,
                    })
                );
            } else {
                setProduct(null);
                setCategory(null);
            }
        } else {
            setProduct(null);
            setCategory(null);
            dispatch(closeModal());
        }
    }, [categorySlug, productSlug, data]);
    
    return (
        <>
            {product && category ? (
                <MetaSubData
                    name={product.name}
                    image={product.images?.[0]?.filename || null}
                    description={product.description}
                    category={category?.name}
                    slug={`${category?.slug}/${product.slug}`}
                />
            ) : (
                <MetaData />
            )}

            {data && <CategoryCarousel data={data.map((cat) => ({ id: cat.id, name: cat.name }))} />}

            {data?.map((cat, i) => (
                cat.products.length > 0 && (
                    <CategorySection
                        key={cat.id}
                        id={cat.id}
                        index={i}
                        order={cat.order}
                        style={cat.style}
                        slug={cat.slug}
                        name={cat.name}
                        products={cat.products}
                        onProductClick={({ productSlug }) =>
                            handleProductClick({ categorySlug: cat.slug, productSlug })
                        }
                    />
                ) 
            ))}
            <Modal 
                onClose={() => modalRouteHandler()} 
                {...initialModalData && { initialData: initialModalData }}
            />
        </>
    );
};

export default React.memo(Menu);
