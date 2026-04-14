import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ArrowLeft, School, FileText, Download } from 'lucide-react';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { students, classes, subjects, marks, attendance, terms, teachers } = useSchool();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTermId, setSelectedTermId] = useState('');
  const [viewReport, setViewReport] = useState(false);

  // Filter based on user role
  let availableStudents = students;
  if (user?.role === 'student') {
    availableStudents = students.filter(s => s.id === user.id);
    if (!selectedStudentId && availableStudents.length > 0) {
      setSelectedStudentId(availableStudents[0].id);
    }
  } else if (user?.role === 'class_teacher') {
    const teacher = teachers.find(t => t.id === user.id);
    if (teacher?.classTeacherOf) {
      availableStudents = students.filter(s => s.classId === teacher.classTeacherOf);
    }
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const selectedTerm = terms.find(t => t.id === selectedTermId) || terms.find(t => t.isCurrent);

  // Generate report data
  const generateReport = () => {
    if (!selectedStudent || !selectedTerm) return null;

    const studentMarks = marks.filter(
      m => m.studentId === selectedStudent.id && m.termId === selectedTerm.id
    );

    const studentAttendance = attendance.filter(
      a => a.studentId === selectedStudent.id
    );

    const subjectReports = studentMarks.reduce((acc, mark) => {
      const existing = acc.find(r => r.subjectId === mark.subjectId);
      if (existing) {
        existing.totalMarks += mark.marks;
        existing.totalMaxMarks += mark.maxMarks;
      } else {
        const subject = subjects.find(s => s.id === mark.subjectId);
        acc.push({
          subjectId: mark.subjectId,
          subjectName: subject?.name || 'Unknown',
          totalMarks: mark.marks,
          totalMaxMarks: mark.maxMarks,
        });
      }
      return acc;
    }, [] as Array<{ subjectId: string; subjectName: string; totalMarks: number; totalMaxMarks: number }>);

    const totalMarks = subjectReports.reduce((sum, s) => sum + s.totalMarks, 0);
    const totalMaxMarks = subjectReports.reduce((sum, s) => sum + s.totalMaxMarks, 0);
    const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

    const totalDays = studentAttendance.length;
    const presentDays = studentAttendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    const getGrade = (pct: number) => {
      // Rwandan Grading System
      if (pct >= 80) return 'A';
      if (pct >= 70) return 'B';
      if (pct >= 60) return 'C';
      if (pct >= 50) return 'D';
      if (pct >= 40) return 'E';
      return 'F';
    };

    const getRemarks = (pct: number) => {
      if (pct >= 80) return 'Excellent performance. Outstanding work!';
      if (pct >= 70) return 'Very good performance. Keep up the good work!';
      if (pct >= 60) return 'Good performance. Continue to work hard.';
      if (pct >= 50) return 'Satisfactory performance. More effort is needed.';
      if (pct >= 40) return 'Needs improvement. Requires additional support.';
      return 'Poor performance. Immediate intervention required.';
    };

    return {
      student: selectedStudent,
      term: selectedTerm,
      subjects: subjectReports.map(s => ({
        ...s,
        percentage: (s.totalMarks / s.totalMaxMarks) * 100,
        grade: getGrade((s.totalMarks / s.totalMaxMarks) * 100),
      })),
      totalMarks,
      totalMaxMarks,
      percentage,
      grade: getGrade(percentage),
      remarks: getRemarks(percentage),
      attendance: {
        total: totalDays,
        present: presentDays,
        percentage: attendancePercentage,
      },
    };
  };

  const report = generateReport();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Academic Reports</h1>
        </div>
      </header>

      <main className="container py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Select student and term to view academic report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user?.role !== 'student' && (
                <div>
                  <label className="text-sm mb-2 block">Select Student</label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStudents.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm mb-2 block">Select Term</label>
                <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map(term => (
                      <SelectItem key={term.id} value={term.id}>
                        {term.name} ({term.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => setViewReport(true)}
                  disabled={!selectedStudent || !selectedTerm}
                  className="w-full"
                >
                  <FileText className="size-4 mr-2" />
                  View Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {report && viewReport && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Academic Report</CardTitle>
                  <CardDescription>
                    {report.student.name} • {report.term.name} ({report.term.year})
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="size-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p>{report.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p>{classes.find(c => c.id === report.student.classId)?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enrollment Date</p>
                  <p>{report.student.enrollmentDate}</p>
                </div>
              </div>

              {/* Subject-wise Performance */}
              <div>
                <h3 className="text-lg mb-3">Subject-wise Performance</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks Obtained</TableHead>
                      <TableHead>Total Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.subjects.map((subject, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{subject.subjectName}</TableCell>
                        <TableCell>{subject.totalMarks}</TableCell>
                        <TableCell>{subject.totalMaxMarks}</TableCell>
                        <TableCell>{subject.percentage.toFixed(1)}%</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              subject.grade === 'A' ? 'default' :
                              subject.grade === 'B' ? 'secondary' :
                              subject.grade === 'C' || subject.grade === 'D' ? 'outline' :
                              'destructive'
                            }
                          >
                            {subject.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-medium">
                      <TableCell>Total</TableCell>
                      <TableCell>{report.totalMarks}</TableCell>
                      <TableCell>{report.totalMaxMarks}</TableCell>
                      <TableCell>{report.percentage.toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge>{report.grade}</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Attendance */}
              <div>
                <h3 className="text-lg mb-3">Attendance Record</h3>
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Days</p>
                    <p className="text-2xl">{report.attendance.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days Present</p>
                    <p className="text-2xl">{report.attendance.present}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance %</p>
                    <p className="text-2xl">{report.attendance.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg mb-2">Remarks & Performance Analysis</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Overall Performance:</p>
                    <p className="text-sm text-muted-foreground">{report.remarks}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <p className="text-sm font-medium mb-1">Overall Grade:</p>
                      <Badge className="text-lg px-4 py-1">{report.grade}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Total Score:</p>
                      <p className="text-lg">{report.percentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium mb-2">Rwandan Grading Scale:</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                      <div className="p-2 rounded bg-green-100 dark:bg-green-900 text-center">
                        <p className="font-bold">A</p>
                        <p className="text-muted-foreground">80-100%</p>
                      </div>
                      <div className="p-2 rounded bg-blue-100 dark:bg-blue-900 text-center">
                        <p className="font-bold">B</p>
                        <p className="text-muted-foreground">70-79%</p>
                      </div>
                      <div className="p-2 rounded bg-cyan-100 dark:bg-cyan-900 text-center">
                        <p className="font-bold">C</p>
                        <p className="text-muted-foreground">60-69%</p>
                      </div>
                      <div className="p-2 rounded bg-yellow-100 dark:bg-yellow-900 text-center">
                        <p className="font-bold">D</p>
                        <p className="text-muted-foreground">50-59%</p>
                      </div>
                      <div className="p-2 rounded bg-orange-100 dark:bg-orange-900 text-center">
                        <p className="font-bold">E</p>
                        <p className="text-muted-foreground">40-49%</p>
                      </div>
                      <div className="p-2 rounded bg-red-100 dark:bg-red-900 text-center">
                        <p className="font-bold">F</p>
                        <p className="text-muted-foreground">0-39%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
