import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, MessageCircle, TrendingUp, Star, UserCircle, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardOverviewProps {
  students: any[];
  classes: any[];
  userRole: 'teacher' | 'admin' | 'principal';
}

const DashboardOverview = ({ students, classes, userRole }: DashboardOverviewProps) => {
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalRemarks = students.reduce((acc, student) => acc + student.remarks.length, 0);
  const averageRating = students.length > 0 
    ? (students.reduce((acc, student) => acc + student.averageRating, 0) / students.length).toFixed(1)
    : '0';

  const recentRemarks = students
    .flatMap(student => 
      student.remarks.map((remark: any) => ({
        ...remark,
        studentName: student.name,
        studentClass: student.classes?.number || 0
      }))
    )
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const remarksByClass = classes.map(cls => ({
    class: cls.number,
    count: students
      .filter(s => s.classes?.number === cls.number)
      .reduce((acc, student) => acc + student.remarks.length, 0)
  }));

  const classStats = classes.map(cls => {
    const classStudents = students.filter(s => s.classes?.number === cls.number);
    return {
      number: cls.number,
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
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your school.
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
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Remarks</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRemarks}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRemarks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No remarks yet. Start adding some!
              </div>
            ) : (
              recentRemarks.map((remark: any, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                  <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{remark.studentName}</p>
                      <Badge variant="outline" className="text-xs">
                        Class {remark.studentClass}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Remarks by Class Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Remarks by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={remarksByClass}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Class Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classStats.map((stat) => (
                <div
                  key={stat.number}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">Class {stat.number}</h3>
                    <div className="text-sm text-muted-foreground">
                      {stat.studentCount} students • {stat.totalRemarks} remarks
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;