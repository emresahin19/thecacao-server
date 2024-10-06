import React from 'react';
import lodash from 'lodash'; // Import lodash
import Checkbox from '../../Input/components/checkbox.component';
import EditableInput from '../../Input/components/editable-input.component';
import IconButton from '../../Button/components/icon-button.component';
import CiEdit from 'lib/assets/icon/svg/CiEdit.svg';
import CiTrash from 'lib/assets/icon/svg/CiTrash.svg';
import SortButton from './sort-button.component';
import MultipleSelectBox from 'lib/components/Input/components/multiple-selectbox.component';
import Input from '../../Input/components/input.component';
import { TableViewProps } from '../table.props';

const TableView = <T extends { id: string | number; passive?: number; [key: string]: any }>({
    data,
    columns,
    className,
    selectedItems,
    selectAll,
    orderBy,
    orderDirection,
    filters,
    handleSelectItem,
    handleSelectAllItems,
    handleFilterChange,
    handleSort,
    handleRowAction,
    editValues,
    onEditInputChange,
    handleSave,
    handleCancel,
}: TableViewProps<T>) => {

    const renderTableHeaders = () => (
        <li className="lt-thead">
            <ul className="lt-thead-tr">
                <li className="lt-cell lt-th">
                    <Checkbox
                        id="selectAll"
                        name="checkboxes"
                        onChange={handleSelectAllItems}
                        checked={selectAll}
                    />
                </li>
                {columns.map((col) => (
                    <li className="lt-cell lt-th" key={`${String(col.key)}-filter`}>
                        {col.filterType ? (
                            <div className="th-filter">
                                {col.sort && (
                                    <span role="button" onClick={() => handleSort(col.key as string)}>
                                        <SortButton
                                            direction={
                                                orderBy === col.key ? (orderDirection as 'ASC' | 'DESC') : undefined
                                            }
                                        />
                                    </span>
                                )}
                                {col.filterType === 'text' && (
                                    <Input
                                        type="text"
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
                            </div>
                        ) : (
                            <div className="th-item">
                                {col.label}
                                {col.sort && (
                                    <span role="button" onClick={() => handleSort(String(col.key))}>
                                        <SortButton
                                            direction={orderBy === col.key && (orderDirection as 'ASC' | 'DESC') || undefined}
                                        />
                                    </span>
                                )}
                            </div>
                        )}
                    </li>
                ))}
                <li className="lt-cell lt-th" />
            </ul>
        </li>
    );

    const renderTableBody = () => data.map((item, index) => (
        <li className="lt-tbody" key={item.id}>
            <ul className="lt-tbody-tr">
                <li className={`lt-cell lt-td ${item.passive ? 'passive-row' : ''}`}>
                    <Checkbox
                        id="selectAll"
                        name="checkboxes"
                        onChange={(e) => handleSelectItem(e, item)}
                        checked={selectedItems[String(item.id)]}
                    />
                </li>
                {columns.map((col) => (
                    <li className="lt-cell lt-td" key={String(col.key)} data-label={col.label}>
                        {col.editable && (col.filterType || col.type === 'color') 
                            ? (
                                <EditableInput
                                    name={`${String(col.key)}_${index}`}
                                    type={col.filterType || 'color'}
                                    value={lodash.get(editValues[item.id], col.key as string) || lodash.get(item, col.key as string)}
                                    onChange={(e) =>
                                        onEditInputChange(e, String(item.id), String(col.key))
                                    }
                                    onSave={({ value }) => handleSave(item, col.key, value)}
                                    onCancel={() => handleCancel(String(item.id))}
                                    options={col.options}
                                    render={
                                        col.render &&
                                        col.render({
                                            ...item,
                                            [col.key]: lodash.get(editValues[item.id], col.key as string) || lodash.get(item, col.key as string),
                                        })
                                    }
                                />
                            ) : (
                                <div className={`ellipsis td-item ${(col.key as string).includes('image') && 'avatar' || '' }`}>
                                    {col.render ? col.render(item) : lodash.get(item, col.key as string)}
                                </div>
                            )}
                    </li>
                ))}
                <li className="lt-cell lt-td">
                    <div className="button-area">
                        <IconButton
                            className="text-success"
                            onClick={() => handleRowAction('view', item)}
                            ariaLabel={'Düzenle'}
                            width={24}
                        >
                            <CiEdit />
                        </IconButton>
                        <IconButton
                            className="text-danger"
                            onClick={() => handleRowAction('delete', item)}
                            ariaLabel={'Sil'}
                            width={24}
                        >
                            <CiTrash />
                        </IconButton>
                    </div>
                </li>
            </ul>
        </li>
    ))

    return (
        <ul className={`list-table ${className || ''}`}>
            {renderTableHeaders()}
            {renderTableBody()}
        </ul>
    );
};

export default TableView;
