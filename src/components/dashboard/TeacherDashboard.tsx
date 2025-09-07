import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Star, UserCircle, Calendar, BookOpen, TrendingUp } from 'lucide-react';

interface TeacherDashboardProps {
  students: any[];
  classes: any[];
  userRole: 'teacher' | 'admin' | 'principal';
  onClassSelect: (classNumber: number) => void;
}

const TeacherDashboard = ({ students, classes, userRole, onClassSelect }: TeacherDashboardProps) => {
  const totalStudents = students.length;
  const totalRemarks = students.reduce((acc, student) => acc + student.remarks.length, 0);
  const averageRating = students.length > 0 
    ? (students.reduce((acc, student) => acc + student.averageRating, 0) / students.length).toFixed(1)
    : '0';

  // Get recent remarks from higher authorities (admin/principal to this teacher)
  const remarksFromAuthorities = students
    .flatMap(student => 
      student.remarks.filter((remark: any) => 
        remark.profiles?.full_name && 
        // This would need to be expanded to check if the remark is FROM a higher authority TO this teacher
        // For now, showing all remarks for demo purposes
        true
      )
    )
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const classStats = classes.map(cls => {
    const classStudents = students.filter(s => s.classes?.number === cls.number);
    return {
      number: cls.number,
      section: cls.section,
      studentCount: classStudents.length,
      totalRemarks: classStudents.reduce((acc, student) => acc + student.remarks.length, 0),
      averageRating: classStudents.length > 0 
        ? classStudents.reduce((acc, student) => acc + student.averageRating, 0) / classStudents.length 
        : 0
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome Back, Teacher!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your assigned classes and student progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across {classes.length} classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Remarks</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRemarks}</div>
            <p className="text-xs text-muted-foreground">Total given</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Assigned Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classStats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No classes assigned yet</p>
                  <p className="text-sm">Contact your administrator to get class assignments</p>
                </div>
              ) : (
                classStats.map((stat) => (
                  <div
                    key={`${stat.number}-${stat.section}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold">Class {stat.number} - Section {stat.section}</h3>
                      <div className="text-sm text-muted-foreground">
                        {stat.studentCount} students • {stat.totalRemarks} remarks given
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {stat.averageRating.toFixed(1)}/5
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.round(stat.averageRating) ? 'fill-warning text-warning' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onClassSelect(stat.number)}
                        className="ml-2"
                      >
                        View Class
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages from Administration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {remarksFromAuthorities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Student remarks and messages will appear here</p>
                </div>
              ) : (
                remarksFromAuthorities.map((remark: any, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">Student Activity</p>
                        <Badge variant="outline" className="text-xs">
                          Recent
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < remark.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground">
                          by {remark.profiles?.full_name}
                        </span>
                      </div>
                      {remark.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {remark.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(remark.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;