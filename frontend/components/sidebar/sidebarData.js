import {
  Home,
  Settings,
  BookOpen,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Receipt,
} from "lucide-react";

export const SidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    hasSubmenu: false,
  },
  {
    label: "courses",
    href: "/courses",
    icon: BookOpen,
    hasSubmenu: false,
  },
  {
    label: "Students",
    href: "/students-data",
    icon: Users,
    hasSubmenu: false,
  },
  {
    label: "Invoice Management",
    href: "/invoice",
    icon: FileText,
    hasSubmenu: true,
    submenu: [
      {
        label: "All Invoices",
        href: "/invoice",
        icon: Receipt,
      },
      {
        label: "Create Invoice",
        href: "/create-invoice",
        icon: FileText,
      },
      {
        label: "Payment Analytics",
        href: "/invoice/analytics",
        icon: BarChart3,
      },
      {
        label: "Payment History",
        href: "/invoice/payments",
        icon: DollarSign,
      },
    ],
  },
  {
    label: "Settings",
    href: "/admin/profile",
    icon: Settings,
    hasSubmenu: false,
  },
];
