"use client";
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { placeholderProductImageBg } from '../../../constants';
import { imageToCdnUrl } from '../../../utils';
import { TableProps } from '../table.props';
import IconButton from '../../Button/components/icon-button.component';
import Checkbox from '../../Input/components/checkbox.component';
import Input from '../../Input/components/input.component';
import Pagination from '../../Table/components/pagination.component';
import EditableInput from '../../Input/components/editable-input.component';
import CiEdit from 'lib/assets/icon/svg/CiEdit.svg';
import CiTrash from 'lib/assets/icon/svg/CiTrash.svg';
import SortButton from './sort-button.component';
import MultipleSelectBox from 'lib/components/Input/components/multiple-selectbox.component';
import { useRouter } from 'next/router';
import lodash from 'lodash';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from 'lib/store/modal.slice';
import { useAppSelector } from 'lib/store';
import { useToast } from '../../../contexts';
import Button from '../../Button/components/button.component';

const Table = <T extends { id: string | number; passive?: number }>({
    columns,
    dataHook,
    className = '',
    editPage
}: TableProps<T>) => {
    const router = useRouter();
    const { query, isReady } = router;
    const dispatch = useDispatch();
    const { showToast, handleRequestError } = useToast();
    const { show } = useAppSelector((state) => state.modal);

    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [filters, setFilters] = useState<{ [key: string]: any }>({});
    const [filterParams, setFilterParams] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
    const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
    const [selectAll, setSelectAll] = useState(false);
    const prevShowRef = useRef<boolean>(show || false);
    const filterKeys = useMemo(() => columns.filter((col) => col.filterType).map((col) => col.key as string), [columns]);

    const { data = [], total = 0, isLoading = false, isError, mutateData } = dataHook(filterParams);

    useEffect(() => {
        if (isError) {
            handleRequestError(isError);
        }
    }, [isError]);
    
    const updateQuery = useCallback((newParams: { [key: string]: any }) => {
        const currentParams = { ...query };

        Object.keys(newParams).forEach((key) => {
            if (newParams[key] === null || newParams[key] === undefined || newParams[key] === '') {
                delete currentParams[key];
            } else {
                currentParams[key] = newParams[key];
            }
        });

        if (!lodash.isEqual(currentParams, query)) {
            router.replace({ pathname: router.pathname, query: currentParams }, undefined, { shallow: true });
        }
    }, [query, router]);

    useEffect(() => {
        if (prevShowRef.current && !show) {
            updateQuery({ action: null, id: null });
            mutateData();
        }
        prevShowRef.current = show || false;
    }, [show, updateQuery, mutateData]);

    useEffect(() => {
        if (!isReady) return;
    
        const { page, perPage, action, id, ...rest } = query;
        
        const queryFilters:{[key: string]: any} = {};

        filterKeys.forEach(key => {
            if (query[key] !== undefined) {
                queryFilters[key] = query[key];
            }
        });
    
        const newCurrentPage = page ? Number(page) - 1 : 0;
        const newPerPage = perPage ? Number(perPage) : 10;
    
        if (currentPage !== newCurrentPage) {
            setCurrentPage(newCurrentPage);
        }
        if (Number(perPage) !== newPerPage) {
            setPerPage(newPerPage);
        }
    
        if (!lodash.isEqual(filters, queryFilters)) {
            setFilters(queryFilters);
        }
    }, [query, isReady]);
    
    useEffect(() => {
        if (!isReady) return;

        const newQuery: {[key: string]: any} = { ...query, page: currentPage + 1, perPage };

        filterKeys.forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                newQuery[key] = filters[key];
            } else {
                delete newQuery[key];
            }
        });
    
        Object.keys(newQuery).forEach((key) => {
            if (newQuery[key] === null || newQuery[key] === undefined || newQuery[key] === '') {
                delete newQuery[key];
            }
        });
    
        if (!lodash.isEqual(newQuery, query)) {
            router.replace({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
        }
    
        const filterAsString = `?${new URLSearchParams(newQuery).toString()}`;
    
        setFilterParams(filterAsString);
    }, [filters, currentPage, perPage, isReady]);
    
    useEffect(() => {
        if (!editPage) return;
        
        const { action, id } = query;

        if (action === 'update' && id) {
            dispatch(openModal({
                component: editPage,
                data: { id },
            }));
        } else if (action === 'create') {
            dispatch(openModal({
                component: editPage,
                data: null,
            }));
        } else {
            dispatch(closeModal());
        }
    }, [query, dispatch, editPage]);

    const handleRowAction = useCallback((action: string, item: T | null) => {
        const { id } = item || { id: 0 };

        if (action === 'view') {
            updateQuery({ action: 'update', id: id });
        } else if (action === 'create') {
            updateQuery({ action: 'create' });
        } else if (action === 'delete') {
            dispatch(openModal({
                component: 'DeleteModal',
                data: { id }
            }));
        }
    }, [updateQuery, dispatch]);

    const handleSelectItem = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, item: T | null) => {
            if (!item) return;
            const checked = e.target.checked;
            const itemId = String(item.id);

            setSelectedItems((prevSelectedItems) => {
                const newSelectedItems = { ...prevSelectedItems };
                if (checked) {
                    newSelectedItems[itemId] = true;
                } else {
                    delete newSelectedItems[itemId];
                }
                return newSelectedItems;
            });
        },
        []
    );

    const handleSelectAllItems = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            setSelectAll(checked);
            const newSelectedItems = data.reduce((acc, item) => {
                acc[String(item.id)] = checked;
                return acc;
            }, {} as { [key: string]: boolean });
            setSelectedItems(newSelectedItems);
        },
        [data]
    );

    const handleFilterChange = useCallback(
        (key: string, value: any) => {
            const newFilters = {
                ...filters,
            };

            if (value) {
                newFilters[key] = value;
            } else {
                delete newFilters[key];
            }

            setFilters(newFilters);
            setCurrentPage(0);
        },
        [filters]
    );

    const handleSort = useCallback(
        (key: string) => {
            const direction = filters.orderBy === key && filters.orderDirection === 'ASC' ? 'DESC' : 'ASC';

            const updatedFilters = {
                ...filters,
                orderBy: key,
                orderDirection: direction,
            };
            setFilters(updatedFilters);
            setCurrentPage(0);
        },
        [filters]
    );

    const onEditInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, itemId: string, key: string) => {
            const value = e.target.value;
            setEditValues((prevEditValues) => ({
                ...prevEditValues,
                [itemId]: {
                    ...prevEditValues[itemId],
                    [key]: value,
                },
            }));
        },
        []
    );

    const handleSave = useCallback(
        (itemId: string) => {
            console.log('Saved item:', editValues[itemId]);
        },
        [editValues]
    );

    const handleCancel = useCallback((itemId: string) => {
        setEditValues((prevEditValues) => {
            const newEditValues = { ...prevEditValues };
            delete newEditValues[itemId];
            return newEditValues;
        });
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            setCurrentPage(page);
            setSelectedItems({});
            setSelectAll(false);
        },
        []
    );

    const numPages = useMemo(() => Math.ceil(total / perPage), [total, perPage]);

    const renderedData = useMemo(() => {
        if (isLoading) {
            return Array.from({ length: perPage }, (_, i) => (
                <tr key={i}>
                    <td>
                        <Checkbox id='selectAll' name='checkboxes' onChange={(e) => handleSelectItem(e, null)}></Checkbox>
                    </td>
                    {columns.map((col, colIndex) => (
                        <td key={colIndex} data-label={col.label}>
                            {String(col.key).includes('image') ? (
                                <div className='avatar'>
                                    <img src={imageToCdnUrl({ image: placeholderProductImageBg, type: 'table-avatar' })} />
                                </div>
                            ) : (
                                <div className='avatar'>
                                    <div className='' />
                                </div>
                            )}
                        </td>
                    ))}
                    <td>
                        <div className='button-area'>
                            <IconButton onClick={() => handleRowAction('view', null)} ariaLabel={'Düzenle'} width={24}>
                                <CiEdit />
                            </IconButton>
                            <IconButton onClick={() => handleRowAction('delete', null)} ariaLabel={'Sil'} width={24}>
                                <CiTrash />
                            </IconButton>
                        </div>
                    </td>
                </tr>
            ))
        }

        return data.map((item, index) => (
            <tr key={item.id} className={item && item.passive ? '' : ''}>
                <td>
                    <Checkbox
                        id='selectAll'
                        name='checkboxes'
                        onChange={(e) => handleSelectItem(e, item)}
                        checked={selectedItems[String(item.id)]}
                    ></Checkbox>
                </td>
                {columns.map((col) => {
                    if (col.editable && col.filterType) {
                        return (
                            <td key={String(col.key)} data-label={col.label}>
                                <EditableInput
                                    name={`${String(col.key)}_${index}`}
                                    type={col.filterType}
                                    value={editValues[item.id]?.[col.key] || (item as any)[col.key]}
                                    onChange={(e) => onEditInputChange(e, String(item.id), String(col.key))}
                                    onSave={() => handleSave(String(item.id))}
                                    onCancel={() => handleCancel(String(item.id))}
                                    options={col.options}
                                    render={
                                        col.render && col.render({ ...item, [col.key]: editValues[item.id]?.[col.key] || (item as any)[col.key] })
                                    }
                                />
                            </td>
                        );
                    }
                    if (col.editable && !col.filterType) {
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
                        );
                    }
                    if (col.type === 'color') {
                        return (
                            <td key={String(col.key)} data-label={col.label}>
                                <div className='color-box' style={{ backgroundColor: (item as any)[col.key] }} />
                            </td>
                        );
                    }
                    return (
                        <td key={String(col.key)} data-label={col.label}>
                            <div className='ellipsis td-item'>{col.render ? col.render(item) : (item as any)[col.key]}</div>
                        </td>
                    );
                })}
                <td>
                    <div className='button-area'>
                        <IconButton
                            className='text-success'
                            onClick={() => handleRowAction('view', item)}
                            ariaLabel={'Düzenle'}
                            width={24}
                        >
                            <CiEdit />
                        </IconButton>
                        <IconButton
                            className='text-danger'
                            onClick={() => handleRowAction('delete', item)}
                            ariaLabel={'Sil'}
                            width={24}
                        >
                            <CiTrash />
                        </IconButton>
                    </div>
                </td>
            </tr>
        ));
    }, [
        data,
        isLoading,
        perPage,
        columns,
        handleSelectItem,
        selectedItems,
        editValues,
        onEditInputChange,
        handleSave,
        handleCancel,
        handleRowAction,
    ]);

    return (
        <>
            <Button
                onClick={() => handleRowAction('create', null)}
                label='Yeni Ekle'
            />
            <table className={className}>
                <thead>
                    <tr>
                        <th>
                            <Checkbox
                                id='selectAll'
                                name='checkboxes'
                                onChange={handleSelectAllItems}
                                checked={selectAll}
                            ></Checkbox>
                        </th>
                        {columns.map((col) => (
                            <th key={`${String(col.key)}-filter`}>
                                {col.filterType ? (
                                    <div className='th-filter'>
                                        {col.sort && (
                                            <span role='button' onClick={() => handleSort(col.key as string)}>
                                                <SortButton
                                                    {...(filters.orderBy === col.key ? { direction: filters.orderDirection } : { direction: null })}
                                                />
                                            </span>
                                        )}
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
                                                type='number'
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                        {col.filterType === 'select' && col.options && (
                                            <MultipleSelectBox
                                                label={`${col.label} Seç`}
                                                options={col.options}
                                                name={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e: any) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                        {col.filterType === 'date' && (
                                            <Input
                                                type='date'
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                        {col.filterType === 'datetime' && (
                                            <Input
                                                type='datetime-local'
                                                name={`${col.label}`}
                                                label={`${col.label}`}
                                                value={filters[col.key as string] || ''}
                                                onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    col.label
                                )}
                            </th>
                        ))}
                        <th />
                    </tr>
                </thead>
                <tbody>{renderedData}</tbody>
            </table>
            <Pagination
                totalPages={numPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                loading={isLoading}
            />
        </>
    );
};

export default Table;
