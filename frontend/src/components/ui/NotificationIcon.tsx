import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export default function NotificationIcon() {
   return (
      <div className="relative inline-flex">
         {/* Icon button */}
         <button
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100 hover:text-gray-900"
         >
            <NotificationsNoneOutlinedIcon />
         </button>

         {/* Badge */}
         <span className="absolute top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
            4
         </span>
      </div>
   );
}
