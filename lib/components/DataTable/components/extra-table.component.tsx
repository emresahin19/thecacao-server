"use client";
import React from 'react';
import { ExtraProps } from '../../../interfaces';
import { useCategoryInputData } from '../../../hooks';
import { dateToString, imageToCdnUrl } from '../../../utils';
import { placeholderProductImageBg } from '../../../constants';
import Table from "../../Table/components/table.component";
import { useToast } from 'lib/contexts';

const ProductTable: React.FC = () => {
    const { categories } = useCategoryInputData();
    const { showToast } = useToast();

    const handleAction = async (item: ExtraProps, action: string) => {
        
    }

    return (
        <div className='table'>
            <Table<ExtraProps>
                className="extra-table"
                editPage="ProductEditCard"
                apiRoute="extra"
                onAction={handleAction}
                columns={[
                    {
                        key: 'image_urls',
                        label: 'Resim',
                        render: (extra: ExtraProps) => (
                            extra.image_urls && (
                                <div className="avatar">
                                    {extra.image_urls.length > 0
                                        ? <img draggable="false" src={extra.image_urls[0]} />
                                        : <img draggable="false" src={imageToCdnUrl({ image: placeholderProductImageBg, type: 'table-avatar' })} />
                                    }
                                </div>
                            ))
                    },
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
                        filterType: 'number',
                        render: (extra: ExtraProps) => (
                            <span>{extra.price} ₺</span>
                        )
                    },
                    {
                        key: 'updated_at',
                        label: 'Düzenleme',
                        sort: true,
                        defaultSort: 'DESC',
                        editable: true,
                        filterType: 'date',
                        render: (extra: ExtraProps) => (
                            <span>{dateToString(extra.updated_at, true)}</span>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default ProductTable;
