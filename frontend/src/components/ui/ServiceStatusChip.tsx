import { ApprovalStatus, PublishStatus } from "@/types";
import { Chip } from "@mui/material";

export default function ServiceStatusChip({ value }: { value: ApprovalStatus | PublishStatus }) {
   const colors = {
      approved: { bg: "#A7F3D0", fg: "#0B7A3B" },
      "under-review": { bg: "#CFFAFE", fg: "#0E7490" },
      pending: { bg: "#CFFAFE", fg: "#0E7490" },
      rejected: { bg: "#FCA5A5", fg: "#991B1B" },
      Published: { bg: "#18c964", fg: "#fff" },
      "Not Published": { bg: "#c00306", fg: "#fff" },
   } as const;

   const { bg, fg } = colors[value];

   return (
      <Chip
         label={value}
         size="small"
         sx={{
            px: 1,
            py: 2,
            borderRadius: "8px",
            bgcolor: bg,
            color: fg,
            fontWeight: 500,
            textTransform: "capitalize",
         }}
      />
   );
}
