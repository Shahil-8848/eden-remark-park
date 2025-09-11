import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, GraduationCap, MessageCircle, TrendingUp, Star, UserCircle, Calendar, Filter } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useState } from 'react';

interface DashboardOverviewProps {
  students: any[];
  classes: any[];
  userRole: 'teacher' | 'admin' | 'principal' | 'superadmin';
  onClassClick?: (classNumber: number, section: string) => void;
}

const DashboardOverview = ({ students, classes, userRole, onClassClick }: DashboardOverviewProps) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalRemarks = students.reduce((acc, student) => acc + student.remarks.length, 0);
  const averageRating = students.length > 0 
    ? (students.reduce((acc, student) => acc + student.averageRating, 0) / students.length).toFixed(1)
    : '0';

  // Get filtered students based on class selection
  const getFilteredStudents = () => {
    if (selectedClassFilter === 'all') return students;
    
    const [classNumber, section] = selectedClassFilter.split('-');
    return students.filter(student => 
      student.classes?.number === parseInt(classNumber) && 
      student.classes?.section === section
    );
  };

  const filteredStudents = getFilteredStudents();
  const recentRemarks = filteredStudents
    .flatMap(student => 
      student.remarks.map((remark: any) => ({
        ...remark,
        studentName: student.name,
        studentClass: student.classes?.number || 0,
        studentSection: student.classes?.section || 'A'
      }))
    )
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  const remarksByClass = classes.map(cls => ({
    class: cls.number,
    count: students
      .filter(s => s.classes?.number === cls.number)
      .reduce((acc, student) => acc + student.remarks.length, 0)
  }));

  const classStats = classes.map(cls => {
    const classStudents = students.filter(s => s.classes?.number === cls.number);
    return {
      id: cls.id,
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

      {/* Recent Remarks with Class Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Remarks</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedClassFilter === 'all' 
                  ? 'Latest activity across all classes' 
                  : `Recent activity for ${selectedClassFilter.replace('-', ' Section ')}`
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes
                    .filter(cls => students.some(s => s.classes?.number === cls.number))
                    .map((cls) => (
                      <SelectItem key={cls.id} value={`${cls.number}-${cls.section}`}>
                        Class {cls.number}-{cls.section}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {recentRemarks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {selectedClassFilter === 'all' 
                  ? 'No remarks yet. Start adding some!' 
                  : 'No remarks for selected class yet.'
                }
              </div>
            ) : (
              recentRemarks.map((remark: any, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{remark.studentName}</p>
                      <Badge variant="outline" className="text-xs">
                        Class {remark.studentClass}-{remark.studentSection}
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
                    {remark.tags && remark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {remark.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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

        {/* Class Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {classStats
                .filter(stat => stat.studentCount > 0)
                .sort((a, b) => b.averageRating - a.averageRating)
                .map((stat) => (
                <div
                  key={stat.number}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onClassClick?.(stat.number, stat.section)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">Class {stat.number} - Section {stat.section}</h3>
                    <div className="text-sm text-muted-foreground">
                      {stat.studentCount} students • {stat.totalRemarks} remarks
                    </div>
                    
                    {/* Recent activity indicator */}
                    {stat.totalRemarks > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-2 w-2 rounded-full ${
                          stat.averageRating >= 4 ? 'bg-green-500' : 
                          stat.averageRating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="text-xs text-muted-foreground">
                          {stat.averageRating >= 4 ? 'Excellent performance' :
                           stat.averageRating >= 3 ? 'Good performance' : 'Needs attention'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {stat.totalRemarks > 0 ? stat.averageRating.toFixed(1) : 'N/A'}/5
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