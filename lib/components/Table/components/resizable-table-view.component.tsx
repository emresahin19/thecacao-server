// import React, { useState, useRef, useEffect } from 'react';
// import lodash from 'lodash';
// import Checkbox from '../../Input/components/checkbox.component';
// import EditableInput from '../../Input/components/editable-input.component';
// import IconButton from '../../Button/components/icon-button.component';
// import CiEdit from 'lib/assets/icon/svg/CiEdit.svg';
// import CiTrash from 'lib/assets/icon/svg/CiTrash.svg';
// import SortButton from './sort-button.component';
// import MultipleSelectBox from 'lib/components/Input/components/multiple-selectbox.component';
// import Input from '../../Input/components/input.component';
// import { TableViewProps } from '../table.props';

// const TableView = <T extends { id: string | number; passive?: number; [key: string]: any }>({
//     items,
//     columns,
//     className,
//     selectedItems,
//     selectAll,
//     orderBy,
//     orderDirection,
//     filters,
//     handleSelectItem,
//     handleSelectAllItems,
//     handleFilterChange,
//     handleSort,
//     handleRowAction,
//     editValues,
//     onEditInputChange,
//     handleSave,
//     handleCancel,
//     isLoading,
//     perPage,
//     onUpdateColumns,
// }: TableViewProps<T>) => {
//     const fixedColumns = {
//         first: { inputKey: 'select', label: '', width: 5 },
//         last: { inputKey: 'actions', label: '', width: 10 },
//     };
//     const tableRef = useRef<HTMLUListElement>(null);

//     const resizableColumns = columns.filter(
//         (col) => col.inputKey !== fixedColumns.first.inputKey && col.inputKey !== fixedColumns.last.inputKey
//     );

//     useEffect(() => {
//         const totalWflex = resizableColumns.reduce((sum, col) => sum + (col.wflex || 1), 0);
//         const normalizedColumnWidths = resizableColumns.reduce((acc, col) => {
//             acc[col.inputKey] = ((col.wflex || 0) / totalWflex) * 85;
//             return acc;
//         }, {} as { [key: string]: number });
//         setColumnWidths(normalizedColumnWidths);
//     }, [columns]);

//     const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
//         resizableColumns.reduce((acc, col) => {
//             acc[col.inputKey] = col.wflex || (85 / resizableColumns.length);
//             return acc;
//         }, {} as { [key: string]: number })
//     );

//     const isDragging = useRef(false);
//     const dragColumnKey = useRef<string | null>(null);
//     const startX = useRef<number>(0);
//     const startWidth = useRef<number>(0);
//     const adjacentWidth = useRef<number>(0);

//     useEffect(() => {
//         const handleMouseMove = (e: MouseEvent) => {
//             if (!isDragging.current || !dragColumnKey.current) return;

//             const deltaX = e.clientX - startX.current;
//             if (!tableRef.current) return;
//             const tableWidth = tableRef.current.getBoundingClientRect().width;
//             const deltaPercent = (deltaX / tableWidth) * 85;
            
//             let newWidth = startWidth.current + deltaPercent
//             if(newWidth < 5 ) return;

//             let newAdjacentWidth = adjacentWidth.current - deltaPercent;

//             setColumnWidths((prev) => ({
//                 ...prev,
//                 [dragColumnKey.current!]: newWidth,
//                 [getAdjacentColumnKey(dragColumnKey.current!)]: newAdjacentWidth,
//             }));
//         };

//         const handleMouseUp = () => {
//             if (isDragging.current) {
//                 isDragging.current = false;
//                 dragColumnKey.current = null;
//             }
//         };

//         window.addEventListener('mousemove', handleMouseMove);
//         window.addEventListener('mouseup', handleMouseUp);

//         return () => {
//             window.removeEventListener('mousemove', handleMouseMove);
//             window.removeEventListener('mouseup', handleMouseUp);
//         };
//     }, [columnWidths, resizableColumns]);

//     const getAdjacentColumnKey = (key: string): string => {
//         const index = resizableColumns.findIndex((col) => col.inputKey === key);
//         if(resizableColumns.length - index <  2){
//             return resizableColumns[index - 2].inputKey
//         }
//         if (index === -1) {
//             return resizableColumns[index === -1 ? 0 : index - 1].inputKey;
//         }
//         return resizableColumns[index + 1].inputKey;
//     };

//     const handleMouseDown = (e: React.MouseEvent, colKey: string) => {
//         e.preventDefault();
//         isDragging.current = true;
//         dragColumnKey.current = colKey;
//         startX.current = e.clientX;
//         startWidth.current = columnWidths[colKey];
//         const adjacentKey = getAdjacentColumnKey(colKey);
//         adjacentWidth.current = columnWidths[adjacentKey];
//     };

//     // Calculate flex style for resizable columns
//     const getFlexStyle = (key: string): React.CSSProperties => {
//         const wflex = columnWidths[key] || (85 / resizableColumns.length);
//         return {
//             flex: `0 0 ${wflex}%`,
//             maxWidth: `${wflex}%`,
//         };
//     };

//     const Resizer = (key: string) => {
//         return (
//             <div
//                 className="lt-wrange"
//                 onMouseDown={(e) => handleMouseDown(e, key)}
//             />
//         );
//     };

//     // Render fixed columns separately
//     const renderFixedColumn = (fixed: { inputKey: string; label: string; width: number }, type: 'first' | 'last') => (
//         <li
//             className={`lt-cell lt-th`}
//             key={`${fixed.inputKey}-${type}`}
//             style={{
//                 flex: `0 0 ${fixed.width}%`,
//                 maxWidth: `${fixed.width}%`,
//             }}
//         >
//             {type === 'first' ? (
//                 <Checkbox
//                     id="selectAll"
//                     name="checkboxes"
//                     onChange={handleSelectAllItems}
//                     checked={selectAll}
//                 />
//             ) : (
//                 <div className="button-area">
//                     <IconButton
//                         className="text-success"
//                         onClick={() => handleRowAction('view', null)}
//                         ariaLabel={'Düzenle'}
//                         width={24}
//                     >
//                         <CiEdit />
//                     </IconButton>
//                     <IconButton
//                         className="text-danger"
//                         onClick={() => handleRowAction('delete', null)}
//                         ariaLabel={'Sil'}
//                         width={24}
//                     >
//                         <CiTrash />
//                     </IconButton>
//                 </div>
//             )}
//         </li>
//     );

//     // Render resizable columns
//     const renderResizableColumn = (col: any) => (
//         <li 
//             className="lt-cell lt-th" 
//             key={`${col.inputKey}-header`} 
//             data-key={col.inputKey}
//             style={getFlexStyle(col.inputKey)}
//         >
//             {col.filterType ? (
//                 <div className="th-filter">
//                     {col.sort && (
//                         <span role="button" onClick={() => handleSort(col.inputKey)}>
//                             <SortButton
//                                 direction={
//                                     orderBy === col.inputKey ? (orderDirection as 'ASC' | 'DESC') : undefined
//                                 }
//                             />
//                         </span>
//                     )}
//                     {col.filterType === 'text' && (
//                         <Input
//                             type="text"
//                             name={`${col.label}-filter`}
//                             label={`${col.label}`}
//                             value={filters[col.inputKey] || ''}
//                             onChange={(e) => handleFilterChange(col.inputKey, e.target.value)}
//                         />
//                     )}
//                     {col.filterType === 'number' && (
//                         <Input
//                             type="number"
//                             name={`${col.label}-filter`}
//                             label={`${col.label}`}
//                             value={filters[col.inputKey] || ''}
//                             onChange={(e) => handleFilterChange(col.inputKey, e.target.value)}
//                         />
//                     )}
//                     {col.filterType === 'select' && col.options && (
//                         <MultipleSelectBox
//                             label={`${col.label} Seç`}
//                             options={col.options}
//                             name={`${col.label}-filter`}
//                             value={filters[col.inputKey] || ''}
//                             onChange={(e: any) => handleFilterChange(col.inputKey, e.target.value)}
//                         />
//                     )}
//                     {col.filterType === 'date' && (
//                         <Input
//                             type="date"
//                             name={`${col.label}-filter`}
//                             label={`${col.label}`}
//                             value={filters[col.inputKey] || ''}
//                             onChange={(e) => handleFilterChange(col.inputKey, e.target.value)}
//                         />
//                     )}
//                     {col.filterType === 'datetime' && (
//                         <Input
//                             type="datetime-local"
//                             name={`${col.label}-filter`}
//                             label={`${col.label}`}
//                             value={filters[col.inputKey] || ''}
//                             onChange={(e) => handleFilterChange(col.inputKey, e.target.value)}
//                         />
//                     )}
//                 </div>
//             ) : (
//                 <div className="th-item">
//                     {col.label}
//                     {col.sort && (
//                         <span role="button" onClick={() => handleSort(col.inputKey)}>
//                             <SortButton
//                                 direction={
//                                     orderBy === col.inputKey && (orderDirection as 'ASC' | 'DESC') || undefined
//                                 }
//                             />
//                         </span>
//                     )}
//                 </div>
//             )}
//             {Resizer(col.inputKey)}
//         </li>
//     );

//     // Render table headers
//     const renderTableHeaders = () => (
//         <li className="lt-thead">
//             <ul className="lt-thead-tr">
//                 {renderFixedColumn(fixedColumns.first, 'first')}
//                 {resizableColumns.map((col) => renderResizableColumn(col))}
//                 {renderFixedColumn(fixedColumns.last, 'last')}
//             </ul>
//         </li>
//     );

//     // Render table body rows
//     const renderTableBody = () => (
//         isLoading
//             ? skeletonRow()
//             : items.map((item, index) => (
//                 <li className="lt-tbody" key={item.id}>
//                     <ul className="lt-tbody-tr">
//                         {/* Render fixed first column */}
//                         <li
//                             className={`lt-cell lt-td ${item.passive ? 'passive-row' : ''}`}
//                             style={{
//                                 flex: `0 0 ${fixedColumns.first.width}%`,
//                                 maxWidth: `${fixedColumns.first.width}%`,
//                             }}
//                         >
//                             <Checkbox
//                                 id={`select-${item.id}`}
//                                 name="checkboxes"
//                                 onChange={(e) => handleSelectItem(e, item)}
//                                 checked={!!selectedItems[item.id]}
//                             />
//                         </li>
//                         {/* Render resizable columns */}
//                         {resizableColumns.map((col) => (
//                             <li
//                                 className={`lt-cell lt-td`}
//                                 key={`${item.id}-${col.inputKey}`}
//                                 style={getFlexStyle(col.inputKey)}

//                             >
//                                 {col.editable && (col.filterType || col.type === 'color') ? (
//                                     <EditableInput
//                                         name={`${col.inputKey}_${index}`}
//                                         type={col.filterType || 'color'}
//                                         value={lodash.get(editValues[item.id], col.inputKey) || lodash.get(item, col.inputKey)}
//                                         onChange={(e) => onEditInputChange(e, String(item.id), col.inputKey)}
//                                         onSave={({ value }) => handleSave(item, col.inputKey, value)}
//                                         onCancel={() => handleCancel(String(item.id))}
//                                         options={col.options}
//                                         render={
//                                             col.render &&
//                                             col.render({
//                                                 ...item,
//                                                 [col.inputKey]: lodash.get(editValues[item.id], col.inputKey) || lodash.get(item, col.inputKey),
//                                             })
//                                         }
//                                     />
//                                 ) : (
//                                     <div className={`ellipsis ${(col.inputKey).includes('image') ? 'avatar' : ''}`}>
//                                         {col.render ? col.render(item) : lodash.get(item, col.inputKey)}
//                                     </div>
//                                 )}
//                             </li>
//                         ))}
//                         {/* Render fixed last column */}
//                         <li
//                             className="lt-cell lt-td"
//                             style={{
//                                 flex: `0 0 ${fixedColumns.last.width}%`,
//                                 maxWidth: `${fixedColumns.last.width}%`,
//                             }}
//                         >
//                             <div className="button-area">
//                                 <IconButton
//                                     className="text-success"
//                                     onClick={() => handleRowAction('view', item)}
//                                     ariaLabel={'Düzenle'}
//                                     width={24}
//                                 >
//                                     <CiEdit />
//                                 </IconButton>
//                                 <IconButton
//                                     className="text-danger"
//                                     onClick={() => handleRowAction('delete', item)}
//                                     ariaLabel={'Sil'}
//                                     width={24}
//                                 >
//                                     <CiTrash />
//                                 </IconButton>
//                             </div>
//                         </li>
//                     </ul>
//                 </li>
//             ))
//     );

//     // Render skeleton rows while loading
//     const skeletonRow = () => Array.from({ length: perPage }).map((_, i) => (
//         <li className="lt-tbody" key={i}>
//             <ul className="lt-tbody-tr">
//                 {/* Fixed first column skeleton */}
//                 <li className="lt-cell lt-td" style={{
//                     flex: `0 0 ${fixedColumns.first.width}%`,
//                     maxWidth: `${fixedColumns.first.width}%`,
//                 }}>
//                     <Checkbox
//                         id={`skeleton-select-${i}`}
//                         name="checkboxes"
//                         onChange={(e) => handleSelectItem(e, null)}
//                     />
//                 </li>
//                 {/* Resizable columns skeleton */}
//                 {resizableColumns.map((col) => (
//                     <li
//                         className={`lt-cell lt-td`}
//                         key={`skeleton-${col.inputKey}-${i}`}
//                         data-key={col.inputKey}
//                     >
//                         <div className={`ellipsis td-item ${(col.inputKey).includes('image') ? 'avatar' : ''}`} />
//                     </li>
//                 ))}
//                 <li className="lt-cell lt-td" style={{
//                     flex: `0 0 ${fixedColumns.last.width}%`,
//                     maxWidth: `${fixedColumns.last.width}%`,
//                 }}>
//                     <div className="button-area">
//                         <IconButton
//                             className="text-success"
//                             ariaLabel={'Düzenle'}
//                             width={24}
//                             onClick={() => {}}
//                             disabled
//                         >
//                             <CiEdit />
//                         </IconButton>
//                         <IconButton
//                             className="text-danger"
//                             ariaLabel={'Sil'}
//                             width={24}
//                             onClick={() => {}}
//                             disabled
//                         >
//                             <CiTrash />
//                         </IconButton>
//                     </div>
//                 </li>
//             </ul>
//         </li>
//     ));

//     // Handler to save updated column widths
//     // const handleSaveWidths = () => {
//     //     // Ensure that resizable columns' widths sum to 100%
//     //     const totalWidth = Object.values(columnWidths).reduce((sum, w) => sum + w, 0);
//     //     if (Math.abs(totalWidth - 85) > 0.1) { // Allowing minor floating point discrepancies
//     //         alert('Total resizable column widths must sum up to 100%. Please adjust the column widths.');
//     //         return;
//     //     }
//     //     // Update columns with new wflex values
//     //     const updatedColumns = columns.map((col) => {
//     //         if (col.inputKey !== fixedColumns.first.inputKey && col.inputKey !== fixedColumns.last.inputKey) {
//     //             return {
//     //                 ...col,
//     //                 wflex: columnWidths[col.inputKey],
//     //             };
//     //         }
//     //         return col;
//     //     });
//     //     if (onUpdateColumns) {
//     //         onUpdateColumns(updatedColumns);
//     //     }
//     // };

//     // Handler to cancel resizing and reset widths
//     // const handleCancelWidths = () => {
//     //     const normalizedColumnWidths = resizableColumns.reduce((acc, col) => {
//     //         acc[col.inputKey] = (col.wflex || (85 / resizableColumns.length));
//     //         return acc;
//     //     }, {} as { [key: string]: number });
//     //     setColumnWidths(normalizedColumnWidths);
//     // };

//     return (
//         <div className="table-container">
//             {/* <div className="resize-actions">
//                 <button
//                     onClick={handleSaveWidths}
//                     disabled={Math.abs(Object.values(columnWidths).reduce((sum, w) => sum + w, 0) - 85) > 0.1}
//                     style={{ marginRight: '10px' }}
//                 >
//                     Save
//                 </button>
//                 <button onClick={handleCancelWidths}>Cancel</button>
//             </div> */}
//             <ul className={`list-table ${className || ''}`} ref={tableRef}>
//                 {renderTableHeaders()}
//                 {renderTableBody()}
//             </ul>
//         </div>
//     );
// };

// export default TableView;
