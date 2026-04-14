import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ArrowLeft, Plus, School } from 'lucide-react';
import { toast } from 'sonner';

export default function MarksManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { students, subjects, classes, terms, marks, addMark, teachers, assignments } = useSchool();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    classId: '',
    termId: '',
    marks: '',
    maxMarks: '100',
    type: 'exam' as 'exam' | 'assignment' | 'quiz' | 'midterm' | 'final',
  });

  // Get current teacher's data
  const currentTeacher = teachers.find(t => t.id === user?.id);
  const teacherClasses = classes.filter(c =>
    currentTeacher?.assignedClasses?.includes(c.id) ||
    currentTeacher?.classTeacherOf === c.id
  );
  const teacherSubjects = subjects.filter(s =>
    currentTeacher?.subjects?.includes(s.id)
  );
  const teacherStudents = students.filter(s =>
    teacherClasses.some(c => c.id === s.classId)
  );

  // Get available subjects for selected class
  const availableSubjects = formData.classId
    ? subjects.filter(s => {
        if (currentTeacher?.classTeacherOf === formData.classId) {
          // Class teacher can add marks for any subject in their class
          return true;
        }
        return assignments.some(a => a.teacherId === user?.id && a.subjectId === s.id && a.classId === formData.classId);
      })
    : teacherSubjects;

  const currentTerm = terms.find(t => t.isCurrent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId || !formData.subjectId || !formData.classId || (terms.length > 0 && !formData.termId)) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if teacher is assigned to this subject and class
    const isAssigned = assignments.some(a =>
      a.teacherId === user?.id && a.subjectId === formData.subjectId && a.classId === formData.classId
    );

    if (!isAssigned && currentTeacher?.classTeacherOf !== formData.classId) {
      toast.error('You are not assigned to teach this subject in this class');
      return;
    }

    addMark({
      studentId: formData.studentId,
      subjectId: formData.subjectId,
      classId: formData.classId,
      termId: formData.termId || 'no-term',
      marks: parseFloat(formData.marks),
      maxMarks: parseFloat(formData.maxMarks),
      teacherId: user?.id || '',
      date: new Date().toISOString().split('T')[0],
      type: formData.type,
    });

    toast.success('Marks added successfully!');
    setDialogOpen(false);
    setFormData({
      studentId: '',
      subjectId: '',
      classId: '',
      termId: currentTerm?.id || terms[0]?.id || '',
      marks: '',
      maxMarks: '100',
      type: 'exam',
    });
  };

  // Filter marks for current teacher
  const teacherMarks = marks.filter(m => {
    if (m.teacherId === user?.id) return true;
    // Class teacher can see marks added by other teachers for students in their class
    if (currentTeacher?.classTeacherOf && students.find(s => s.id === m.studentId)?.classId === currentTeacher.classTeacherOf) {
      return true;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/teacher')}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Marks Management</h1>
        </div>
      </header>

      <main className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Marks</CardTitle>
                <CardDescription>
                  {currentTeacher?.role === 'class_teacher'
                    ? 'Add and manage marks for any subject in your assigned class'
                    : 'Add and manage marks for your assigned subjects and classes'
                  }
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Add Marks
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Student Marks</DialogTitle>
                    <DialogDescription>Record marks for a student</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="class">Class</Label>
                      <Select
                        value={formData.classId}
                        onValueChange={(value) => setFormData({ ...formData, classId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
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
                      <Label htmlFor="student">Student</Label>
                      <Select
                        value={formData.studentId}
                        onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {teacherStudents
                            .filter(s => !formData.classId || s.classId === formData.classId)
                            .map(student => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subjectId}
                        onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSubjects.map(subject => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {terms.length > 0 && (
                      <div>
                        <Label htmlFor="term">Term</Label>
                        <Select
                          value={formData.termId}
                          onValueChange={(value) => setFormData({ ...formData, termId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select term" />
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
                    )}

                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="midterm">Midterm</SelectItem>
                          <SelectItem value="final">Final</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="marks">Marks Obtained</Label>
                        <Input
                          id="marks"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.marks}
                          onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxMarks">Max Marks</Label>
                        <Input
                          id="maxMarks"
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.maxMarks}
                          onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">Save Marks</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherMarks.length > 0 ? (
                  teacherMarks.map((mark) => {
                    const student = students.find(s => s.id === mark.studentId);
                    const subject = subjects.find(s => s.id === mark.subjectId);
                    const cls = classes.find(c => c.id === mark.classId);
                    const percentage = (mark.marks / mark.maxMarks) * 100;

                    return (
                      <TableRow key={mark.id}>
                        <TableCell>{student?.name || 'Unknown'}</TableCell>
                        <TableCell>{subject?.name || 'Unknown'}</TableCell>
                        <TableCell>{cls?.name || 'Unknown'}</TableCell>
                        <TableCell className="capitalize">{mark.type}</TableCell>
                        <TableCell>
                          {mark.marks}/{mark.maxMarks}
                        </TableCell>
                        <TableCell>{percentage.toFixed(1)}%</TableCell>
                        <TableCell>{mark.date}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No marks recorded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
