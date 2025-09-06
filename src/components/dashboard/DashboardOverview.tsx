import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, MessageCircle, TrendingUp } from 'lucide-react';
import { mockClasses } from '@/data/mockData';

interface DashboardOverviewProps {
  students: any[];
  classes: any[];
  userRole: 'teacher' | 'admin' | 'principal';
}

const DashboardOverview = ({ students, classes, userRole }: DashboardOverviewProps) => {
  const totalStudents = mockClasses.reduce((acc, cls) => acc + cls.students.length, 0);
  const totalClasses = mockClasses.length;
  const totalRemarks = mockClasses.reduce((acc, cls) => 
    acc + cls.students.reduce((studentAcc, student) => studentAcc + student.remarks.length, 0), 0
  );

  const classStats = mockClasses.map(cls => ({
    number: cls.number,
    studentCount: cls.students.length,
    totalRemarks: cls.students.reduce((acc, student) => acc + student.remarks.length, 0),
    averageRating: cls.students.length > 0 
      ? cls.students.reduce((acc, student) => acc + student.averageRating, 0) / cls.students.length 
      : 0
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of student remarks and class performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Class 1 to 10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Remarks</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalRemarks}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">4.2</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Class Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {classStats.map((stat) => (
              <div
                key={stat.number}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Class {stat.number}</h3>
                  <Badge variant="secondary">{stat.studentCount}</Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Students: {stat.studentCount}</div>
                  <div>Remarks: {stat.totalRemarks}</div>
                  <div>Avg Rating: {stat.averageRating.toFixed(1)}/5</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Select a class from the sidebar to view students and add remarks.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;