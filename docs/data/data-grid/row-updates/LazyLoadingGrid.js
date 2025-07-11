import * as React from 'react';
import debounce from '@mui/utils/debounce';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { createFakeServer, loadServerRows } from '@mui/x-data-grid-generator';

const DATASET_OPTION = {
  dataSet: 'Employee',
  rowLength: 10000,
};

const { columnsWithDefaultColDef, useQuery, ...data } =
  createFakeServer(DATASET_OPTION);

const emptyObject = {};

export default function LazyLoadingGrid() {
  // dataServerSide simulates your database.
  const { rows: rowsServerSide } = useQuery(emptyObject);

  const apiRef = useGridApiRef();
  const [initialRows, setInitialRows] = React.useState([]);
  const [rowCount, setRowCount] = React.useState(0);
  const fetchReference = React.useRef(0);

  const fetchRow = React.useCallback(
    async (params) => {
      const serverRows = await loadServerRows(
        rowsServerSide,
        {
          filterModel: params.filterModel,
          sortModel: params.sortModel,
        },
        {
          minDelay: 300,
          maxDelay: 800,
          useCursorPagination: false,
        },
        columnsWithDefaultColDef,
      );

      return {
        slice: serverRows.returnedRows.slice(
          params.firstRowToRender,
          params.lastRowToRender,
        ),
        total: serverRows.returnedRows.length,
      };
    },
    [rowsServerSide],
  );

  // The initial fetch request of the viewport.
  React.useEffect(() => {
    if (rowsServerSide.length === 0) {
      return;
    }

    (async () => {
      const { slice, total } = await fetchRow({
        firstRowToRender: 0,
        lastRowToRender: 10,
        sortModel: [],
        filterModel: {
          items: [],
        },
      });

      setInitialRows(slice);
      setRowCount(total);
    })();
  }, [rowsServerSide, fetchRow]);

  // Fetch rows as they become visible in the viewport
  const handleFetchRows = React.useCallback(
    async (params) => {
      const reference = fetchReference.current;
      const { slice, total } = await fetchRow(params);
      if (reference !== fetchReference.current) {
        return;
      }

      apiRef.current?.unstable_replaceRows(params.firstRowToRender, slice);
      setRowCount(total);
    },
    [apiRef, fetchRow],
  );

  const debouncedHandleFetchRows = React.useMemo(
    () => debounce(handleFetchRows, 200),
    [handleFetchRows],
  );

  const handleModelChange = React.useCallback(() => {
    fetchReference.current += 1;
    setInitialRows([]);
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={initialRows}
        {...data}
        apiRef={apiRef}
        hideFooterPagination
        rowCount={rowCount}
        sortingMode="server"
        filterMode="server"
        rowsLoadingMode="server"
        onFetchRows={debouncedHandleFetchRows}
        onSortModelChange={handleModelChange}
        onFilterModelChange={handleModelChange}
      />
    </div>
  );
}
