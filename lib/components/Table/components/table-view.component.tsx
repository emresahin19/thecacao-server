// // TableView.tsx
// import React from 'react';
// import Checkbox from '../../Input/components/checkbox.component';
// import EditableInput from '../../Input/components/editable-input.component';
// import IconButton from '../../Button/components/icon-button.component';
// import CiEdit from 'lib/assets/icon/svg/CiEdit.svg';
// import CiTrash from 'lib/assets/icon/svg/CiTrash.svg';
// import SortButton from './sort-button.component';
// import { imageToCdnUrl } from '../../../utils';
// import { placeholderProductImageBg } from '../../../constants';
// import MultipleSelectBox from 'lib/components/Input/components/multiple-selectbox.component';
// import Input from '../../Input/components/input.component';
// import { TableViewProps } from '../table.props';

// const TableView = <T extends { id: string | number; passive?: number; [key: string]: any }>({
//   data,
//   columns,
//   className,
//   selectedItems,
//   selectAll,
//   orderBy,
//   orderDirection,
//   filters,
//   handleSelectItem,
//   handleSelectAllItems,
//   handleFilterChange,
//   handleSort,
//   handleRowAction,
//   editValues,
//   onEditInputChange,
//   handleSave,
//   handleCancel,
//   isLoading,
//   perPage,
// }: TableViewProps<T>) => {
//   const renderTableHeaders = () => (
//     <thead>
//       <tr>
//         <th>
//           <Checkbox
//             id="selectAll"
//             name="checkboxes"
//             onChange={handleSelectAllItems}
//             checked={selectAll}
//           />
//         </th>
//         {columns.map((col) => (
//           <th key={`${String(col.key)}-filter`}>
//             {col.filterType ? (
//               <div className="th-filter">
//                 {col.sort && (
//                   <span role="button" onClick={() => handleSort(col.key as string)}>
//                     <SortButton
//                       direction={
//                         orderBy === col.key ? (orderDirection as 'ASC' | 'DESC') : undefined
//                       }
//                     />
//                   </span>
//                 )}
//                 {col.filterType === 'text' && (
//                   <Input
//                     type="text"
//                     name={`${col.label}`}
//                     label={`${col.label}`}
//                     value={filters[col.key as string] || ''}
//                     onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
//                   />
//                 )}
//                 {col.filterType === 'number' && (
//                   <Input
//                     type="number"
//                     name={`${col.label}`}
//                     label={`${col.label}`}
//                     value={filters[col.key as string] || ''}
//                     onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
//                   />
//                 )}
//                 {col.filterType === 'select' && col.options && (
//                   <MultipleSelectBox
//                     label={`${col.label} Seç`}
//                     options={col.options}
//                     name={`${col.label}`}
//                     value={filters[col.key as string] || ''}
//                     onChange={(e: any) => handleFilterChange(String(col.key), e.target.value)}
//                   />
//                 )}
//                 {col.filterType === 'date' && (
//                   <Input
//                     type="date"
//                     name={`${col.label}`}
//                     label={`${col.label}`}
//                     value={filters[col.key as string] || ''}
//                     onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
//                   />
//                 )}
//                 {col.filterType === 'datetime' && (
//                   <Input
//                     type="datetime-local"
//                     name={`${col.label}`}
//                     label={`${col.label}`}
//                     value={filters[col.key as string] || ''}
//                     onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
//                   />
//                 )}
//               </div>
//             ) : (
//               <div className="th-item">
//                 {col.label}
//                 {col.sort && (
//                   <span role="button" onClick={() => handleSort(col.key as string)}>
//                     <SortButton
//                       direction={
//                         orderBy === col.key ? (orderDirection as 'ASC' | 'DESC') : undefined
//                       }
//                     />
//                   </span>
//                 )}
//               </div>
//             )}
//           </th>
//         ))}
//         <th />
//       </tr>
//     </thead>
//   );

//   // Render table body
//   const renderTableBody = () => {
//     if (isLoading) {
//       // Render loading state
//       return (
//         <tbody>
//           {Array.from({ length: perPage }, (_, i) => (
//             <tr key={i}>
//               <td>
//                 <Checkbox
//                   id="selectAll"
//                   name="checkboxes"
//                   onChange={(e) => handleSelectItem(e, null)}
//                 />
//               </td>
//               {columns.map((col, colIndex) => (
//                 <td key={colIndex} data-label={col.label}>
//                   {String(col.key).includes('image') ? (
//                     <div className="avatar">
//                       <img
//                         src={imageToCdnUrl({
//                           image: placeholderProductImageBg,
//                           type: 'table-avatar',
//                         })}
//                         alt="Placeholder"
//                       />
//                     </div>
//                   ) : (
//                     <div className="avatar">
//                       <div className="" />
//                     </div>
//                   )}
//                 </td>
//               ))}
//               <td>
//                 <div className="button-area">
//                   <IconButton
//                     onClick={() => handleRowAction('view', null)}
//                     ariaLabel={'Düzenle'}
//                     width={24}
//                   >
//                     <CiEdit />
//                   </IconButton>
//                   <IconButton
//                     onClick={() => handleRowAction('delete', null)}
//                     ariaLabel={'Sil'}
//                     width={24}
//                   >
//                     <CiTrash />
//                   </IconButton>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       );
//     }

//     // Render data rows
//     return (
//       <tbody>
//         {data.map((item, index) => (
//           <tr key={item.id} className={item.passive ? 'passive-row' : ''}>
//             <td>
//               <Checkbox
//                 id="selectAll"
//                 name="checkboxes"
//                 onChange={(e) => handleSelectItem(e, item)}
//                 checked={selectedItems[String(item.id)]}
//               />
//             </td>
//             {columns.map((col) => (
//               <td key={String(col.key)} data-label={col.label}>
//                 {col.editable && (col.filterType || col.type === 'color') ? (
//                   <EditableInput
//                     name={`${String(col.key)}_${index}`}
//                     type={col.filterType || 'color'}
//                     value={editValues[item.id]?.[col.key] || item[col.key]}
//                     onChange={(e) =>
//                       onEditInputChange(e, String(item.id), String(col.key))
//                     }
//                     onSave={({ value }) => handleSave(item, col.key, value)}
//                     onCancel={() => handleCancel(String(item.id))}
//                     options={col.options}
//                     render={
//                       col.render &&
//                       col.render({
//                         ...item,
//                         [col.key]: editValues[item.id]?.[col.key] || item[col.key],
//                       })
//                     }
//                   />
//                 ) : (
//                   <div className="ellipsis td-item">
//                     {col.render ? col.render(item) : item[col.key]}
//                   </div>
//                 )}
//               </td>
//             ))}
//             <td>
//               <div className="button-area">
//                 <IconButton
//                   className="text-success"
//                   onClick={() => handleRowAction('view', item)}
//                   ariaLabel={'Düzenle'}
//                   width={24}
//                 >
//                   <CiEdit />
//                 </IconButton>
//                 <IconButton
//                   className="text-danger"
//                   onClick={() => handleRowAction('delete', item)}
//                   ariaLabel={'Sil'}
//                   width={24}
//                 >
//                   <CiTrash />
//                 </IconButton>
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     );
//   };

//   return (
//     <table {...className && { className }}>
//       {renderTableHeaders()}
//       {renderTableBody()}
//     </table>
//   );
// };

// export default TableView;
