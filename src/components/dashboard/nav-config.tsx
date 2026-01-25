import SellRoundedIcon from "@mui/icons-material/SellRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export type NavItem = {
   key: string;
   label: string;
   href: string;
   icon: React.ReactNode;
};

export const primaryNav: NavItem[] = [
   { key: "specialists", label: "Specialists", href: "/dashboard/specialists", icon: <SellRoundedIcon /> },
   { key: "clients", label: "Clients", href: "/dashboard/clients", icon: <PeopleAltRoundedIcon /> },
   {
      key: "service-orders",
      label: "Service Orders",
      href: "/dashboard/service-orders",
      icon: <AssignmentOutlinedIcon />,
   },
   { key: "esignature", label: "eSignature", href: "/dashboard/esignature", icon: <DrawOutlinedIcon /> },
   { key: "messages", label: "Messages", href: "/dashboard/messages", icon: <MailOutlineOutlinedIcon /> },
   { key: "invoices", label: "Invoices & Receipts", href: "/dashboard/invoices", icon: <ReceiptLongOutlinedIcon /> },
];

export const secondaryNav: NavItem[] = [
   { key: "help", label: "Help", href: "/dashboard/help", icon: <HelpOutlineOutlinedIcon /> },
   { key: "settings", label: "Settings", href: "/dashboard/settings", icon: <SettingsOutlinedIcon /> },
];
