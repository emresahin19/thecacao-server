import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { CategoryProps, ProductProps } from "lib/interfaces";
import { hexToRgba } from "lib/utils";
import { useVariable } from "lib/contexts";
import { defaultColor } from "lib/constants";
import { RootState } from "lib/store";
import MdOutlineSearch from 'lib/assets/icon/svg/MdOutlineSearch.svg'
import MdOutlineSearchOff from 'lib/assets/icon/svg/MdOutlineSearchOff.svg'
import CategorySection from "../../Card/components/category-card.component";
import IconButton from "../../Button/components/icon-button.component";

const SearchModule: React.FC = () => {
    const { searchOpen, setSearchOpen, setIsOverflow } = useVariable();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { data } = useSelector((state: RootState) => state.menu);

    const [filteredCategory, setFilteredCategory] = useState<CategoryProps>({
        id: 0,
        index: 0,
        name: '',
        slug: '',
        order: 0,
        products: [],
        color: hexToRgba(defaultColor, 0.8),
        textColor: '#fff',
        isActive: false
    });

    const searchSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchSectionRef.current && searchSectionRef.current.contains(event.target as Node)) {
                setSearchTerm('');
                setSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setSearchOpen]);

    useEffect(() => {
        if (searchTerm) {
            const filteredProducts: ProductProps[] = [];

            for (let i = 0; i < data.length; i++) {
                const category = data[i];
                for (let j = 0; j < category.products.length; j++) {
                    const product = category.products[j];

                    if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        filteredProducts.push(product);
                    }
                }
            }

            if (filteredProducts.length === 0) {
                setFilteredCategory(prev => ({
                    ...prev,
                    name: `"${searchTerm}" için Hiçbir Sonuç Bulunamadı`,
                    products: [],
                }));
                return;
            }

            setFilteredCategory(prev => ({
                ...prev,
                name: `"${searchTerm}" için Sonuçlar`,
                products: filteredProducts,
            }));

        } else {
            setFilteredCategory(prev => ({
                ...prev,
                name: 'Arama Sonuçları',
                products: [],
            }));
        }
    }, [searchTerm, data]);
    
    const cleanSearch = () => {
        if(searchTerm)
            setSearchTerm('');
        else
            document.getElementById('search-input')?.focus();
    }
    
    useEffect(() => {
        setIsOverflow(searchOpen);
        if(searchOpen) {
            document.getElementById('search-input')?.focus();
        }
    }, [searchOpen])
    
    return searchOpen && (
        <div className={`search-section active`}>
            <div className="s-input-area">
                <IconButton 
                  width={24}
                  onClick={cleanSearch} 
                  ariaLabel="Menüyü Aç"
                  className="h-search-icon"
                >
                  {searchTerm ? <MdOutlineSearchOff /> : <MdOutlineSearch />}
                </IconButton>
                <input 
                    id="search-input"
                    className="search-input"
                    type="text" 
                    placeholder={`Arama yapmak için yazmaya başla...` }
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="search-bg" ref={searchSectionRef}></div>
            {filteredCategory.products.length > 0 && (
                <CategorySection 
                    index={0}
                    id={filteredCategory.id}
                    key={filteredCategory.id}
                    order={filteredCategory.order}
                    slug={filteredCategory.slug}
                    name={filteredCategory.name}
                    products={filteredCategory.products}
                    color={filteredCategory.color}
                    textColor={filteredCategory.textColor}
                    viewType={'list'}
                />
            )}
            {filteredCategory.products.length === 0 && searchTerm && searchTerm.length > 1 && (
                <div className="not-found">
                    <span>Hiçbir Sonuç bulunamadı</span>
                </div>
            )}

        </div>
    );
};

export default SearchModule;
