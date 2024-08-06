import { Box } from "@mui/material";

import "./App.css";
import { DataTable } from "./components";

function App() {
  return (
    <Box sx={{ height: "100vh", bgcolor: "darkgray" }}>
      <DataTable />
    </Box>
  );
}

export default App;
