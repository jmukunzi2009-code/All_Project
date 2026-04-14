import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ArrowLeft, Plus, Trash2, School } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageClasses() {
  const navigate = useNavigate();
  const { classes, teachers, addClass, deleteClass, updateTeacher } = useSchool();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    classTeacherId: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newClass = {
      name: formData.name,
      grade: formData.grade,
      classTeacherId: formData.classTeacherId && formData.classTeacherId !== "none" ? formData.classTeacherId : undefined,
      studentIds: [],
    };

    const newClassId = addClass(newClass);

    if (formData.classTeacherId && formData.classTeacherId !== "none") {
      const teacher = teachers.find(t => t.id === formData.classTeacherId);
      updateTeacher(formData.classTeacherId, {
        classTeacherOf: newClassId,
        role: 'class_teacher',
      });
      toast.info(`${teacher?.name} is now the class teacher for ${formData.name}`);
    }

    toast.success('Class added successfully!');
    setDialogOpen(false);
    setFormData({ name: '', grade: '', classTeacherId: '' });
  };

  const classTeachers = teachers.filter(t => t.role === 'class_teacher');
  const regularTeachers = teachers.filter(t => t.role === 'teacher');
  const availableClassTeachers = [...classTeachers, ...regularTeachers].filter(t => t.id && t.id.trim() !== '');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Manage Classes</h1>
        </div>
      </header>

      <main className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Classes</CardTitle>
                <CardDescription>Create and manage school classes</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Add Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>Create a new class</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Class Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Grade 10A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        placeholder="e.g., 10"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="classTeacher">Class Teacher (Optional)</Label>
                      <Select
                        value={formData.classTeacherId}
                        onValueChange={(value) => setFormData({ ...formData, classTeacherId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Class Teacher</SelectItem>
                          {availableClassTeachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name} ({teacher.role === 'class_teacher' ? 'Class Teacher' : 'Teacher'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Assign a teacher to be the class teacher for this class
                      </p>
                    </div>
                    <Button type="submit" className="w-full">Add Class</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Class Teacher</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No classes created yet. Add a class to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls) => {
                    const classTeacher = teachers.find(t => t.id === cls.classTeacherId);
                    return (
                      <TableRow key={cls.id}>
                        <TableCell>{cls.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Grade {cls.grade}</Badge>
                        </TableCell>
                        <TableCell>
                          {classTeacher ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="size-8">
                                <AvatarImage src={classTeacher.profilePicture} />
                                <AvatarFallback className="text-xs">{getInitials(classTeacher.name)}</AvatarFallback>
                              </Avatar>
                              <span>{classTeacher.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge>{cls.studentIds.length} students</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              deleteClass(cls.id);
                              toast.success('Class deleted');
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
