"use client";

import * as React from "react";
import {
   Box,
   Button,
   Checkbox,
   Chip,
   Divider,
   IconButton,
   InputAdornment,
   Menu,
   MenuItem,
   Pagination,
   Paper,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TextField,
   Typography,
   useMediaQuery,
   useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type ApprovalStatus = "Approved" | "Under-Review" | "Rejected";
type PublishStatus = "Published" | "Not Published";

type ServiceRow = {
   id: string;
   service: string;
   price: string;
   purchases: number;
   duration: string;
   approvalStatus: ApprovalStatus;
   publishStatus: PublishStatus;
};

const MOCK_ROWS: ServiceRow[] = [
   {
      id: "1",
      service: "Incorporation of a new company",
      price: "RM 2,000",
      purchases: 20,
      duration: "3 Days",
      approvalStatus: "Approved",
      publishStatus: "Published",
   },
   {
      id: "2",
      service: "Incorporation of a new company",
      price: "RM 2,000",
      purchases: 0,
      duration: "1 Day",
      approvalStatus: "Under-Review",
      publishStatus: "Published",
   },
   {
      id: "3",
      service: "Incorporation of a new company",
      price: "RM 2,000",
      purchases: 9180,
      duration: "5 Days",
      approvalStatus: "Rejected",
      publishStatus: "Not Published",
   },
];

function ApprovalChip({ value }: { value: ApprovalStatus }) {
   const map: Record<ApprovalStatus, { bg: string; fg: string }> = {
      Approved: { bg: "#A7F3D0", fg: "#0B7A3B" },
      "Under-Review": { bg: "#CFFAFE", fg: "#0E7490" },
      Rejected: { bg: "#FCA5A5", fg: "#991B1B" },
   };

   return (
      <Chip
         label={value}
         size="small"
         sx={{
            px: 1,
            py: 2,
            borderRadius: "8px",
            bgcolor: map[value].bg,
            color: map[value].fg,
            fontWeight: 500,
         }}
      />
   );
}

function PublishChip({ value }: { value: PublishStatus }) {
   const map: Record<PublishStatus, { bg: string; fg: string }> = {
      Published: { bg: "#18c964", fg: "#FFFFFF" },
      "Not Published": { bg: "#c00306", fg: "#FFFFFF" },
   };

   return (
      <Chip
         label={value}
         size="small"
         sx={{
            px: 1,
            py: 2,
            borderRadius: "8px",
            bgcolor: map[value].bg,
            color: map[value].fg,
            fontWeight: 500,
         }}
      />
   );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);

   return (
      <>
         <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "#111827" }}>
            <MoreVertIcon />
         </IconButton>

         <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
               vertical: "top",
               horizontal: "left",
            }}
            transformOrigin={{
               vertical: "top",
               horizontal: "right",
            }}
            slotProps={{
               paper: {
                  sx: {
                     width: 260,
                     borderRadius: 2,
                     boxShadow: "0px 12px 30px rgba(0,0,0,0.12)",
                     overflow: "hidden",
                  },
               },
            }}
            open={open}
            onClose={() => setAnchorEl(null)}
         >
            <MenuItem
               onClick={() => {
                  setAnchorEl(null);
                  onEdit();
               }}
               sx={{ py: 1.5, gap: 1.5 }}
            >
               <EditOutlinedIcon fontSize="medium" />
               <Typography fontWeight={600}>Edit</Typography>
            </MenuItem>

            <Divider sx={{ width: "90%", mx: "auto" }} />

            <MenuItem
               onClick={() => {
                  setAnchorEl(null);
                  onDelete();
               }}
               sx={{ py: 1.5, gap: 1.5 }}
            >
               <DeleteOutlineIcon fontSize="medium" />
               <Typography fontWeight={600}>Delete</Typography>
            </MenuItem>
         </Menu>
      </>
   );
}

export default function ServicesTable() {
   const theme = useTheme();
   const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

   const [query, setQuery] = React.useState("");
   const [rows] = React.useState<ServiceRow[]>(MOCK_ROWS);

   const filtered = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return rows;
      return rows.filter((r) => r.service.toLowerCase().includes(q));
   }, [query, rows]);

   // selection
   const [selected, setSelected] = React.useState<string[]>([]);
   const allChecked = filtered.length > 0 && selected.length === filtered.length;
   const someChecked = selected.length > 0 && selected.length < filtered.length;

   const toggleAll = (checked: boolean) => {
      setSelected(checked ? filtered.map((r) => r.id) : []);
   };

   const toggleOne = (id: string, checked: boolean) => {
      setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
   };

   return (
      <Box sx={{ width: "100%" }}>
         {/* top controls */}
         <Stack
            direction={isMdDown ? "column" : "row"}
            alignItems={isMdDown ? "stretch" : "center"}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2 }}
         >
            <TextField
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="Search Services"
               size="small"
               sx={{
                  width: isMdDown ? "100%" : 320,
                  "& .MuiOutlinedInput-root": {
                     bgcolor: "#f1f1f1",
                     borderRadius: 1.5,
                     border: "none",
                     fontWeight: 500,
                  },
               }}
               slotProps={{
                  input: {
                     startAdornment: (
                        <InputAdornment position="start">
                           <SearchIcon sx={{ color: "#6B7280" }} />
                        </InputAdornment>
                     ),
                  },
               }}
            />

            <Stack direction="row" spacing={1.5} justifyContent={isMdDown ? "flex-end" : "flex-start"}>
               <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                     bgcolor: "#002F70",
                     px: 2.5,
                     borderRadius: 1.5,
                     textTransform: "none",
                     fontWeight: 500,
                     "&:hover": { bgcolor: "#00265C" },
                  }}
               >
                  Create
               </Button>

               <Button
                  variant="contained"
                  startIcon={<FileDownloadOutlinedIcon />}
                  sx={{
                     bgcolor: "#071331",
                     px: 2.5,
                     borderRadius: 1.5,
                     textTransform: "none",
                     fontWeight: 500,
                     "&:hover": { bgcolor: "#001737" },
                  }}
               >
                  Export
               </Button>
            </Stack>
         </Stack>

         {/* table */}
         <TableContainer
            component={Paper}
            elevation={0}
            sx={{
               borderRadius: 2,
               border: "1px solid #E5E7EB",
               overflowX: "auto",
            }}
         >
            <Table sx={{ minWidth: 1000 }}>
               <TableHead>
                  <TableRow
                     sx={{
                        "& th": {
                           color: "#888888",
                           fontWeight: 600,
                           textTransform: "uppercase",
                           fontSize: 14,
                           borderBottom: "2px solid #E5E7EB",
                           py: 1.5,
                        },
                     }}
                  >
                     <TableCell padding="checkbox">
                        <Checkbox
                           checked={allChecked}
                           indeterminate={someChecked}
                           onChange={(e) => toggleAll(e.target.checked)}
                           sx={{
                              "&.Mui-checked": { color: "#002F70" },
                              "&.MuiCheckbox-indeterminate": { color: "#002F70" },
                           }}
                        />
                     </TableCell>
                     <TableCell>SERVICE</TableCell>
                     <TableCell>PRICE</TableCell>
                     <TableCell>PURCHASES</TableCell>
                     <TableCell>DURATION</TableCell>
                     <TableCell>APPROVAL STATUS</TableCell>
                     <TableCell>PUBLISH STATUS</TableCell>
                     <TableCell align="right">ACTION</TableCell>
                  </TableRow>
               </TableHead>

               <TableBody
                  sx={{
                     "& td": {
                        borderBottom: "1px solid #EEF2F7",
                        py: 2,
                        fontSize: 14,
                     },
                  }}
               >
                  {filtered.map((row) => {
                     const isChecked = selected.includes(row.id);

                     return (
                        <TableRow key={row.id} hover>
                           <TableCell padding="checkbox">
                              <Checkbox
                                 checked={isChecked}
                                 onChange={(e) => toggleOne(row.id, e.target.checked)}
                                 sx={{ "&.Mui-checked": { color: "#002F70" } }}
                              />
                           </TableCell>

                           <TableCell>
                              <Typography fontWeight={600} color="#454545">
                                 {row.service}
                              </Typography>
                           </TableCell>

                           <TableCell>
                              <Typography fontWeight={600} color="#454545">
                                 {row.price}
                              </Typography>
                           </TableCell>

                           <TableCell>
                              <Typography fontWeight={600} color="#454545">
                                 {row.purchases.toLocaleString()}
                              </Typography>
                           </TableCell>

                           <TableCell>
                              <Typography fontWeight={600} color="#454545">
                                 {row.duration}
                              </Typography>
                           </TableCell>

                           <TableCell>
                              <ApprovalChip value={row.approvalStatus} />
                           </TableCell>

                           <TableCell>
                              <PublishChip value={row.publishStatus} />
                           </TableCell>

                           <TableCell align="right">
                              <RowActions
                                 onEdit={() => console.log("Edit", row.id)}
                                 onDelete={() => console.log("Delete", row.id)}
                              />
                           </TableCell>
                        </TableRow>
                     );
                  })}

                  {filtered.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={8} sx={{ py: 6 }}>
                           <Typography color="text.secondary" align="center">
                              No services found.
                           </Typography>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            {/* bottom pagination area */}
            <Box
               sx={{
                  px: 2,
                  py: 2,
                  display: "flex",
                  justifyContent: "center",
                  borderTop: "1px solid #EEF2F7",
               }}
            >
               <Pagination
                  count={10}
                  page={1}
                  sx={{
                     "& .Mui-selected": {
                        bgcolor: "#002F70 !important",
                        color: "#fff",
                     },
                  }}
               />
            </Box>
         </TableContainer>
      </Box>
   );
}
