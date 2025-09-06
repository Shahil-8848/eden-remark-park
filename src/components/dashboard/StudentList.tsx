import { Student } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Star, MessageCircle, User, ChevronDown, Calendar, UserCircle } from 'lucide-react';
import { useState } from 'react';

interface StudentListProps {
  classNumber: number;
  students: any[];
  onAddRemark: (student: any) => void;
  userRole: 'teacher' | 'admin' | 'principal';
}

const StudentList = ({ classNumber, students, onAddRemark, userRole }: StudentListProps) => {
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  const sectionA = students.filter(s => s.classes?.section === 'A');
  const sectionB = students.filter(s => s.classes?.section === 'B');

  const toggleStudentRemarks = (studentId: string) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedStudents(newExpanded);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating ? 'fill-warning text-warning' : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          {rating > 0 ? rating.toFixed(1) : 'No rating'}
        </span>
      </div>
    );
  };

  const renderSection = (sectionStudents: any[], sectionName: string) => (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <User className="h-4 w-4 text-primary" />
          </div>
          Class {classNumber} - Section {sectionName}
          <Badge variant="secondary" className="ml-auto">
            {sectionStudents.length} Students
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sectionStudents.map((student) => (
            <Collapsible key={student.id}>
              <div className="rounded-lg border">
                <div className="flex items-center justify-between p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{student.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {student.roll_number}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      {renderStarRating(student.averageRating)}
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                          onClick={() => toggleStudentRemarks(student.id)}
                        >
                          <MessageCircle className="h-3 w-3" />
                          {student.remarks.length} remarks
                          <ChevronDown 
                            className={`h-3 w-3 transition-transform ${
                              expandedStudents.has(student.id) ? 'rotate-180' : ''
                            }`} 
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onAddRemark(student)}
                    className="bg-primary hover:bg-primary-dark"
                    disabled={userRole === 'teacher' ? false : false}
                  >
                    Add Remark
                  </Button>
                </div>
                
                <CollapsibleContent>
                  <div className="border-t bg-muted/20 p-3">
                    {student.remarks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No previous remarks for this student
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground mb-2">Previous Remarks:</h4>
                        {student.remarks
                          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((remark: any) => (
                          <div key={remark.id} className="bg-background rounded-lg p-3 border">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{remark.profiles?.full_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(remark.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              {renderStarRating(remark.rating)}
                            </div>
                            
                            {remark.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {remark.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {remark.notes && (
                              <p className="text-sm text-foreground bg-muted/30 rounded p-2">
                                {remark.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Class {classNumber} Students</h1>
        <Badge variant="secondary" className="text-sm">
          Total: {students.length} Students
        </Badge>
      </div>
      
      <div className="flex gap-6">
        {renderSection(sectionA, 'A')}
        {renderSection(sectionB, 'B')}
      </div>
    </div>
  );
};

export default StudentList;