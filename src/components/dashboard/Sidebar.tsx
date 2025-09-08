import { useState } from 'react';
import { GraduationCap, Users, Home, UserCheck, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const Sidebar = ({ selectedClass, selectedView, onClassSelect, onDashboardSelect, onViewSelect, profile, onSignOut, accessibleClasses }: SidebarProps) => {

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">School Portal</h2>
            <p className="text-sm text-muted-foreground">Remarks System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {/* Dashboard */}
            {(profile?.role === 'admin' || profile?.role === 'principal') && (
              <Button
                variant={selectedClass === null && selectedView === null ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={onDashboardSelect}
              >
                <Home className="h-4 w-4 mr-3" />
                Dashboard
              </Button>
            )}

            {/* Admin Management */}
            {profile?.role === 'admin' && (
              <>
                <div className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Management</span>
                  </div>
                  <div className="space-y-1">
                    <Button
                      variant={selectedView === 'user-management' ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onViewSelect('user-management')}
                    >
                      <UserCheck className="h-4 w-4 mr-3" />
                      User Approvals
                    </Button>
                    <Button
                      variant={selectedView === 'teacher-assignment' ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onViewSelect('teacher-assignment')}
                    >
                      <GraduationCap className="h-4 w-4 mr-3" />
                      Teacher Assignment
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Class Navigation */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {profile?.role === 'teacher' ? 'My Classes' : 'Classes'}
                </span>
              </div>
              
              <div className="space-y-1">
                {accessibleClasses.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2">
                    {profile?.role === 'teacher' ? 'No classes assigned' : 'No classes available'}
                  </p>
                ) : (
                  accessibleClasses.map((cls) => (
                    <Button
                      key={cls.id}
                      variant={selectedClass === cls.number ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        selectedClass === cls.number && "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                      onClick={() => onClassSelect(cls.number)}
                    >
                      Class {cls.number}-{cls.section}
                    </Button>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <p className="text-sm text-muted-foreground">
            {profile?.full_name}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {profile?.role}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSignOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
    </div>
  );
};

export default Sidebar;