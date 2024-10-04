"use client";
import React from 'react';
import { ExtraDataProps, } from '../../../interfaces';
import { useCategoryInputData } from '../../../hooks';
import { dateToString } from '../../../utils';
import Table from "../../Table/components/table.component";
import { useToast } from 'lib/contexts';

const ProductTable: React.FC = () => {
    const { categories } = useCategoryInputData();
    const { showToast } = useToast();

    const handleAction = async (item: ExtraDataProps, action: string) => {
        
    }

    return (
        <div className='table'>
            <Table<ExtraDataProps>
                className="extra-category-table"
                editPage="ProductEditCard"
                apiRoute="extra-categories"
                onAction={handleAction}
                columns={[
                    {
                        key: 'name',
                        label: 'Ürün İsmi',
                        sort: true,
                        editable: true,
                        filterType: 'text'
                    },
                    {
                        key: 'price',
                        sort: true,
                        label: 'Fiyat',
                        editable: true,
                        filterType: 'number'
                    },
                    {
                        key: 'updated_at',
                        label: 'Düzenleme',
                        sort: true,
                        defaultSort: 'DESC',
                        editable: true,
                        filterType: 'date',
                        render: (extra: ExtraDataProps) => (
                            <span>{dateToString(extra.updated_at, true)}</span>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default ProductTable;
