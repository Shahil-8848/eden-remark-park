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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { FileText, Plus, Save } from "lucide-react";

interface Test {
  id: string;
  name: string;
  total_marks: number;
  pass_marks: number;
  class_id: string;
  subject_id: string | null;
  test_date: string;
}

interface Student {
  id: string;
  name: string;
  roll_number: string;
}

interface TestResult {
  test_id: string;
  student_id: string;
  marks_obtained: number;
}

interface Class {
  id: string;
  number: number;
  section: string;
}

interface Subject {
  id: string;
  name: string;
}

const TestManagement = ({ userId }: { userId: string }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [testName, setTestName] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passMarks, setPassMarks] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [selectedTestId, setSelectedTestId] = useState("");
  const [marksEntry, setMarksEntry] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents(selectedClassId);
      fetchTestsForClass(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchInitialData = async () => {
    await Promise.all([fetchClasses(), fetchSubjects()]);
    setLoading(false);
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("number");
    
    if (error) {
      toast.error("Failed to fetch classes");
      return;
    }
    setClasses(data || []);
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name");
    
    if (error) {
      toast.error("Failed to fetch subjects");
      return;
    }
    setSubjects(data || []);
  };

  const fetchStudents = async (classId: string) => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("class_id", classId)
      .order("roll_number");
    
    if (error) {
      toast.error("Failed to fetch students");
      return;
    }
    setStudents(data || []);
  };

  const fetchTestsForClass = async (classId: string) => {
    const { data, error } = await supabase
      .from("tests")
      .select("*")
      .eq("class_id", classId)
      .order("test_date", { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch tests");
      return;
    }
    setTests(data || []);
  };

  const createTest = async () => {
    if (!testName || !totalMarks || !passMarks || !selectedClassId) {
      toast.error("Please fill all required fields");
      return;
    }

    const total = parseInt(totalMarks);
    const pass = parseInt(passMarks);

    if (pass > total) {
      toast.error("Pass marks cannot be greater than total marks");
      return;
    }

    const { data, error } = await supabase
      .from("tests")
      .insert({
        name: testName,
        total_marks: total,
        pass_marks: pass,
        class_id: selectedClassId,
        subject_id: selectedSubjectId || null,
        created_by: userId,
        test_date: testDate,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create test");
      console.error(error);
      return;
    }

    toast.success("Test created successfully");
    setTestName("");
    setTotalMarks("");
    setPassMarks("");
    fetchTestsForClass(selectedClassId);
    setSelectedTestId(data.id);
  };

  const saveMarks = async () => {
    if (!selectedTestId || Object.keys(marksEntry).length === 0) {
      toast.error("Please select a test and enter marks");
      return;
    }

    const test = tests.find(t => t.id === selectedTestId);
    if (!test) return;

    const results: TestResult[] = Object.entries(marksEntry).map(([studentId, marks]) => ({
      test_id: selectedTestId,
      student_id: studentId,
      marks_obtained: parseInt(marks) || 0,
    }));

    // Check if marks exceed total marks
    const invalidMarks = results.some(r => r.marks_obtained > test.total_marks);
    if (invalidMarks) {
      toast.error(`Marks cannot exceed total marks (${test.total_marks})`);
      return;
    }

    const { error } = await supabase
      .from("test_results")
      .upsert(results, { onConflict: 'test_id,student_id' });

    if (error) {
      toast.error("Failed to save marks");
      console.error(error);
      return;
    }

    toast.success("Marks saved successfully");
    setMarksEntry({});
  };

  const handleMarksChange = (studentId: string, value: string) => {
    setMarksEntry(prev => ({ ...prev, [studentId]: value }));
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
        <FileText className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Test Management</h1>
          <p className="text-muted-foreground">Create tests and enter marks</p>
        </div>
      </div>

      {/* Create Test Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Test
          </CardTitle>
          <CardDescription>Set up a new test for marks entry</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Test Name *</Label>
              <Input
                placeholder="e.g., Mid-term Exam, Unit Test 1"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>
            <div>
              <Label>Test Date *</Label>
              <Input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Select Class *</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose class..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      Class {cls.number}-{cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject (Optional)</Label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose subject..." />
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
              <Label>Total Marks *</Label>
              <Input
                type="number"
                placeholder="100"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label>Pass Marks *</Label>
              <Input
                type="number"
                placeholder="40"
                value={passMarks}
                onChange={(e) => setPassMarks(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <Button onClick={createTest} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Test & Enter Marks
          </Button>
        </CardContent>
      </Card>

      {/* Marks Entry Section */}
      {selectedClassId && students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Marks</CardTitle>
            <CardDescription>
              {tests.length > 0 ? "Select a test and enter marks for students" : "Create a test first to enter marks"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tests.length > 0 && (
              <>
                <div>
                  <Label>Select Test</Label>
                  <Select value={selectedTestId} onValueChange={setSelectedTestId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose test..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tests.map((test) => (
                        <SelectItem key={test.id} value={test.id}>
                          {test.name} (Total: {test.total_marks}, Pass: {test.pass_marks})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTestId && (
                  <>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Roll No.</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Marks Obtained</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.roll_number}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={marksEntry[student.id] || ""}
                                  onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                  className="w-24"
                                  min="0"
                                  max={tests.find(t => t.id === selectedTestId)?.total_marks}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Button onClick={saveMarks} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Marks
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestManagement;
