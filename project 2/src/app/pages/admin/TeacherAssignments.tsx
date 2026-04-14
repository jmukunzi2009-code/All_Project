import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ArrowLeft, Plus, Trash2, School, BookOpen, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherAssignments() {
  const navigate = useNavigate();
  const { teachers, subjects, classes, assignments, assignTeacherToSubjectAndClass, removeTeacherAssignment } = useSchool();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    teacherId: '',
    subjectId: '',
    classId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.teacherId || !formData.subjectId || !formData.classId) {
      toast.error('Please fill all fields');
      return;
    }

    assignTeacherToSubjectAndClass(formData.teacherId, formData.subjectId, formData.classId);

    const teacher = teachers.find(t => t.id === formData.teacherId);
    const subject = subjects.find(s => s.id === formData.subjectId);
    const cls = classes.find(c => c.id === formData.classId);

    toast.success(`${teacher?.name} is now assigned to teach ${subject?.name} in ${cls?.name}`);
    setDialogOpen(false);
    setFormData({ teacherId: '', subjectId: '', classId: '' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRemoveAssignment = (teacherId: string, subjectId: string, classId: string) => {
    const assignmentId = `${teacherId}-${subjectId}-${classId}`;
    removeTeacherAssignment(assignmentId);
    toast.success('Assignment removed');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Teacher Assignments</h1>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Assign Teacher Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="size-4 mr-2" />
              Assign Teacher to Subject & Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Teacher</DialogTitle>
              <DialogDescription>
                Assign a teacher to teach a specific subject in a specific class
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="teacher">Select Teacher</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.role === 'class_teacher' ? 'Class Teacher' : 'Teacher'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {teachers.length === 0 && (
                  <p className="text-xs text-destructive mt-1">
                    No teachers available. Create teachers first.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="subject">Which Subject?</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {subjects.length === 0 && (
                  <p className="text-xs text-destructive mt-1">
                    No subjects available. Create subjects first.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="class">Which Class?</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} (Grade {cls.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {classes.length === 0 && (
                  <p className="text-xs text-destructive mt-1">
                    No classes available. Create classes first.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={teachers.length === 0 || subjects.length === 0 || classes.length === 0}
              >
                Assign Teacher
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Current Assignments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Teaching Assignments</CardTitle>
            <CardDescription>
              Overview of all teacher assignments by subject and class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="size-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No assignments yet</p>
                <p className="text-sm">
                  Assign teachers to subjects and classes to get started
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment, idx) => {
                    const teacher = teachers.find(t => t.id === assignment.teacherId);
                    const subject = subjects.find(s => s.id === assignment.subjectId);
                    const classInfo = classes.find(c => c.id === assignment.classId);

                    return (
                      <TableRow key={`${assignment.teacherId}-${assignment.subjectId}-${assignment.classId}-${idx}`}>
                        <TableCell>
                          {teacher ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="size-8">
                                <AvatarImage src={teacher.profilePicture} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(teacher.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm">{teacher.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {teacher.role === 'class_teacher' ? 'Class Teacher' : 'Teacher'}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Teacher</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {subject ? (
                            <div className="flex items-center gap-2">
                              <BookOpen className="size-4 text-primary" />
                              <div>
                                <p className="text-sm">{subject.name}</p>
                                <p className="text-xs text-muted-foreground">{subject.code}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unknown Subject</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {classInfo ? (
                            <Badge variant="secondary">
                              {classInfo.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Unknown Class</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAssignment(
                              assignment.teacherId,
                              assignment.subjectId,
                              assignment.classId
                            )}
                            title="Remove assignment"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Teacher Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Teacher Overview
            </CardTitle>
            <CardDescription>Quick view of each teacher's assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teachers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No teachers available
                </p>
              ) : (
                teachers.map((teacher) => {
                  const teacherAssignments = assignments.filter(a => a.teacherId === teacher.id);

                  return (
                    <div key={teacher.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                      <Avatar className="size-12">
                        <AvatarImage src={teacher.profilePicture} />
                        <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{teacher.name}</h3>
                          <Badge variant={teacher.role === 'class_teacher' ? 'default' : 'secondary'}>
                            {teacher.role === 'class_teacher' ? 'Class Teacher' : 'Teacher'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{teacher.email}</p>

                        {teacherAssignments.length > 0 ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Assignments:</p>
                            <div className="flex flex-wrap gap-2">
                              {teacherAssignments.map((assignment, idx) => {
                                const subject = subjects.find(s => s.id === assignment.subjectId);
                                const classInfo = classes.find(c => c.id === assignment.classId);
                                return (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {subject?.name} - {classInfo?.name}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No assignments yet
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
