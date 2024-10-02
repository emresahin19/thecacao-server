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
import Button from '../../Button/components/button.component';

const Table = <T extends { id: string | number; passive?: number; [key: string]: any }>({
    columns,
    dataHook,
    className = '',
    editPage,
    apiRoute,
    onAction
}: TableProps<T>) => {
    const router = useRouter();
    const { query, isReady } = router;
    const dispatch = useDispatch();
    const { show } = useAppSelector((state) => state.modal);

    const [tableState, setTableState] = useState<{
        currentPage: number;
        perPage: number;
        orderBy: string;
        orderDirection: string;
        filters: { [key: string]: any };
    }>({
        currentPage: 0,
        perPage: 10,
        orderBy: columns.find((col) => col.defaultSort)?.key as string,
        orderDirection: columns.find((col) => col.defaultSort)?.defaultSort || 'ASC',
        filters: {}
    });
    
    const [filterParams, setFilterParams] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
    const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
    const [selectAll, setSelectAll] = useState(false);
    const prevShowRef = useRef<boolean>(show || false);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const filterKeys = useMemo(
        () => columns.filter((col) => col.filterType).map((col) => col.key as string),
        [columns]
    );

    const { data = [], total = 0, isLoading = false, isError, mutateData } = dataHook(filterParams);

    const updateQuery = useCallback(
        (newParams: { [key: string]: any }) => {
            const currentParams = { ...query };

            Object.keys(newParams).forEach((key) => {
                if (
                    newParams[key] === null ||
                    newParams[key] === undefined ||
                    newParams[key] === ''
                ) {
                    delete currentParams[key];
                } else {
                    currentParams[key] = newParams[key];
                }
            });

            if (!lodash.isEqual(currentParams, query)) {
                router.replace(
                    { pathname: router.pathname, query: currentParams },
                    undefined,
                    { shallow: true }
                );
            }
        },
        [query, router]
    );

    useEffect(() => {
        if (prevShowRef.current && !show) {
            updateQuery({ action: null, id: null });
            mutateData();
        }
        prevShowRef.current = show || false;
    }, [show, updateQuery, mutateData]);

    useEffect(() => {
        if (!isReady) return;
    
        const {
            page,
            perPage,
            orderBy,
            orderDirection,
            action,
            id,
            ...rest
        } = query;
    
        const queryFilters: { [key: string]: any } = {};
    
        filterKeys.forEach((key) => {
            if (query[key] !== undefined) {
                queryFilters[key] = query[key];
            }
        });
    
        const newCurrentPage = page ? Number(page) - 1 : tableState.currentPage;
        const newPerPage = perPage ? Number(perPage) : tableState.perPage;
        const newOrderBy = orderBy ? String(orderBy) : tableState.orderBy;
        const newOrderDirection = orderDirection ? String(orderDirection) : tableState.orderDirection;
    
        const newState = {
            currentPage: newCurrentPage,
            perPage: newPerPage,
            orderBy: newOrderBy,
            orderDirection: newOrderDirection,
            filters: queryFilters
        };
    
        if (!lodash.isEqual(newState, tableState)) {
            setTableState((prevState) => ({
                ...prevState,
                currentPage: newCurrentPage,
                perPage: newPerPage,
                orderBy: newOrderBy,
                orderDirection: newOrderDirection,
                filters: queryFilters
            }));
        }
    }, [query, isReady]);

    useEffect(() => {
        if (!isReady) return;

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            const { currentPage, perPage, orderBy, orderDirection, filters } = tableState;
            const newQuery: { [key: string]: any } = {
                ...query,
                page: currentPage + 1,
                perPage,
                orderBy,
                orderDirection
            };
    
            filterKeys.forEach((key) => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    newQuery[key] = filters[key];
                } else {
                    delete newQuery[key];
                }
            });
    
            Object.keys(newQuery).forEach((key) => {
                if (
                    newQuery[key] === null ||
                    newQuery[key] === undefined ||
                    newQuery[key] === ''
                ) {
                    delete newQuery[key];
                }
            });
    
            if (!lodash.isEqual(newQuery, query)) {
                router.replace(
                    { pathname: router.pathname, query: newQuery },
                    undefined,
                    { shallow: true }
                );
            }
            const filterParamsObj = { ...newQuery };
            delete filterParamsObj.action;
            delete filterParamsObj.id;
            const filterAsString = `?${new URLSearchParams(filterParamsObj).toString()}`;
        
            setFilterParams(filterAsString);
        }, 300);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [tableState, isReady]);

    useEffect(() => {
        if (!editPage) return;

        const { action, id } = query;

        if (action === 'update' && id) {
            dispatch(
                openModal({
                    component: editPage,
                    data: { id }
                })
            );
        } else if (action === 'create') {
            dispatch(
                openModal({
                    component: editPage,
                    data: null
                })
            );
        } else if (action === 'delete' && id) {
            dispatch(
                openModal({
                    component: 'DeleteModal',
                    data: { 
                        route: `/api/${apiRoute}/${id}`,
                        action: 'delete',
                        id: id
                    }
                })
            );
        } else {
            dispatch(closeModal());
        }
    }, [query, dispatch, editPage]);

    const handleRowAction = useCallback(
        (action: string, item: T | null) => {
            const { id } = item || { id: 0 };

            if (action === 'view') {
                updateQuery({ action: 'update', id: id });
            } else if (action === 'create') {
                updateQuery({ action: 'create' });
            } else if (action === 'delete') {
                updateQuery({ action: 'delete', id: id });
            }
        },
        [updateQuery, dispatch]
    );

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
            setTableState((prevState) => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    [key]: value || undefined
                },
                currentPage: 0
            }));
        },
        []
    );

    const handleSort = useCallback(
        (key: string) => {
            setTableState((prevState) => ({
                ...prevState,
                orderBy: key,
                orderDirection: prevState.orderBy === key && prevState.orderDirection === 'ASC' ? 'DESC' : 'ASC',
                currentPage: 0
            }));
        },
        []
    );

    const onEditInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, itemId: string, key: string) => {
            const value = e.target.value;
            setEditValues((prevEditValues) => ({
                ...prevEditValues,
                [itemId]: {
                    ...prevEditValues[itemId],
                    [key]: value
                }
            }));
        },
        []
    );

    const handleSave = useCallback(
        async (item: T, key: keyof T, value: any) => {
            item[key] = value;
            await onAction!(item, 'save');
            mutateData();
        },
        [editValues, onAction]
    );

    const handleCancel = useCallback((itemId: string) => {
        setEditValues((prevEditValues) => {
            const newEditValues = { ...prevEditValues };
            delete newEditValues[itemId];
            return newEditValues;
        });
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setTableState((prevState) => ({
            ...prevState,
            currentPage: page
        }));
        setSelectedItems({});
        setSelectAll(false);
    }, []);

    const handlePerPageChange = useCallback((perPage: number) => {
        setTableState((prevState) => ({
            ...prevState,
            perPage,
            currentPage: 0
        }));
        setSelectedItems({});
        setSelectAll(false);
    }, []);
    
    const numPages = useMemo(() => Math.ceil(total / tableState.perPage), [total, tableState.perPage, router]);
    
    const { currentPage, perPage, orderBy, orderDirection, filters } = tableState;

    const renderedData = useMemo(() => {
        if (isLoading) {
            return Array.from({ length: perPage }, (_, i) => (
                <tr key={i}>
                    <td>
                        <Checkbox
                            id='selectAll'
                            name='checkboxes'
                            onChange={(e) => handleSelectItem(e, null)}
                        ></Checkbox>
                    </td>
                    {columns.map((col, colIndex) => (
                        <td key={colIndex} data-label={col.label}>
                            {String(col.key).includes('image') ? (
                                <div className='avatar'>
                                    <img
                                        src={imageToCdnUrl({
                                            image: placeholderProductImageBg,
                                            type: 'table-avatar'
                                        })}
                                    />
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
                            <IconButton
                                onClick={() => handleRowAction('view', null)}
                                ariaLabel={'Düzenle'}
                                width={24}
                            >
                                <CiEdit />
                            </IconButton>
                            <IconButton
                                onClick={() => handleRowAction('delete', null)}
                                ariaLabel={'Sil'}
                                width={24}
                            >
                                <CiTrash />
                            </IconButton>
                        </div>
                    </td>
                </tr>
            ));
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
                {columns.map((col) => (
                    <td key={String(col.key)} data-label={col.label}>
                        {col.editable && (col.filterType || col.type === 'color')
                            ? (
                                <EditableInput
                                    name={`${String(col.key)}_${index}`}
                                    type={col.filterType || col.type}
                                    value={editValues[item.id]?.[col.key] || (item as any)[col.key]}
                                    onChange={(e) => onEditInputChange(e, String(item.id), String(col.key))}
                                    onSave={({value}) => handleSave(item, String(col.key), value)}
                                    onCancel={() => handleCancel(String(item.id))}
                                    options={col.options}
                                    render={
                                        col.render &&
                                        col.render({
                                            ...item,
                                            [col.key]:
                                                editValues[item.id]?.[col.key] ||
                                                (item as any)[col.key]
                                        })
                                    }
                                />
                            ) : (
                                <div className='ellipsis td-item'>
                                    {col.render ? col.render(item) : (item as any)[col.key]}
                                </div>
                            )}
                    </td>
                ))}
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
        mutateData,
    ]);

    return (
        <>
        <div className="table-header">
            <Button onClick={() => handleRowAction('create', null)} label='Yeni Ekle' />
        </div>
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
                                
                                {col.filterType 
                                    ? (
                                        <div className='th-filter'>
                                            {col.sort && (
                                                <span
                                                    role='button'
                                                    onClick={() => handleSort(col.key as string)}
                                                >
                                                    <SortButton
                                                        direction={orderBy === col.key ? (orderDirection as "ASC" | "DESC") : undefined}
                                                    />
                                                </span>
                                            )}
                                            {col.filterType === 'text' && (
                                                <Input
                                                    type='text'
                                                    name={`${col.label}`}
                                                    label={`${col.label}`}
                                                    value={filters[col.key as string] || ''}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            String(col.key),
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                            {col.filterType === 'number' && (
                                                <Input
                                                    type='number'
                                                    name={`${col.label}`}
                                                    label={`${col.label}`}
                                                    value={filters[col.key as string] || ''}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            String(col.key),
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                            {col.filterType === 'select' && col.options && (
                                                <MultipleSelectBox
                                                    label={`${col.label} Seç`}
                                                    options={col.options}
                                                    name={`${col.label}`}
                                                    value={filters[col.key as string] || ''}
                                                    onChange={(e: any) =>
                                                        handleFilterChange(
                                                            String(col.key),
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                            {col.filterType === 'date' && (
                                                <Input
                                                    type='date'
                                                    name={`${col.label}`}
                                                    label={`${col.label}`}
                                                    value={filters[col.key as string] || ''}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            String(col.key),
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                            {col.filterType === 'datetime' && (
                                                <Input
                                                    type='datetime-local'
                                                    name={`${col.label}`}
                                                    label={`${col.label}`}
                                                    value={filters[col.key as string] || ''}
                                                    onChange={(e) =>
                                                        handleFilterChange(
                                                            String(col.key),
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className='th-item'>
                                            {col.label}
                                            {col.sort && (
                                                <span
                                                    role='button'
                                                    onClick={() => handleSort(col.key as string)}
                                                >
                                                    <SortButton
                                                        direction={orderBy === col.key ? (orderDirection as "ASC" | "DESC") : undefined}
                                                    />
                                                </span>
                                            )}
                                        </div>
                                    )
                                }
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
                perPage={perPage}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                loading={isLoading}
            />
        </>
    );
};

export default Table;
