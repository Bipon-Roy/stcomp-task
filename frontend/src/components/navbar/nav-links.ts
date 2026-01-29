export type NavItem = {
   label: string;
   href?: string;
   children?: { label: string; href: string }[];
};

export const navLinks: NavItem[] = [
   { label: "Register a company", href: "/register-company" },
   { label: "Appoint a Company Secretary", href: "/appoint-secretary" },
   {
      label: "Company Secretarial Services",
      href: "/Company-secretary",
   },
   { label: "How Anycomp Works", href: "/how-it-works" },
];
