import React, { useState, useCallback, useMemo } from 'react';
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

const Table = <T extends { id: string | number; passive?: number }>({
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
    const numPages = useMemo(() => Math.ceil(totalItems / perPage), [totalItems, perPage]);
    const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [editValues, setEditValues] = useState<{ [key: string]: any }>(data);
    const [selectAll, setSelectAll] = useState(false);
    
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
            setFilters((prevFilters) => {
                const newFilters = { ...prevFilters };
                if (value) {
                    newFilters[key] = value;
                } else {
                    delete newFilters[key];
                }
                return newFilters;
            });

            if (onPageChange) {
                onPageChange(0);
            }

            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeout = setTimeout(() => {
                if (onFilterChange) {
                onFilterChange(filters);
                }
            }, 300);

            setDebounceTimeout(timeout);
        },
        [filters, onFilterChange, onPageChange, debounceTimeout]
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
            onPageChange?.(page);
            setSelectedItems({});
            setSelectAll(false);
        },
        [onPageChange]
    );

    const handleSort = useCallback(
        (key: string) => {
            const direction = filters.orderDirection === 'ASC' ? 'DESC' : 'ASC';

            const updatedFilters = {
                ...filters,
                orderBy: key,
                orderDirection: direction,
            };

            setFilters(updatedFilters);

            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeout = setTimeout(() => {
                if (onFilterChange) {
                    onFilterChange(updatedFilters);
                }
            }, 300);

            setDebounceTimeout(timeout);
        },
        [filters, onFilterChange, debounceTimeout]
    );

  const renderedData = useMemo(() => {
    if (loading) {
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
                        <IconButton onClick={() => onRowAction && onRowAction('view', null)} ariaLabel={'Düzenle'} width={24}>
                            <CiEdit />
                        </IconButton>
                        <IconButton onClick={() => onRowAction && onRowAction('delete', null)} ariaLabel={'Sil'} width={24}>
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
    ));
  }, [
    data,
    loading,
    perPage,
    columns,
    handleSelectItem,
    selectedItems,
    editValues,
    onEditInputChange,
    handleSave,
    handleCancel,
    handleFilterChange,
    onRowAction,
  ]);

  return (
    <>
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
        loading={loading}
      />
    </>
  );
};

export default Table;
