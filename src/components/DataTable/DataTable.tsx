import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_TableInstance,
  MRT_ToggleFiltersButton,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { DateTime } from "luxon";

import useCSVParser from "../../hooks/useCSVParser";
import { Cancel, Search } from "@mui/icons-material";

export const DataTable = () => {
  const { data, loading, columns } = useCSVParser({
    url: "FMSCA_records.csv",
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [grouping, setGrouping] = useState<null | string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const parsedCols = useMemo(
    () =>
      [
        ...columns,
        {
          headerName: "Month",
          field: "dateMonth",
        },
        {
          headerName: "Year",
          field: "dateYear",
        },
      ].map((col) => ({
        ...col,
        header: col.headerName,
        accessorKey: col.field,
      })) as MRT_ColumnDef<any, string>[],
    [columns]
  );

  const parsedData = useMemo(
    () =>
      data.map((dataItem) => ({
        ...dataItem,
        created_dt: DateTime.fromJSDate(new Date(dataItem.created_dt)).toFormat(
          "dd LLL, yyyy hh:MM a"
        ),
        dateMonth: DateTime.fromJSDate(new Date(dataItem.created_dt)).toFormat(
          "LLLL"
        ),
        dateYear: DateTime.fromJSDate(new Date(dataItem.created_dt)).toFormat(
          "yyyy"
        ),
        data_source_modified_dt: DateTime.fromJSDate(
          new Date(dataItem.data_source_modified_dt)
        ).toFormat("dd LLL, yyyy hh:MM a"),
      })),
    [data]
  );

  const handleGrouping = (table: MRT_TableInstance<any>, group: string) => {
    switch (group) {
      case "Month":
        table.setGrouping(["dateMonth"]);
        setGrouping("Month");
        table.setColumnVisibility({ dateMonth: true, dateYear: false });
        break;
      case "Year":
        table.setGrouping(["dateYear"]);
        setGrouping("Year");
        table.setColumnVisibility({ dateYear: true, dateMonth: false });
        break;
      case "Day":
        table.setGrouping(["created_dt"]);
        setGrouping("Day");
        table.setColumnVisibility({ dateYear: false, dateMonth: false });
        break;
      default:
        setGrouping("");
        table.setGrouping([]);
        table.setColumnVisibility({ dateYear: false, dateMonth: false });
    }
    handleClose();
  };

  const table = useMaterialReactTable({
    columns: parsedCols,
    data: parsedData,
    enableGrouping: true,
    enableColumnResizing: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnDragging: false,
    enableGlobalFilter: true,
    state: {
      showGlobalFilter: true,
      density: "compact",
      isLoading: loading, //cell skeletons and loading overlay,
      showProgressBars: loading,
    },
    muiTableBodyRowProps: {
      sx: {
        fontSize: 14,
      },
    },
    muiTablePaperProps: {
      sx: { boxShadow: "2px 2px 10px gray", height: "100%" },
    },
    muiTableContainerProps: { sx: { height: "80%" } },
    renderTopToolbar: ({ table }) => {
      return (
        <Box
          sx={{
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4">FMSCA Table</Typography>

          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {showSearch && <MRT_GlobalFilterTextField table={table} />}

              <IconButton onClick={() => setShowSearch((prev) => !prev)}>
                {showSearch ? <Cancel /> : <Search />}
              </IconButton>

              <MRT_ToggleFiltersButton table={table} />

              <Button
                aria-controls="date-groupby-menu"
                aria-haspopup="true"
                onClick={handleClick}
                variant="contained"
                sx={{ textTransform: "unset" }}
              >
                Group By
              </Button>
              <Menu
                id="date-groupby-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {["Day", "Month", "Year", "Clear"].map((key) => {
                  return (
                    <MenuItem
                      selected={key === grouping}
                      onClick={() => handleGrouping(table, key)}
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: "#66b2ff",
                          color: "white",
                        },
                      }}
                    >
                      {key}
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          </Box>
        </Box>
      );
    },
    initialState: {
      columnVisibility: { dateMonth: false, dateYear: false },
    },
  });

  return (
    <Box
      sx={{
        p: "2rem",
        boxSizing: "border-box",
        height: "100%",
      }}
    >
      <MaterialReactTable table={table} />
    </Box>
  );
};
