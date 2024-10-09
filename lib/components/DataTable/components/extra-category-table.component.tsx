"use client";
import React from 'react';
import { EditTypeProps, ExtraDataProps, } from '../../../interfaces';
import { useCategoryInputData } from '../../../hooks';
import { dateToString } from '../../../utils';
import Table from "../../Table/components/table.component";
import { useToast } from 'lib/contexts';

const ProductTable: React.FC = () => {
    const { categories } = useCategoryInputData();
    const { showToast } = useToast();

    const handleAction = async (item: ExtraDataProps, action: string) => {
        
    }

    const fields: EditTypeProps<ExtraDataProps>[] = [
        {
            key: 'id',
            property: 'view',
            label: 'ID',
            type: 'number',
            sort: true,
            editable: false,
        },
        {
            key: 'name',
            property: 'all',
            label: 'İsim',
            type: 'text',
            editable: true,
            required: true,
            sort: true,
            filterType: 'text',
        },
        {
            key: 'description',
            property: 'all',
            label: 'Açıklama',
            type: 'textarea',
            editable: true,
        },
        {
            key: 'image',
            property: 'all',
            label: 'Resim',
            type: 'image',
            editable: true,
        },
        {
            key: 'passive',
            property: 'all',
            label: 'Pasif',
            type: 'checkbox',
            editable: true,
        },
        {
            key: 'created_at',
            property: 'view',
            label: 'Oluşturulma Tarihi',
            type: 'date',
            sort: true,
            editable: false,
            render: (data: ExtraDataProps) => new Date(data.created_at).toLocaleDateString(),
        },
        {
            key: 'updated_at',
            property: 'view',
            label: 'Güncelleme Tarihi',
            type: 'date',
            sort: true,
            editable: false,
            render: (data: ExtraDataProps) => new Date(data.updated_at).toLocaleDateString(),
        },
    ];
    
    return (
        <div className='table'>
            <Table<ExtraDataProps>
                className="extra-category-table"
                apiRoute="extra-categories"
                onAction={handleAction}
                fields={fields}
                // columns={[
                //     {
                //         key: 'name',
                //         label: 'Ürün İsmi',
                //         sort: true,
                //         editable: true,
                //         filterType: 'text'
                //     },
                //     {
                //         key: 'price',
                //         sort: true,
                //         label: 'Fiyat',
                //         editable: true,
                //         filterType: 'number'
                //     },
                //     {
                //         key: 'updated_at',
                //         label: 'Düzenleme',
                //         sort: true,
                //         defaultSort: 'DESC',
                //         editable: true,
                //         filterType: 'date',
                //         render: (extra: ExtraDataProps) => (
                //             <span>{dateToString(extra.updated_at, true)}</span>
                //         )
                //     }
                // ]}
            />
        </div>
    );
};

export default ProductTable;
