import { ReactNode } from "react";
import { Tab, TabPanel, TabsList } from "./Tabs.styled";
import { Tabs as BaseTabs } from "@mui/base";

interface ITabsProps {
  tableView: ReactNode;
  pivotView: ReactNode;
}

export const Tabs = ({ pivotView, tableView }: ITabsProps) => {
  return (
    <BaseTabs defaultValue={0}>
      <TabsList>
        <Tab value={0}>Table View</Tab>
        <Tab value={1}>Pivot Table View</Tab>
      </TabsList>
      <TabPanel value={0}>{tableView}</TabPanel>
      <TabPanel value={1}>{pivotView}</TabPanel>
    </BaseTabs>
  );
};
