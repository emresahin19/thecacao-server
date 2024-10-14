"use client";
import React from 'react';
import { EditTypeProps, ExtraDataProps, } from '../../../interfaces';
import { imageToCdnUrl } from '../../../utils';
import Table from "../../Table/components/table.component";
import { placeholderProductImageBg } from 'lib/constants';

const ExtraCategoryTable: React.FC = () => {
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
            property: 'edit',
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
                isFormData={true}
                fields={fields}
            />
        </div>
    );
};

export default ExtraCategoryTable;
