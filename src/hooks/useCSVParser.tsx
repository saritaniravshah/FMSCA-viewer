import { useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";
import { GridColDef } from "@mui/x-data-grid";

import { visibleColumnsMapper } from "../utils/helpers";

interface UseCSVParserProps {
  url: string;
}

interface ParsedData {
  data: any[];
  errors: Error[];
  columns: GridColDef[];
  loading: boolean;
}

const useCSVParser = ({ url }: UseCSVParserProps): ParsedData => {
  const [data, setData] = useState<any[]>([]);
  const [errors, setErrors] = useState<Error[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<GridColDef[]>([]);

  useEffect(() => {
    setLoading(true);
    Papa.parse(url, {
      download: true,
      delimiter: ",",
      header: true,
      complete: (results: ParseResult<Record<string, string>>) => {
        setData(results.data);

        const csvColumns = Object.keys(results.data[0])
          .filter((key) => Object.keys(visibleColumnsMapper).includes(key))
          .map((key) => ({
            field: key,
            headerName: visibleColumnsMapper[key],
            width: 150,
            type: "string",
          })) as GridColDef[];

        setColumns(csvColumns);
        setLoading(false);
      },
      error: (error) => {
        setErrors([error]);
        setLoading(false);
      },
    });
  }, [url]);

  return { data, columns, errors, loading };
};

export default useCSVParser;
