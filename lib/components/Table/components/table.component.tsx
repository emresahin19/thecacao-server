import React, { useState } from 'react';
import { placeholderProductImageBg } from '../../../constants';
import { imageToCdnUrl } from '../../../utils';
import { TableProps } from '../table.props';
import IconButton from '../../Button/components/icon-button.component';
import Checkbox from '../../Input/components/checkbox.component';
import Input from '../../Input/components/input.component';
import SelectBox from '../../Input/components/selectbox.component';
import Pagination from '../../Table/components/pagination.component';
import EditableInput from '../../Input/components/editable-input.component';
import CiEdit from 'lib/assets/icon/svg/CiEdit.svg';
import CiTrash from 'lib/assets/icon/svg/CiTrash.svg';

const Table = <T extends { id: string | number, passive?: number }>({
    data = [],
    columns,
    onRowAction,
    onPageChange,
    currentPage,
    perPage,
    totalItems,
    loading = false,
    className = '',
    onFilterChange,
}: TableProps<T>) => {
    const [filters, setFilters] = useState<{ [key: string]: any }>({});
    const numPages = Math.ceil(totalItems / perPage);
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectItem = (e: React.ChangeEvent<HTMLInputElement>, item: T | null) => {
        if(!item) return;
        const checked = e.target.checked;
        const itemId = String(item.id);

        if (checked) {
            setSelectedItems((prevSelectedItems) => ({
                ...prevSelectedItems,
                [itemId]: true,
            }));
        } else {
            setSelectedItems((prevSelectedItems) => {
                const newSelectedItems = { ...prevSelectedItems };
                delete newSelectedItems[itemId];
                return newSelectedItems;
            });
        }
    };

    const handleSelectAllItems = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        const newSelectedItems = data.reduce((acc, item) => {
            acc[String(item.id)] = checked;
            return acc;
        }, {} as { [key: string]: boolean });
        setSelectedItems(newSelectedItems);
    };

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = {
            ...filters,
        };
    
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
    
        setFilters(newFilters);
        if (onPageChange) {
            onPageChange(0);
        }

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
    
        const timeout = setTimeout(() => {
            if (onFilterChange) {
                onFilterChange(newFilters);
            }
        }, 300);
    
        setDebounceTimeout(timeout);
    };

    const onEditInputChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string, key: string) => {
        const value = e.target.value;
        setEditValues((prevEditValues) => ({
            ...prevEditValues,
            [itemId]: {
                ...prevEditValues[itemId],
                [key]: value,
            },
        }));
    };

    const handleSave = (itemId: string) => {
        console.log('Saved item:', editValues[itemId]);
    };

    const handleCancel = (itemId: string) => {
        setEditValues((prevEditValues) => {
            const newEditValues = { ...prevEditValues };
            delete newEditValues[itemId];
            return newEditValues;
        });
    };

    const handlePageChange = (page: number) => {
        onPageChange?.(page);
        setSelectedItems({});
        setSelectAll(false);
    };

    return (
        <>
            <table className={className}>
                <thead>
                    <tr>
                        <th>
                            <Checkbox
                                id='selectAll'
                                name="checkboxes"
                                onChange={handleSelectAllItems}
                                checked={selectAll}
                            >
                            </Checkbox>
                        </th>
                        {columns.map((col) => (
                            <th key={`${String(col.key)}-filter`}>
                                {col.filterType && (
                                    <>
                                        {col.filterType === 'text' && (
                                            <Input
                                                type='text'
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                        {col.filterType === 'number' && (
                                            <Input
                                                type="number"
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                        {col.filterType === 'select' && col.options && (
                                            <SelectBox
                                                label={`${col.label} Seç`}
                                                options={col.options}
                                                name={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e: any) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                        {col.filterType === 'date' && (
                                            <Input
                                                type="date"
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                        {col.filterType === 'datetime' && (
                                            <Input
                                                type="datetime-local"
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                    </>
                                )}
                                {!col.filterType && col.label}
                            </th>
                        ))}
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {!loading && Array.isArray(data) && data.map((item, index) => (
                        <tr key={item.id} className={item && item.passive ? '' : ''} >
                            <td>
                                <Checkbox
                                    id='selectAll'
                                    name="checkboxes"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectItem(e, item)}
                                    checked={selectedItems[String(item.id)]}
                                >
                                </Checkbox>
                            </td>
                            {columns.map((col) => {
                                if(col.editable && col.filterType && col.filterType !== 'select') {
                                    return ( 
                                        <td key={String(col.key)} data-label={col.label}>
                                            <EditableInput
                                                name={`${col.label}${index}`}
                                                type={col.filterType || 'text'}
                                                value={editValues[item.id]?.[col.key] || (item as any)[col.key]}
                                                onChange={(e) => onEditInputChange(e, String(item.id), String(col.key))}
                                                onSave={() => handleSave(String(item.id))}
                                                onCancel={() => handleCancel(String(item.id))}
                                            />
                                        </td>
                                    )
                                }
                                if(col.editable && !col.filterType) {
                                    return (
                                        <td key={String(col.key)} data-label={col.label}>
                                            <Input
                                                type='text'
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={(item as any)[col.key]}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        </td>
                                    )
                                }
                                if(col.type === 'color') {
                                    return (
                                        <td key={String(col.key)} data-label={col.label}>
                                            <div className='color-box' style={{ backgroundColor: (item as any)[col.key] }} />
                                        </td>
                                    )
                                }
                                return (
                                    <td key={String(col.key)} data-label={col.label}>
                                        <div className='ellipsis td-item'>
                                            {col.render ? col.render(item) : (item as any)[col.key]}
                                        </div>
                                    </td>
                                )
                            })}
                            <td>
                                <div className="button-area">
                                    <IconButton
                                        className='text-success'
                                        onClick={() => onRowAction && onRowAction('view', item)} 
                                        ariaLabel={'Düzenle'}
                                        width={24}
                                    >
                                        <CiEdit />
                                    </IconButton>
                                    <IconButton
                                        className='text-danger'
                                        onClick={() => onRowAction && onRowAction('delete', item)}
                                        ariaLabel={'Sil'}
                                        width={24}
                                    >
                                        <CiTrash />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {loading && Array.from({ length: perPage }, (_, i) => (
                        <tr key={i}>
                            <td>
                                <Checkbox
                                    id='selectAll'
                                    name="checkboxes"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectItem(e, null)}
                                >
                                </Checkbox>
                            </td>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} data-label={col.label}>
                                    {String(col.key).includes('image') ? (
                                        <div className="avatar">
                                            <img src={imageToCdnUrl({image: placeholderProductImageBg, type: 'product'})} />
                                        </div>
                                    ) : (
                                        <div className="avatar">
                                            <div className="" />
                                        </div>
                                    )}
                                </td>
                            ))}
                            <td>
                                <div className="button-area">
                                    <IconButton
                                        onClick={() => onRowAction && onRowAction('view', null)} 
                                        ariaLabel={'Düzenle'}
                                        width={24}
                                    >
                                        <CiEdit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onRowAction && onRowAction('delete', null)}
                                        ariaLabel={'Sil'}
                                        width={24}
                                    >
                                        <CiTrash />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                totalPages={numPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                loading={loading}
            />
        </>
    );
};

export default Table;
