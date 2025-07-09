import {
  MessageSquare,
  User,
  Grid3X3,
  Settings,
  FileText,
  BookOpen,
  Users,
  GraduationCap,
  UserCheck,
  BarChart3,
} from "lucide-react";

export const SidebarItems = [
  { icon: BookOpen, label: "Courses", hasSubmenu: true },
  { icon: Users, label: "Instructors", hasSubmenu: true },
  { icon: GraduationCap, label: "Students", active: true },
  { icon: UserCheck, label: "Enrollment", hasSubmenu: true },
  { icon: MessageSquare, label: "Messages" },
  { icon: User, label: "Admin profile" },
  { icon: FileText, label: "Invoice", hasSubmenu: true },
  { icon: Settings, label: "Settings" },
];

export const ReturnItems = [
  { icon: BarChart3, label: "Main Dashboard" },
  { icon: Grid3X3, label: "All Components" },
];
