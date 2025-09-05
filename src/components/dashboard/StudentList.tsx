import { Student } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, User } from 'lucide-react';

interface StudentListProps {
  classNumber: number;
  students: Student[];
  onAddRemark: (student: Student) => void;
}

const StudentList = ({ classNumber, students, onAddRemark }: StudentListProps) => {
  const sectionA = students.filter(s => s.section === 'A');
  const sectionB = students.filter(s => s.section === 'B');

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

  const renderSection = (sectionStudents: Student[], sectionName: string) => (
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
        <div className="space-y-2">
          {sectionStudents.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{student.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {student.rollNumber}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  {renderStarRating(student.averageRating)}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    {student.remarks.length} remarks
                  </div>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => onAddRemark(student)}
                className="bg-primary hover:bg-primary-dark"
              >
                Add Remark
              </Button>
            </div>
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