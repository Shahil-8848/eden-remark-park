import { useState } from 'react';
import { GraduationCap, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  selectedClass: number | null;
  onClassSelect: (classNumber: number) => void;
  onDashboardSelect: () => void;
}

const Sidebar = ({ selectedClass, onClassSelect, onDashboardSelect }: SidebarProps) => {
  const classes = Array.from({ length: 10 }, (_, i) => i + 1);

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
            <Button
              variant={selectedClass === null ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={onDashboardSelect}
            >
              <Home className="h-4 w-4 mr-3" />
              Dashboard
            </Button>

            {/* Class Navigation */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Classes</span>
              </div>
              
              <div className="space-y-1">
                {classes.map((classNum) => (
                  <Button
                    key={classNum}
                    variant={selectedClass === classNum ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      selectedClass === classNum && "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                    onClick={() => onClassSelect(classNum)}
                  >
                    Class {classNum}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Logged in as: Mrs. Sarah Johnson
        </div>
      </div>
    </div>
  );
};

export default Sidebar;