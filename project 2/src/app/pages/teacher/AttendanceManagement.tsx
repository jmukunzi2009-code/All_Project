import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, School, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendanceManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { students, classes, attendance, addAttendance, teachers } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get current teacher's data
  const currentTeacher = teachers.find(t => t.id === user?.id);
  const teacherClasses = classes.filter(c =>
    currentTeacher?.assignedClasses?.includes(c.id) ||
    currentTeacher?.classTeacherOf === c.id
  );

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);

  const handleAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    // Check if attendance already exists for this student on this date
    const existingAttendance = attendance.find(
      a => a.studentId === studentId && a.date === selectedDate && a.classId === selectedClassId
    );

    if (existingAttendance) {
      toast.error('Attendance already recorded for this student today');
      return;
    }

    addAttendance({
      studentId,
      classId: selectedClassId,
      date: selectedDate,
      status,
      teacherId: user?.id || '',
    });

    toast.success(`Marked as ${status}`);
  };

  const getStudentAttendance = (studentId: string) => {
    return attendance.find(
      a => a.studentId === studentId && a.date === selectedDate && a.classId === selectedClassId
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Attendance Management</h1>
        </div>
      </header>

      <main className="container py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
            <CardDescription>Record daily attendance for your classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Select Class</label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Date</label>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedClassId && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedClass?.name} - Attendance</CardTitle>
              <CardDescription>
                {selectedDate} • {classStudents.length} students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((student) => {
                    const studentAttendance = getStudentAttendance(student.id);

                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          {studentAttendance ? (
                            <Badge
                              variant={
                                studentAttendance.status === 'present'
                                  ? 'default'
                                  : studentAttendance.status === 'late'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {studentAttendance.status}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Not marked</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                              onClick={() => handleAttendance(student.id, 'present')}
                              disabled={!!studentAttendance}
                            >
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'absent' ? 'destructive' : 'outline'}
                              onClick={() => handleAttendance(student.id, 'absent')}
                              disabled={!!studentAttendance}
                            >
                              Absent
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === 'late' ? 'secondary' : 'outline'}
                              onClick={() => handleAttendance(student.id, 'late')}
                              disabled={!!studentAttendance}
                            >
                              Late
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAttendance(student.id, 'excused')}
                              disabled={!!studentAttendance}
                            >
                              Excused
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {!selectedClassId && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Please select a class to take attendance
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
