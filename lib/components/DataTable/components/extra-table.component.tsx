"use client";
import React from 'react';
import { EditTypeProps, ExtraDataProps, ExtraProps, OptionsProps } from '../../../interfaces';
import { useCategoryInputData, useExtraInputData } from '../../../hooks';
import { imageToCdnUrl } from '../../../utils';
import { placeholderProductImageBg } from '../../../constants';
import Table from "../../Table/components/table.component";
import { useToast } from 'lib/contexts';

const ProductTable: React.FC = () => {
    const { extraData } = useExtraInputData();
    const { showToast } = useToast();
    const handleAction = async (item: ExtraProps, action: string) => {
        
    }

    const fields: EditTypeProps<ExtraProps>[] = [
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
            render: (extra: ExtraProps) => (
                <div className="avatar">
                    {extra.image
                        ? <img draggable="false" src={imageToCdnUrl({ image: extra.image?.filename, type: 'table-avatar' })} />
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
            key: 'category_id',
            property: 'all',
            label: 'Kategori',
            type: 'select',
            sort: true,
            editable: true,
            required: true,
            filterType: 'select',
            options: extraData.map((extra: OptionsProps) => ({ value: extra.value, label: extra.label })),
            render: (extra: ExtraProps) => (
                <span>{extra.category?.name}</span>
            ),
        },
        {
            key: 'description',
            property: 'all',
            label: 'Açıklama',
            type: 'textarea',
            editable: true,
        },
        {
            key: 'passive',
            property: 'none',
            label: 'Pasif',
            type: 'checkbox',
            editable: true,
        },
        {
            key: 'created_at',
            property: 'none',
            label: 'Oluşturulma',
            type: 'date',
            sort: true,
            editable: false,
            render: (data: ExtraProps) => new Date(data.created_at).toLocaleDateString(),
        },
        {
            key: 'updated_at',
            property: 'view',
            label: 'Güncelleme',
            type: 'date',
            defaultSort: 'DESC',
            sort: true,
            editable: false,
            render: (data: ExtraProps) => new Date(data.updated_at).toLocaleDateString(),
        },
    ];

    return (
        <div className='table'>
            <Table<ExtraProps>
                className="extra-table"
                fields={fields}
                apiRoute="extra"
                onAction={handleAction}
                isFormData={true}
            />
        </div>
    );
};

export default ProductTable;
