import { Box } from "@mui/material";

import "./App.css";
import { DataTable, PivotTable, Tabs } from "./components";

function App() {
  return (
    <Box>
      <Tabs tableView={<DataTable />} pivotView={<PivotTable />} />
    </Box>
  );
}

export default App;
