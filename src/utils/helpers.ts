interface FormattedData {
  month: string;
  [entityType: string]: number;
}

interface MonthEntityCount {
  [month: string]: {
    [entityType: string]: number;
  };
}

export const visibleColumnsMapper: Record<string, string> = {
  created_dt: "Created_DT",
  data_source_modified_dt: "Modifed_DT",
  entity_type: "Entity",
  operating_status: "Operating status",
  legal_name: "Legal name",
  dba_name: "DBA name",
  physical_address: "Physical address",
  phone: "Phone",
  usdot_number: "DOT",
  mc_mx_ff_number: "MC/MX/FF",
  power_units: "Power units",
  out_of_service_date: "Out of service date",
};

export const aggregateData = (data: any[]): MonthEntityCount => {
  const monthEntityCount: MonthEntityCount = {};

  data.forEach(({ created_dt, entity_type }) => {
    const date = new Date(created_dt);
    const month = date.toLocaleString("en-US", { month: "long" }); // e.g., 'Jan', 'Feb'

    if (!monthEntityCount[month]) {
      monthEntityCount[month] = {};
    }

    monthEntityCount[month][entity_type] =
      (monthEntityCount[month][entity_type] || 0) + 1;
  });

  return monthEntityCount;
};

export const transformToFormattedData = (
  monthEntityCount: MonthEntityCount,
  allEntityTypes: string[]
): FormattedData[] => {
  return Object.keys(monthEntityCount).map((month) => {
    const counts = monthEntityCount[month];

    // Create an entry object with default values for all entity types
    const entry: FormattedData = { month };

    allEntityTypes.forEach((type) => {
      entry[type] = counts[type] || 0;
    });

    return entry;
  });
};

export const collectEntityTypes = (data: any) => {
  const entityTypes = new Set();

  data.forEach(({ entity_type }: { entity_type: any }) => {
    entityTypes.add(entity_type);
  });

  return Array.from(entityTypes);
};

const getMonthWiseDataCount = (parsedData: any[]) => {
  const monthWiseDataCount = parsedData.reduce((acc, curr) => {
    const month = curr.dateMonth;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(monthWiseDataCount).map((dataKey) => ({
    month: dataKey,
    count: monthWiseDataCount[dataKey],
  }));
};

const getYearWiseDataCount = (parsedData: any[]) => {
  const yearWiseDataCount = parsedData.reduce((acc, curr) => {
    const year = curr.dateYear;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(yearWiseDataCount).map((dataKey) => ({
    year: dataKey,
    count: yearWiseDataCount[dataKey],
  }));
};

const getWeekWiseDataCount = (parsedData: any[]) => {
  const weekWiseDataCount = parsedData.reduce((acc, curr) => {
    const week = curr.dateWeek;
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(weekWiseDataCount).map((dataKey) => ({
    week: dataKey,
    count: weekWiseDataCount[dataKey],
  }));
};

export const pivotChartData: Record<string, unknown> = {
  Week: getWeekWiseDataCount,
  Month: getMonthWiseDataCount,
  Year: getYearWiseDataCount,
};
