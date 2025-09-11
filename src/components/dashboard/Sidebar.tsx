import { GraduationCap, Users, Home, UserCheck, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  useSidebar 
} from '@/components/ui/sidebar';

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

const AppSidebar = ({ selectedClass, selectedView, onClassSelect, onDashboardSelect, onViewSelect, profile, onSignOut, accessibleClasses }: SidebarProps) => {
  const { open } = useSidebar();
  
  // Get unique class numbers from accessible classes
  const uniqueClassNumbers = [...new Set(accessibleClasses.map(cls => cls.number))].sort((a, b) => a - b);

  return (
    <Sidebar className={cn("transition-all duration-300 bg-sidebar text-sidebar-foreground border-sidebar-border", !open ? "w-14" : "w-64")}>
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sidebar-accent rounded-lg">
              <GraduationCap className="h-6 w-6 text-sidebar-primary" />
            </div>
            {open && (
              <div>
                <h2 className="font-semibold text-lg text-sidebar-foreground">School Portal</h2>
                <p className="text-sm text-sidebar-accent-foreground">Remarks System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {/* Dashboard */}
              {(profile?.role === 'admin' || profile?.role === 'principal' || profile?.role === 'superadmin') && (
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild
                        isActive={selectedClass === null && selectedView === null}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            selectedClass === null && selectedView === null && "bg-sidebar-accent text-sidebar-primary"
                          )}
                          onClick={onDashboardSelect}
                        >
                          <Home className="h-4 w-4" />
                          {open && <span className="ml-3">Dashboard</span>}
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              )}

              {/* Teacher Dashboard for Teachers */}
              {profile?.role === 'teacher' && (
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild
                        isActive={selectedClass === null && selectedView === null}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            selectedClass === null && selectedView === null && "bg-sidebar-accent text-sidebar-primary"
                          )}
                          onClick={onDashboardSelect}
                        >
                          <Home className="h-4 w-4" />
                          {open && <span className="ml-3">Teacher Dashboard</span>}
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              )}

              {/* Admin Management */}
              {(profile?.role === 'admin' || profile?.role === 'superadmin') && (
                <SidebarGroup>
                  {open && (
                    <SidebarGroupLabel className="flex items-center gap-2 text-sidebar-accent-foreground">
                      <Settings className="h-4 w-4" />
                      Management
                    </SidebarGroupLabel>
                  )}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild
                          isActive={selectedView === 'user-management'}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              selectedView === 'user-management' && "bg-sidebar-accent text-sidebar-primary"
                            )}
                            onClick={() => onViewSelect('user-management')}
                          >
                            <UserCheck className="h-4 w-4" />
                            {open && <span className="ml-3">User Approvals</span>}
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild
                          isActive={selectedView === 'teacher-assignment'}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              selectedView === 'teacher-assignment' && "bg-sidebar-accent text-sidebar-primary"
                            )}
                            onClick={() => onViewSelect('teacher-assignment')}
                          >
                            <GraduationCap className="h-4 w-4" />
                            {open && <span className="ml-3">Teacher Assignment</span>}
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {/* Advanced Features for Admin/Principal/Superadmin */}
              {(profile?.role === 'admin' || profile?.role === 'principal' || profile?.role === 'superadmin') && (
                <SidebarGroup>
                  {open && (
                    <SidebarGroupLabel className="flex items-center gap-2 text-sidebar-accent-foreground">
                      <Users className="h-4 w-4" />
                      Student Analytics
                    </SidebarGroupLabel>
                  )}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild
                          isActive={selectedView === 'student-search'}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              selectedView === 'student-search' && "bg-sidebar-accent text-sidebar-primary"
                            )}
                            onClick={() => onViewSelect('student-search')}
                          >
                            <Users className="h-4 w-4" />
                            {open && <span className="ml-3">Student Search</span>}
                          </Button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {/* Class Navigation */}
              <SidebarGroup>
                {open && (
                  <SidebarGroupLabel className="flex items-center gap-2 text-sidebar-accent-foreground">
                    <Users className="h-4 w-4" />
                    {profile?.role === 'teacher' ? 'My Classes' : 'Classes'}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {uniqueClassNumbers.length === 0 ? (
                      open && (
                        <p className="text-xs text-sidebar-accent-foreground p-2">
                          {profile?.role === 'teacher' ? 'No classes assigned' : 'No classes available'}
                        </p>
                      )
                    ) : (
                      uniqueClassNumbers.map((classNumber) => (
                        <SidebarMenuItem key={classNumber}>
                          <SidebarMenuButton 
                            asChild
                            isActive={selectedClass === classNumber}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                selectedClass === classNumber && "bg-sidebar-accent text-sidebar-primary"
                              )}
                              onClick={() => onClassSelect(classNumber)}
                            >
                              <span className="font-mono text-sm">
                                {classNumber}
                              </span>
                              {open && <span className="ml-3">Class {classNumber}</span>}
                            </Button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2 bg-sidebar">
          {open && (
            <>
              <p className="text-sm text-sidebar-foreground truncate">
                {profile?.full_name}
              </p>
              <p className="text-xs text-sidebar-accent-foreground capitalize">
                {profile?.role}
              </p>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSignOut}
            className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            {open && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;