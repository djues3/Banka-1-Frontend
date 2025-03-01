import { useState, useMemo } from 'react';
import DataTable from './DataTable';

const SearchableDataTable = ({ columns, rows, checkboxSelection = false, onRowClick, actionButton }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter rows based on search term across all fields
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    
    return rows.filter(row => {
      // Search across all column fields
      return columns.some(column => {
        const fieldValue = String(row[column.field] || '').toLowerCase();
        return fieldValue.includes(searchTerm.toLowerCase());
      });
    });
  }, [rows, columns, searchTerm]);

  return (
    <div>
      {/* Search Bar and Action Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <div style={{ flexGrow: 1, marginRight: '10px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
        </div>
        {actionButton && actionButton}
      </div>
      <DataTable 
        rows={filteredRows} 
        columns={columns} 
        checkboxSelection={checkboxSelection}
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default SearchableDataTable;