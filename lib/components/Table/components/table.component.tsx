"use client";
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ColumnProps, TableProps, UseTableDataProps } from '../table.props';
import Pagination from '../../Table/components/pagination.component';
import { useRouter } from 'next/router';
import lodash from 'lodash';
import { useDispatch } from 'react-redux';
import { openModal, closeModal } from 'lib/store/modal.slice';
import { useAppSelector } from 'lib/store';
import Button from '../../Button/components/button.component';
import ListTableView from './list-table-view.component';
import { useTableData } from '../../../hooks';
import { saveItem } from 'lib/services';
import { useToast } from 'lib/contexts';
import Badge from '../../Badge/components/badge.component';
import IconButton from 'lib/components/Button/components/icon-button.component';
import TbFileExport from 'lib/assets/icon/svg/TbFileExport.svg';
import MdOutlineCancel from 'lib/assets/icon/svg/MdOutlineCancel.svg';
import Divider from 'lib/components/Layout/components/dash/divider.component';

const Table = <T extends { id: number; passive?: number; [key: string]: any }>({
    className = '',
    editPage = 'EditCard',
    apiRoute,
    fields,
    onAction,
    onCheckboxChange,
    isFormData = false,
}: TableProps<T>) => {

    const columns = useMemo<ColumnProps<T>[]>(() => {
        return fields
            .filter(field => field.property === 'view' || field.property === 'all')
            .map((field) => ({
                key: field.key,
                subKey: field.subKey,
                inputKey: field.subKey ? `${String(field.key)}.${String(field.subKey)}` : String(field.key),
                label: field.label,
                sort: field.sort ?? false,
                defaultSort: field.defaultSort,
                render: field.render,
                type: field.type,
                filterType: field.filterType,
                options: field.options,
                editable: field.editable ?? false, 
            }));
    }, [fields]);

    const editFields = useMemo<ColumnProps<T>[]>(() => {
        return fields
            .filter(field => field.property === 'edit' || field.property === 'all')
            .map(field => ({
                key: field.key,
                subKey: field.subKey,
                inputKey: field.subKey ? `${String(field.key)}.${String(field.subKey)}` : String(field.key),
                defaultValue: field.defaultValue,
                label: field.label,
                type: field.type,
                options: field.options,
                required: field.required || false,
                inputData: field.inputData,
            }));
    }, [fields]);

    const [tableState, setTableState] = useState<{
        currentPage: number;
        perPage: number;
        orderBy: string;
        orderDirection: string;
        filters: { [key: string]: any };
    }>({
        currentPage: 0,
        perPage: 20,
        orderBy: columns.find((col: ColumnProps<T>) => col.defaultSort)?.key as string,
        orderDirection: columns.find((col: ColumnProps<T>) => col.defaultSort)?.defaultSort || 'ASC',
        filters: {}
    });
    const initialParams = useMemo(() => {
        const { currentPage, perPage, orderBy, orderDirection } = tableState;
        const filterParamsObj = {
            page: String(currentPage + 1),
            perPage: String(perPage),
            orderBy,
            orderDirection
        };
        return `${apiRoute}?${new URLSearchParams(filterParamsObj).toString()}`
    }, [tableState]);

    const router = useRouter();
    const { query, isReady } = router;

    const dispatch = useDispatch();
    const { show } = useAppSelector((state) => state.modal);

    const [filterParams, setFilterParams] = useState<string>(initialParams);
    const [selectedItems, setSelectedItems] = useState<{[key: string]: {id: number; name: string;}}>({});
    const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
    const [selectAll, setSelectAll] = useState(false);
    const prevShowRef = useRef<boolean>(show || false);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { showToast, handleRequestError } = useToast();

    const filterKeys = useMemo(
        () => columns.filter((col) => col.filterType).map((col: ColumnProps<T>) => col.inputKey),
        [columns]
    );

    const { items, total = 0, isLoading = false, mutateData } = useTableData<T>(filterParams) 

    const allSelected = useMemo(() => {
        return items.every(item => selectedItems[item.id]);
    }, [items, selectedItems]);
    
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
            if (key && query[key] !== undefined) {
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
                if (!key) return;
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
            const filterAsString = `${apiRoute}?${new URLSearchParams(filterParamsObj).toString()}`;

            setFilterParams(filterAsString);
        }, 300);

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [tableState, isReady]);

    useEffect(() => {
        const { action, id } = query;

        if (action === 'update' && id) {
            dispatch(
                openModal({
                    component: editPage,
                    data: { id, fields: editFields, route: apiRoute, isFormData }
                })
            );
        } else if (action === 'create') {
            dispatch(
                openModal({
                    component: editPage,
                    data: { fields: editFields, route: apiRoute, isFormData }
                })
            );
        } else if (action === 'delete' && id) {
            dispatch(
                openModal({
                    component: 'DeleteModal',
                    data: { 
                        route: apiRoute,
                        action: 'delete',
                        id: id
                    }
                })
            );
        } else if (action === 'export') {
            dispatch(
                openModal({
                    component: 'ExportCard',
                    className: 'export-card',
                    data: { 
                        items: selectedItems,
                        route: apiRoute,
                    }
                })
            );
        } else {
            dispatch(closeModal());
        }
    }, [query, dispatch, editPage, editFields]);

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
            const itemId = item.id;
            const itemName = item.name;

            setSelectedItems((prevSelectedItems) => {
                const newSelectedItems = { ...prevSelectedItems };
                if (checked) {
                    newSelectedItems[itemId] = { id: itemId, name: itemName };
                } else {
                    delete newSelectedItems[itemId];
                }
                onCheckboxChange && onCheckboxChange(newSelectedItems);
                return newSelectedItems;
            });
        },
        [onCheckboxChange]
    );

    const handleSelectAllItems = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            setSelectAll(checked);

            setSelectedItems((prevSelectedItems) => {
                const newSelectedItems = { ...prevSelectedItems };
                if (checked) {
                    items.forEach((item) => {
                        newSelectedItems[item.id] = { id: item.id, name: item.name };
                    });
                } else {
                    items.forEach((item) => {
                        delete newSelectedItems[item.id];
                    });
                }
                onCheckboxChange && onCheckboxChange(newSelectedItems);
                return newSelectedItems;
            });
        },
        [items, onCheckboxChange]
    );

    const clearAllSelections = useCallback(() => {
        setSelectedItems({});
        setSelectAll(false);
        onCheckboxChange && onCheckboxChange({});
    }, [onCheckboxChange]);

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
        (e: React.ChangeEvent<HTMLInputElement>, itemId: string, inputKey: string) => {
            const value = e.target.value;
            setEditValues((prevEditValues) => {
                const newItemEditValues = { ...prevEditValues[itemId] };
                lodash.set(newItemEditValues, inputKey, value);
                return {
                    ...prevEditValues,
                    [itemId]: newItemEditValues,
                };
            });
        },
        []
    );

    const handleSave = useCallback(
        async (item: T, inputKey: string, value: any, callback?: ((status: boolean) => void)) => {
            if (!item) return;
            lodash.set(item, inputKey, value);
            try {
                const { data } = await saveItem<T>({ id: Number(item.id), route: apiRoute, item, isFormData });
                const { status, message }: { status: boolean, message: string } = data as any;
                callback && callback(status);
                showToast({ message, type: status ? 'success' : 'danger' });
            } catch (error: any) {
                handleRequestError(error);
            } finally {
                mutateData();
            }
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
        // setSelectedItems({});
        setSelectAll(false);
    }, []);

    const handlePerPageChange = useCallback((perPage: number) => {
        setTableState((prevState) => ({
            ...prevState,
            perPage,
            currentPage: 0
        }));
        // setSelectedItems({});
        setSelectAll(false);
    }, []);

    const handleRemoveSelectedItem = useCallback((itemId: number) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = { ...prevSelectedItems };
            delete newSelectedItems[itemId];
            return newSelectedItems;
        });
    }, []);
    
    const numPages = useMemo(() => Math.ceil(total / tableState.perPage), [total, tableState.perPage, router]);
    
    const { currentPage, perPage, orderBy, orderDirection, filters } = tableState;

    return (
        <>
            <div className="table-header">
                {Object.values(selectedItems).length > 0 && (
                    <div className="selected-items-container">
                        <ul className="selected-list">
                            {Object.values(selectedItems).map(item => (
                                <li key={item.id}>
                                    <Badge onRemove={() => handleRemoveSelectedItem(item.id)}>{item.name}</Badge>
                                </li>
                            ))}
                        </ul>
                        <div className="selected-button-area">
                            <IconButton 
                                width={24} 
                                onClick={clearAllSelections} 
                            >
                                <MdOutlineCancel />
                            </IconButton>
                            <IconButton 
                                width={24} 
                                onClick={() => updateQuery({ action: 'export' })} 
                            >
                                <TbFileExport />
                            </IconButton>
                        </div>
                        <Divider />
                    </div>
                )}
                <Button onClick={() => handleRowAction('create', null)} label="Yeni Ekle" />
            </div>
            <ListTableView
                className={className}
                items={items}
                columns={columns}
                selectedItems={selectedItems}
                selectAll={selectAll}
                orderBy={orderBy}
                orderDirection={orderDirection}
                filters={filters}
                handleSelectItem={handleSelectItem}
                handleSelectAllItems={handleSelectAllItems}
                handleFilterChange={handleFilterChange}
                handleSort={handleSort}
                handleRowAction={handleRowAction}
                editValues={editValues}
                onEditInputChange={onEditInputChange}
                handleSave={handleSave}
                handleCancel={handleCancel}
                isLoading={isLoading}
                perPage={perPage}
            />
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
