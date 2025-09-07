import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Calendar, UserCircle, MessageSquare } from 'lucide-react';

interface ClassRemarksHistoryProps {
  students: any[];
  classNumber: number;
  section: string;
}

const ClassRemarksHistory = ({ students, classNumber, section }: ClassRemarksHistoryProps) => {
  // Get all remarks for this specific class
  const classRemarks = students
    .filter(student => student.classes?.number === classNumber && student.classes?.section === section)
    .flatMap(student => 
      student.remarks.map(remark => ({
        ...remark,
        studentName: student.name,
        studentRollNumber: student.roll_number
      }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const remarksByTeacher = classRemarks.reduce((acc, remark) => {
    const teacherName = remark.profiles?.full_name || 'Unknown Teacher';
    if (!acc[teacherName]) {
      acc[teacherName] = [];
    }
    acc[teacherName].push(remark);
    return acc;
  }, {} as Record<string, any[]>);

  const renderStarRating = (rating: number) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < rating ? 'fill-warning text-warning' : 'text-muted-foreground'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );

  if (classRemarks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Remarks History - Class {classNumber}-{section}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No remarks have been added for this class yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Remarks History - Class {classNumber}-{section}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {classRemarks.length} total remarks from {Object.keys(remarksByTeacher).length} teachers
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {Object.entries(remarksByTeacher).map(([teacherName, teacherRemarks]) => (
            <div key={teacherName} className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{teacherName}</span>
                <Badge variant="secondary" className="text-xs">
                  {(teacherRemarks as any[]).length} remarks
                </Badge>
              </div>
              
              <div className="pl-6 space-y-3">
                {(teacherRemarks as any[]).slice(0, 5).map((remark) => (
                  <div key={remark.id} className="border rounded-lg p-3 bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{remark.studentName}</span>
                        <Badge variant="outline" className="text-xs">
                          {remark.studentRollNumber}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(remark.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      {renderStarRating(remark.rating)}
                    </div>
                    
                    {remark.tags && remark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {remark.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {remark.notes && (
                      <p className="text-sm text-foreground bg-background/50 rounded p-2 border">
                        {remark.notes}
                      </p>
                    )}
                  </div>
                ))}
                
                {(teacherRemarks as any[]).length > 5 && (
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">
                      ... and {(teacherRemarks as any[]).length - 5} more remarks
                    </span>
                  </div>
                )}
              </div>
              
              {Object.keys(remarksByTeacher).indexOf(teacherName) < Object.keys(remarksByTeacher).length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassRemarksHistory;