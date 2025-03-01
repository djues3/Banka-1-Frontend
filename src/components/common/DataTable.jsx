import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const paginationModel = { page: 0, pageSize: 5 };

const DataTable = ({columns, rows, checkboxSelection = false, onRowClick}) => {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection={checkboxSelection}
        sx={{ border: 0 }}
        onRowClick={(params) => onRowClick && onRowClick(params.row)}
      />
    </Paper>
  );
}

export default DataTable;