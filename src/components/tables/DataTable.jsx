import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const paginationModel = { page: 0, pageSize: 5 };
// This component displays a table with the given columns and rows data
const DataTable = ({columns, rows, checkboxSelection = false, onRowClick}) => {
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        // autosizeOptions={{
        //   includeHeaders: true,
        //   includeOutliers: true,
        //   expand: true,
        //   }
        // }
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection={checkboxSelection}
        sx={{ border: 0 }}
        onRowDoubleClick={(params) => onRowClick && onRowClick(params.row)}
      />
    </Paper>
  );
}

export default DataTable;