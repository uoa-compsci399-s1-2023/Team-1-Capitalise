import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

interface Props {
  tabs: { label: string; index: string; Component: JSX.Element }[];
}

const MyTabs = ({ tabs }: Props) => {
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box height="100%">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList aria-label="MyTab" onChange={handleChange}>
            {tabs.map(({ label }, i) => (
              <Tab label={label} value={tabs[i].index} key={i} />
            ))}
          </TabList>
        </Box>
        {tabs.map(({ Component }, i) => (
          <TabPanel
            value={tabs[i].index}
            key={i}
            style={{ height: "90%" }}
            sx={{ padding: "0px" }}
          >
            {Component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default MyTabs;

/*

    */
