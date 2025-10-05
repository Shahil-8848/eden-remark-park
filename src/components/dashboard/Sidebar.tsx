import {
  GraduationCap,
  Users,
  Home,
  UserCheck,
  Settings,
  LogOut,
  Search,
  BarChart3,
  BookOpen,
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface SidebarProps {
  selectedClass: number | null;
  selectedView: string | null;
  onClassSelect: (classNumber: number) => void;
  onDashboardSelect: () => void;
  onViewSelect: (view: string) => void;
  profile: any;
  onSignOut: () => void;
  accessibleClasses: any[];
}

const AppSidebar = ({
  selectedClass,
  selectedView,
  onClassSelect,
  onDashboardSelect,
  onViewSelect,
  profile,
  onSignOut,
  accessibleClasses,
}: SidebarProps) => {
  const { open } = useSidebar();
  const [expandedSections, setExpandedSections] = useState({
    management: true,
    analytics: true,
    classes: true,
  });

  // Get unique class numbers from accessible classes
  const uniqueClassNumbers = [
    ...new Set(accessibleClasses.map((cls) => cls.number)),
  ].sort((a, b) => a - b);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      admin: "Administrator",
      principal: "Principal",
      superadmin: "Super Admin",
      teacher: "Teacher",
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap = {
      superadmin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      admin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      principal:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      teacher:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return (
      colorMap[role] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg"
      )}
    >
      <SidebarContent className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r  dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-xl shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            {open && (
              <div className="flex-1">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  School Portal
                </h2>
                <p className="text-sm text-green-600 dark:text-blue-400 font-medium">
                  Management System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        {/* {open && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-blue-200 dark:ring-gray-800">
                <AvatarImage src={profile?.avatar} alt={profile?.full_name} />
                <AvatarFallback className="bg-gray-400-600 text-white font-semibold">
                  {profile?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {profile?.full_name}
                </p>
                <Badge
                  variant="secondary"
                  className={cn("text-xs mt-1", getRoleColor(profile?.role))}
                >
                  {getRoleDisplayName(profile?.role)}
                </Badge>
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation Content */}
        <div className="flex-1 overflow-hidden">
          <div
            className="h-full overflow-y-auto scrollbar-hide hover:scrollbar-default transition-all duration-200"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="p-3 space-y-2">
              {/* Dashboard */}
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={selectedClass === null && selectedView === null}
                      className="group"
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-11 rounded-lg font-medium transition-all duration-200 hover:shadow-sm",
                          "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-green-700 dark:hover:text-blue-300",
                          selectedClass === null &&
                            selectedView === null &&
                            "bg-blue-100 dark:bg-green-900/30 text-green-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800"
                        )}
                        onClick={onDashboardSelect}
                      >
                        <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        {open && (
                          <span className="ml-3">
                            {profile?.role === "teacher"
                              ? "Teacher Dashboard"
                              : "Dashboard"}
                          </span>
                        )}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>

              <Separator className="my-2" />

              {/* Admin Management */}
              {(profile?.role === "admin" ||
                profile?.role === "superadmin") && (
                <SidebarGroup>
                  <div className="flex items-center justify-between px-2 py-1">
                    {open && (
                      <SidebarGroupLabel className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold text-xs uppercase tracking-wide">
                        <Settings className="h-4 w-4" />
                        Management
                      </SidebarGroupLabel>
                    )}
                    {open && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        onClick={() => toggleSection("management")}
                      >
                        {expandedSections.management ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>

                  {(expandedSections.management || !open) && (
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            isActive={selectedView === "user-management"}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-10 rounded-lg font-medium transition-all duration-200",
                                "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300",
                                selectedView === "user-management" &&
                                  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm"
                              )}
                              onClick={() => onViewSelect("user-management")}
                            >
                              <UserCheck className="h-4 w-4" />
                              {open && (
                                <span className="ml-3">User Approvals</span>
                              )}
                              {open && selectedView === "user-management" && (
                                <div className="ml-auto h-2 w-2 bg-green-600 rounded-full"></div>
                              )}
                            </Button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <SidebarMenuButton
                            asChild
                            isActive={selectedView === "teacher-assignment"}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-10 rounded-lg font-medium transition-all duration-200",
                                "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300",
                                selectedView === "teacher-assignment" &&
                                  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm"
                              )}
                              onClick={() => onViewSelect("teacher-assignment")}
                            >
                              <BookOpen className="h-4 w-4" />
                              {open && (
                                <span className="ml-3">Teacher Assignment</span>
                              )}
                              {open &&
                                selectedView === "teacher-assignment" && (
                                  <div className="ml-auto h-2 w-2 bg-green-600 rounded-full"></div>
                                )}
                            </Button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  )}
                </SidebarGroup>
              )}

              {/* Analytics Section */}
              {(profile?.role === "admin" ||
                profile?.role === "principal" ||
                profile?.role === "superadmin") && (
                <>
                  <Separator className="my-2" />
                  <SidebarGroup>
                    <div className="flex items-center justify-between px-2 py-1">
                      {open && (
                        <SidebarGroupLabel className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold text-xs uppercase tracking-wide">
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </SidebarGroupLabel>
                      )}
                      {open && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          onClick={() => toggleSection("analytics")}
                        >
                          {expandedSections.analytics ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>

                    {(expandedSections.analytics || !open) && (
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              asChild
                              isActive={selectedView === "student-search"}
                            >
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start h-10 rounded-lg font-medium transition-all duration-200",
                                  "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300",
                                  selectedView === "student-search" &&
                                    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm"
                                )}
                                onClick={() => onViewSelect("student-search")}
                              >
                                <Search className="h-4 w-4" />
                                {open && (
                                  <span className="ml-3">Student Search</span>
                                )}
                                {open && selectedView === "student-search" && (
                                  <div className="ml-auto h-2 w-2 bg-green-600 rounded-full"></div>
                                )}
                              </Button>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    )}
                  </SidebarGroup>
                </>
              )}

              {/* Classes Section */}
              <Separator className="my-2" />
              <SidebarGroup>
                <div className="flex items-center justify-between px-2 py-1">
                  {open && (
                    <SidebarGroupLabel className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-semibold text-xs uppercase tracking-wide">
                      <Users className="h-4 w-4" />
                      {profile?.role === "teacher" ? "My Classes" : "Classes"}
                      {uniqueClassNumbers.length > 0 && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          {uniqueClassNumbers.length}
                        </Badge>
                      )}
                    </SidebarGroupLabel>
                  )}
                  {open && uniqueClassNumbers.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      onClick={() => toggleSection("classes")}
                    >
                      {expandedSections.classes ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>

                {(expandedSections.classes || !open) && (
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {uniqueClassNumbers.length === 0 ? (
                        open && (
                          <div className="px-3 py-2 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {profile?.role === "teacher"
                                ? "No classes assigned"
                                : "No classes available"}
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="space-y-1">
                          {uniqueClassNumbers.map((classNumber) => (
                            <SidebarMenuItem key={classNumber}>
                              <SidebarMenuButton
                                asChild
                                isActive={selectedClass === classNumber}
                              >
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start h-10 rounded-lg font-medium transition-all duration-200",
                                    "text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300",
                                    selectedClass === classNumber &&
                                      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 shadow-sm border border-orange-200 dark:border-orange-800"
                                  )}
                                  onClick={() => onClassSelect(classNumber)}
                                >
                                  <div
                                    className={cn(
                                      "flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold",
                                      selectedClass === classNumber
                                        ? "bg-orange-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    )}
                                  >
                                    {classNumber}
                                  </div>
                                  {open && (
                                    <span className="ml-3">
                                      Class {classNumber}
                                    </span>
                                  )}
                                  {open && selectedClass === classNumber && (
                                    <div className="ml-auto h-2 w-2 bg-orange-600 rounded-full"></div>
                                  )}
                                </Button>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarGroup>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-200 dark:ring-gray-800">
              <AvatarImage src={profile?.avatar} alt={profile?.full_name} />
              <AvatarFallback className="bg-gray-400-600 text-white font-semibold">
                {profile?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {profile?.full_name}
              </p>
              <span className={cn("text-xs mt-1", getRoleColor(profile?.role))}>
                {getRoleDisplayName(profile?.role)}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onSignOut}
            className={cn(
              "w-full h-11 font-medium transition-all duration-200",
              "border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
              "hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:shadow-sm"
            )}
          >
            <LogOut className="h-4 w-4" />
            {open && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>

      <style>{`
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-default::-webkit-scrollbar {
          display: block;
          width: 6px;
        }
        .scrollbar-default::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-default::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .scrollbar-default::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </Sidebar>
  );
};

export default AppSidebar;
