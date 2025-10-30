import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Users, GraduationCap, Plus, Trash2 } from "lucide-react";

interface Teacher {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
}

interface Class {
  id: string;
  number: number;
  section: string;
}

interface TeacherAssignment {
  id: string;
  teacher_id: string;
  class_id: string;
  subject_id: string | null;
  teacher_name: string;
  class_info: string;
  subject_name: string | null;
}

interface Subject {
  id: string;
  name: string;
}

const TeacherAssignment = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchTeachers(), fetchClasses(), fetchSubjects(), fetchAssignments()]);
    setLoading(false);
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to fetch subjects");
      console.error(error);
    } else {
      setSubjects(data || []);
    }
  };

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "teacher")
      .eq("approval_status", "approved")
      .order("full_name");

    if (error) {
      toast.error("Failed to fetch teachers");
      console.error(error);
    } else {
      setTeachers(data || []);
    }
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("number", { ascending: true });

    if (error) {
      toast.error("Failed to fetch classes");
      console.error(error);
    } else {
      setClasses(data || []);
    }
  };

  const fetchAssignments = async () => {
    try {
      // Fetch assignments without foreign key joins
      const { data: assignmentData, error: assignmentError } = await supabase
        .from("teacher_classes")
        .select("*");

      if (assignmentError) {
        console.error("Error fetching assignments:", assignmentError);
        toast.error("Failed to fetch assignments");
        return;
      }

      if (!assignmentData || assignmentData.length === 0) {
        setAssignments([]);
        return;
      }

      // Get unique teacher, class, and subject IDs
      const teacherIds = [...new Set(assignmentData.map((a) => a.teacher_id))];
      const classIds = [...new Set(assignmentData.map((a) => a.class_id))];
      const subjectIds = [...new Set(assignmentData.map((a) => a.subject_id).filter(Boolean))];

      // Fetch teacher profiles manually
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", teacherIds);

      // Fetch classes manually
      const { data: classData } = await supabase
        .from("classes")
        .select("*")
        .in("id", classIds);

      // Fetch subjects manually
      const { data: subjectData } = subjectIds.length > 0 ? await supabase
        .from("subjects")
        .select("*")
        .in("id", subjectIds) : { data: [] };

      // Combine data manually
      const formattedAssignments = assignmentData.map((assignment: any) => {
        const profile = profileData?.find(
          (p) => p.user_id === assignment.teacher_id
        );
        const classInfo = classData?.find((c) => c.id === assignment.class_id);
        const subjectInfo = subjectData?.find((s) => s.id === assignment.subject_id);

        return {
          id: assignment.id,
          teacher_id: assignment.teacher_id,
          class_id: assignment.class_id,
          subject_id: assignment.subject_id,
          teacher_name: profile?.full_name || "Unknown Teacher",
          class_info: `Class ${classInfo?.number || 0}-${
            classInfo?.section || "Unknown"
          }`,
          subject_name: subjectInfo?.name || null,
        };
      });

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error("Error in fetchAssignments:", error);
      toast.error("Failed to fetch assignments");
      setAssignments([]);
    }
  };

  const handleClassToggle = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const assignClasses = async () => {
    if (!selectedTeacher || selectedClasses.length === 0) {
      toast.error("Please select a teacher and at least one class");
      return;
    }

    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    const assignmentPromises = selectedClasses.map((classId) =>
      supabase.from("teacher_classes").insert({
        teacher_id: selectedTeacher,
        class_id: classId,
        subject_id: selectedSubject,
      })
    );

    const results = await Promise.all(assignmentPromises);
    const hasErrors = results.some((result) => result.error);

    if (hasErrors) {
      toast.error("Some assignments failed.");
    } else {
      toast.success(`Assigned ${selectedClasses.length} classes to teacher`);
      setSelectedTeacher("");
      setSelectedClasses([]);
      setSelectedSubject("");
      fetchAssignments();
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    const { error } = await supabase
      .from("teacher_classes")
      .delete()
      .eq("id", assignmentId);

    if (error) {
      toast.error("Failed to remove assignment");
      console.error(error);
    } else {
      toast.success("Assignment removed successfully");
      fetchAssignments();
    }
  };

  const getTeacherAssignments = (teacherId: string) => {
    return assignments.filter(
      (assignment) => assignment.teacher_id === teacherId
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Teacher Class Assignment</h1>
          <p className="text-muted-foreground">
            Assign teachers to specific classes and sections
          </p>
        </div>
      </div>

      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Assign New Classes
          </CardTitle>
          <CardDescription>
            Select a teacher and assign them to one or more classes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Teacher
            </label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a teacher..." />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.user_id} value={teacher.user_id}>
                    {teacher.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Subject *
            </label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Classes
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={cls.id}
                    checked={selectedClasses.includes(cls.id)}
                    onCheckedChange={() => handleClassToggle(cls.id)}
                  />
                  <label
                    htmlFor={cls.id}
                    className="text-sm cursor-pointer"
                  >
                    Class {cls.number}-{cls.section}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={assignClasses}
            disabled={!selectedTeacher || selectedClasses.length === 0 || !selectedSubject}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Assign Selected Classes
          </Button>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Assignments
          </CardTitle>
          <CardDescription>
            Overview of all teacher-class assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Teachers Found</h3>
              <p className="text-muted-foreground">
                No approved teachers are available for assignment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {teachers.map((teacher) => {
                const teacherAssignments = getTeacherAssignments(
                  teacher.user_id
                );
                return (
                  <div key={teacher.user_id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{teacher.full_name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {teacher.role}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {teacherAssignments.length}{" "}
                        {teacherAssignments.length === 1 ? "Class" : "Classes"}
                      </Badge>
                    </div>

                    {teacherAssignments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No classes assigned
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {teacherAssignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md text-sm"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{assignment.class_info}</span>
                              {assignment.subject_name && (
                                <span className="text-xs text-muted-foreground">
                                  {assignment.subject_name}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAssignment(assignment.id)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAssignment;
