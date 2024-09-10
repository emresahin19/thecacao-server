import React from "react";
import { CategoryCarouselItemProps, MenuProps, ProductProps } from "@asim-ui/interfaces";
// import { sleep } from "@asim-ui/utils";
// import { useLoading, useModal } from "@asim-ui/contexts";
import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { RootState } from "@asim-ui/store";

import CategorySection from '../../components/Card/components/category-card.component';
import CategoryCarousel from '../../components/Layout/components/www/category-thumbnail.component';
// import { CategoryCarousel } from "@asim-ui/components";
// import ProductDetailCard from '../../components/Card/components/product-detail-card.component';
// import { CategorySection, ProductDetailCard } from "@asim-ui/components";
// import dynamic from "next/dynamic";

// const LazyCategorySection = dynamic(() => import('../../components/Card/components/category-card.component'), { ssr: false });
// const ProductDetailCard = dynamic(() => import('../../components/Card/components/product-detail-card.component'), { ssr: false });

// const initialObjectCount = 3;

const Menu: React.FC<MenuProps> = ({ data, contacts }) => {
    const catData = data && data.map((category, i) => ({id: category.id, name: category.name, isActive: false}));
    // const router = useRouter();
    // const { handleShow } = useModal();
    // const { domContentLoaded } = useLoading();
    // const { data, selectedProduct } = useSelector((state: RootState) => state.menu);
    // const { handleShow } = useModal();
    // const { domContentLoaded } = useLoading();
    
    // useEffect(() => {
    //     const onProductDetails = async (product: ProductProps) => {
    //         if (!product) return;
    
    //         await sleep(500);
    //         handleShow({
    //             show: true,
    //             component: <ProductDetailCard {...product} />,
    //             route: `/menu/${router.query.categorySlug}/${router.query.productSlug}`
    //         });
    //     };
    //     if (selectedProduct) 
    //         onProductDetails(selectedProduct);
    // }, [selectedProduct]);

    return (
        <div className="menu-container">
            {data && <CategoryCarousel data={catData as CategoryCarouselItemProps[]} />}
            {data && data.map((category, i) => (
                <CategorySection
                    key={category.id}
                    id={category.id}
                    index={i}
                    order={category.order}
                    slug={category.slug}
                    name={category.name}
                    products={category.products}
                    color={category.color}
                    textColor={category.textColor}
                    isActive={false}
                />
            ))}

            {/* {data.slice(0, initialObjectCount).map((category, i) => (
                <CategorySection
                    key={category.id}
                    id={category.id}
                    index={i}
                    order={category.order}
                    slug={category.slug}
                    name={category.name}
                    products={category.products}
                    color={category.color}
                    textColor={category.textColor}
                    isActive={router.query.categorySlug === category.slug}
                />
            ))}

            {domContentLoaded && data.slice(initialObjectCount).map((category, i) => (
                <LazyCategorySection 
                    key={category.id}
                    id={category.id}
                    index={i + initialObjectCount}
                    order={category.order}
                    slug={category.slug}
                    name={category.name}
                    products={category.products}
                    color={category.color}
                    textColor={category.textColor}
                    isActive={router.query.categorySlug === category.slug}
                />
            ))} */}
        </div>
    );
};

export default Menu;
