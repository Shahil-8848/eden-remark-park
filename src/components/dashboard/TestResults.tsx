import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BarChart3 } from "lucide-react";

interface Test {
  id: string;
  name: string;
  total_marks: number;
  pass_marks: number;
  class_id: string;
  test_date: string;
}

interface StudentResult {
  student_id: string;
  student_name: string;
  roll_number: string;
  marks_obtained: number;
  status: "pass" | "fail";
  percentage: number;
}

interface Class {
  id: string;
  number: number;
  section: string;
}

const TestResults = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchTestsForClass(selectedClassId);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedTestId) {
      fetchTestResults(selectedTestId);
    }
  }, [selectedTestId]);

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
    setLoading(false);
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

  const fetchTestResults = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    const { data: resultsData, error: resultsError } = await supabase
      .from("test_results")
      .select("student_id, marks_obtained")
      .eq("test_id", testId);

    if (resultsError) {
      toast.error("Failed to fetch test results");
      return;
    }

    const studentIds = resultsData?.map(r => r.student_id) || [];
    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select("id, name, roll_number")
      .in("id", studentIds)
      .order("roll_number");

    if (studentsError) {
      toast.error("Failed to fetch student data");
      return;
    }

    const formattedResults: StudentResult[] = (studentsData || []).map(student => {
      const result = resultsData?.find(r => r.student_id === student.id);
      const marks = result?.marks_obtained || 0;
      const percentage = (marks / test.total_marks) * 100;
      
      return {
        student_id: student.id,
        student_name: student.name,
        roll_number: student.roll_number,
        marks_obtained: marks,
        status: marks >= test.pass_marks ? "pass" : "fail",
        percentage,
      };
    });

    setResults(formattedResults);
  };

  const selectedTest = tests.find(t => t.id === selectedTestId);
  const passCount = results.filter(r => r.status === "pass").length;
  const failCount = results.filter(r => r.status === "fail").length;
  const averageMarks = results.length > 0
    ? (results.reduce((sum, r) => sum + r.marks_obtained, 0) / results.length).toFixed(2)
    : 0;

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
        <BarChart3 className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Test Results</h1>
          <p className="text-muted-foreground">View and analyze test performance</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Test</CardTitle>
          <CardDescription>Choose a class and test to view results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
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
              <label className="text-sm font-medium mb-2 block">Test</label>
              <Select 
                value={selectedTestId} 
                onValueChange={setSelectedTestId}
                disabled={!selectedClassId || tests.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose test..." />
                </SelectTrigger>
                <SelectContent>
                  {tests.map((test) => (
                    <SelectItem key={test.id} value={test.id}>
                      {test.name} ({new Date(test.test_date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTest && results.length > 0 && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{passCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{failCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageMarks}</div>
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedTest.name} - Detailed Results</CardTitle>
              <CardDescription>
                Total: {selectedTest.total_marks} | Pass: {selectedTest.pass_marks}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Marks Obtained</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow 
                        key={result.student_id}
                        className={result.status === "fail" ? "bg-red-50 dark:bg-red-950/20" : ""}
                      >
                        <TableCell className="font-medium">{result.roll_number}</TableCell>
                        <TableCell>{result.student_name}</TableCell>
                        <TableCell>
                          {result.marks_obtained} / {selectedTest.total_marks}
                        </TableCell>
                        <TableCell>{result.percentage.toFixed(2)}%</TableCell>
                        <TableCell>
                          <Badge 
                            variant={result.status === "pass" ? "default" : "destructive"}
                          >
                            {result.status === "pass" ? "Pass" : "Fail"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TestResults;
