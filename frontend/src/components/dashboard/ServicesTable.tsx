"use client";

import * as React from "react";
import {
   Box,
   Button,
   Checkbox,
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
import Link from "next/link";
import { usePaginatedRequest } from "@/hooks/usePaginatedGetRequest";
import ServiceStatusChip from "../ui/ServiceStatusChip";
import { SpecialistItemResponse } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import ConfirmDeleteDialog from "./ConfirmDeleteServiceDialog";
import { ServiceEditDrawer } from "./create-specialist/ServiceEditDrawer";
import { serviceOptions } from "@/utils/serviceOffers";
import { useServiceForm } from "@/hooks/useServiceForm";
import { ServiceFormValues } from "@/validators/specialist.validator";
import { useUpdateWithFormData } from "@/hooks/useMutation";
import { buildServiceFormData } from "@/services/specialistPayload";
import { useQueryClient } from "@tanstack/react-query";

const initialValues: ServiceFormValues = {
   title: "",
   description: "",
   status: "approved",
   estimatedDays: 1,
   price: "",
   additionalOfferings: [],
   images: [null, null, null],
};

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

export default function ServicesTable({ tab }: { tab: "all" | "drafts" | "published" }) {
   const theme = useTheme();
   const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
   const [query, setQuery] = React.useState("");
   const [deleteOpen, setDeleteOpen] = React.useState(false);
   const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; title: string } | null>(null);
   const debouncedSearchQuery = useDebounce(query, 300);
   const [page, setPage] = React.useState(1);
   const [drawerOpen, setDrawerOpen] = React.useState(false);
   const [editId, setEditId] = React.useState<string>("");
   const form = useServiceForm(initialValues);
   const limit = 10;
   const queryClient = useQueryClient();
   const { data, isLoading, isError, error } = usePaginatedRequest<SpecialistItemResponse>(
      "All_Specialists_Dashboard",
      "/specialist",
      {
         page,
         limit,
         search: debouncedSearchQuery,
         params: { tab },
         enabled: true,
      }
   );
   const { mutate: updateSpecialist, isPending } = useUpdateWithFormData("Update_Specialist", `/specialist/${editId}`);

   const closeEdit = () => {
      setDrawerOpen(false);
      setEditId("");
   };

   const openEdit = (id: string) => {
      setEditId(id);
      setDrawerOpen(true);
   };

   const handleUpdateSpecialist = () => {
      const r = form.validateAll();

      if (!r.ok) return;

      const payload = buildServiceFormData(form.value);
      updateSpecialist(payload, {
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["All_Specialists_Dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["Specialist_By_Id"] });
         },
      });
   };

   React.useEffect(() => {
      setPage(1);
   }, [tab, query]);

   const rows = data?.items ?? [];
   const totalRows = data?.meta?.total ?? 0;

   // selection state stays local
   const [selected, setSelected] = React.useState<string[]>([]);
   React.useEffect(() => setSelected([]), [page, tab, query]);

   const allChecked = rows.length > 0 && selected.length === rows.length;
   const someChecked = selected.length > 0 && selected.length < rows.length;

   const toggleAll = (checked: boolean) => {
      setSelected(checked ? rows.map((r) => r.id) : []);
   };

   const toggleOne = (id: string, checked: boolean) => {
      setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
   };
   const openDelete = (id: string, title: string) => {
      setDeleteTarget({ id, title });
      setDeleteOpen(true);
   };

   const closeDelete = () => {
      setDeleteOpen(false);
      setDeleteTarget(null);
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
                  component={Link}
                  href="/dashboard/specialists/create"
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

         {/* loading / error states */}
         {isLoading && (
            <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #E5E7EB" }}>
               <Typography color="text.secondary">Loading services...</Typography>
            </Paper>
         )}

         {isError && (
            <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #E5E7EB" }}>
               <Typography color="error">{error?.message || "Failed to load services"}</Typography>
            </Paper>
         )}

         {!isLoading && !isError && (
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
                     {rows.map((row) => {
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
                                 <Typography fontWeight={500} color="#454545">
                                    {row.title}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Typography fontWeight={500} color="#454545">
                                    RM {row.price}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Typography fontWeight={500} color="#454545">
                                    {row.purchases.toLocaleString()}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <Typography fontWeight={500} color="#454545">
                                    {row.durationDays}
                                 </Typography>
                              </TableCell>

                              <TableCell>
                                 <ServiceStatusChip value={row.approvalStatus} />
                              </TableCell>

                              <TableCell>
                                 <ServiceStatusChip value={row.publishStatus} />
                              </TableCell>

                              <TableCell align="right">
                                 <RowActions
                                    onEdit={() => openEdit(row.id)}
                                    onDelete={() => openDelete(row.id, row.title)}
                                 />
                              </TableCell>
                           </TableRow>
                        );
                     })}

                     {rows.length === 0 && (
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

               {/* pagination */}
               {totalRows > 10 && (
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
                        count={data?.meta?.totalPages ?? 1}
                        page={page}
                        onChange={(_, p) => setPage(p)}
                        sx={{
                           "& .Mui-selected": {
                              bgcolor: "#002F70 !important",
                              color: "#fff",
                           },
                        }}
                     />
                  </Box>
               )}
            </TableContainer>
         )}
         <ServiceEditDrawer
            serviceId={editId}
            open={drawerOpen}
            onClose={closeEdit}
            mode="edit"
            isPending={isPending}
            value={form.value}
            errors={form.errors}
            onTouched={form.onTouched}
            onChange={form.onChange}
            additionalOfferingOptions={serviceOptions}
            onConfirm={handleUpdateSpecialist}
         />
         <ConfirmDeleteDialog
            open={deleteOpen}
            serviceId={deleteTarget?.id ?? null}
            serviceTitle={deleteTarget?.title}
            onClose={closeDelete}
         />
      </Box>
   );
}
