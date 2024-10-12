"use client";
import React from 'react';
import { EditTypeProps, ExtraDataProps, } from '../../../interfaces';
import { useCategoryInputData } from '../../../hooks';
import { dateToString, imageToCdnUrl } from '../../../utils';
import Table from "../../Table/components/table.component";
import { useToast } from 'lib/contexts';
import { placeholderProductImageBg } from 'lib/constants';

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
            defaultSort: 'ASC',
            filterType: 'number',
        },
        {
            key: 'image',
            property: 'all',
            label: 'Resim',
            type: 'image',
            render: (extCat: ExtraDataProps) => (
                <div className="avatar">
                    {extCat.image
                        ? <img draggable="false" src={imageToCdnUrl({ image: extCat.image?.filename, type: 'table-avatar' })} />
                        : <img draggable="false" src={imageToCdnUrl({ image: placeholderProductImageBg, type: 'table-avatar' })} />
                    }
                </div>
            ),
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
            required: true,
            sort: true,
            filterType: 'text',
        },
        {
            key: 'passive',
            property: 'none',
            label: 'Pasif',
            type: 'checkbox',
            editable: true,
        },
        {
            key: 'updated_at',
            property: 'view',
            label: 'Düzenleme',
            type: 'date',
            sort: true,
            filterType: 'date',
            render: (data: ExtraDataProps) => new Date(data.updated_at).toLocaleDateString(),
        },
    ];
    
    return (
        <div className='table'>
            <Table<ExtraDataProps>
                className="extra-category-table"
                apiRoute="extra-categories"
                onAction={handleAction}
                isFormData={true}
                fields={fields}
            />
        </div>
    );
};

export default ProductTable;
