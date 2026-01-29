"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ServicesTable from "./ServicesTable";

interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

function CustomTabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
   );
}

function a11yProps(index: number) {
   return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
   };
}

export default function SpecialistTabs() {
   const [value, setValue] = React.useState(0);

   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
   };

   return (
      <Box sx={{ width: "100%", mt: 4 }}>
         <Box>
            <Tabs
               value={value}
               onChange={handleChange}
               sx={{
                  "& .MuiTabs-indicator": {
                     backgroundColor: "#002F70",
                     height: 2.5,
                  },
                  "& .MuiTabs-flexContainer": {
                     borderBottom: "2.5px solid #d2d2da",
                  },
               }}
            >
               {["All", "Drafts", "Published"].map((label, index) => (
                  <Tab
                     key={label}
                     label={label}
                     {...a11yProps(index)}
                     sx={{
                        textTransform: "none",
                        color: "#222222",
                        fontSize: 16,
                        "&.Mui-selected": {
                           color: "#002F70",
                           fontWeight: 500,
                        },
                     }}
                  />
               ))}
            </Tabs>
         </Box>
         <CustomTabPanel value={value} index={0}>
            <ServicesTable />
         </CustomTabPanel>
         <CustomTabPanel value={value} index={1}>
            Item Two
         </CustomTabPanel>
         <CustomTabPanel value={value} index={2}>
            Item Three
         </CustomTabPanel>
      </Box>
   );
}
