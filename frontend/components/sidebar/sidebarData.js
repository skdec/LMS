import { Home, Settings, BookOpen, Users } from "lucide-react";

export const SidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    hasSubmenu: false,
  },
  {
    label: "Courses",
    href: "/courses",
    icon: BookOpen,
    hasSubmenu: false,
  },
  {
    label: "Students",
    href: "/students",
    icon: Users,
    hasSubmenu: false,
  },
  {
    label: "Settings",
    href: "/admin/profile",
    icon: Settings,
    hasSubmenu: false,
  },
];
