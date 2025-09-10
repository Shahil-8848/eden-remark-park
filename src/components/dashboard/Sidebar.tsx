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
    <Sidebar className={cn("transition-all duration-300", !open ? "w-14" : "w-64")}>
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            {open && (
              <div>
                <h2 className="font-semibold text-lg">School Portal</h2>
                <p className="text-sm text-muted-foreground">Remarks System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {/* Dashboard */}
              {(profile?.role === 'admin' || profile?.role === 'principal') && (
                <SidebarGroup>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild
                        isActive={selectedClass === null && selectedView === null}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
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

              {/* Admin Management */}
              {profile?.role === 'admin' && (
                <SidebarGroup>
                  {open && (
                    <SidebarGroupLabel className="flex items-center gap-2">
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
                            className="w-full justify-start"
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
                            className="w-full justify-start"
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

              {/* Class Navigation */}
              <SidebarGroup>
                {open && (
                  <SidebarGroupLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {profile?.role === 'teacher' ? 'My Classes' : 'Classes'}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {uniqueClassNumbers.length === 0 ? (
                      open && (
                        <p className="text-xs text-muted-foreground p-2">
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
                                "w-full justify-start",
                                selectedClass === classNumber && "bg-primary/10 text-primary hover:bg-primary/20"
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
        <div className="p-4 border-t space-y-2">
          {open && (
            <>
              <p className="text-sm text-muted-foreground truncate">
                {profile?.full_name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {profile?.role}
              </p>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSignOut}
            className="w-full"
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