import React from "react";
import { MenuProps, ProductProps } from "@asim-ui/interfaces";
// import { sleep } from "@asim-ui/utils";
// import { useLoading, useModal } from "@asim-ui/contexts";
import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { RootState } from "@asim-ui/store";

import CategorySection from '../../components/Card/components/category-card.component';
// import ProductDetailCard from '../../components/Card/components/product-detail-card.component';
// import { CategorySection, ProductDetailCard } from "@asim-ui/components";
// import dynamic from "next/dynamic";

// const LazyCategorySection = dynamic(() => import('../../components/Card/components/category-card.component'), { ssr: false });
// const ProductDetailCard = dynamic(() => import('../../components/Card/components/product-detail-card.component'), { ssr: false });

// const initialObjectCount = 3;

const Menu: React.FC<MenuProps> = ({ data, contacts }) => {
    const router = useRouter();
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
                    isActive={router.query.categorySlug === category.slug}
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
