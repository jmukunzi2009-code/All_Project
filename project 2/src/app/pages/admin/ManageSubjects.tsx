import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ArrowLeft, Plus, School } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageSubjects() {
  const navigate = useNavigate();
  const { subjects, teachers, addSubject } = useSchool();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    teacherId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSubject({
      name: formData.name,
      code: formData.code,
      teacherId: formData.teacherId || undefined,
    });
    toast.success('Subject added successfully!');
    setDialogOpen(false);
    setFormData({ name: '', code: '', teacherId: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Manage Subjects</h1>
        </div>
      </header>

      <main className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>Create and assign subjects</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Add Subject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                    <DialogDescription>Create a new subject</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Subject Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Mathematics"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Subject Code</Label>
                      <Input
                        id="code"
                        placeholder="e.g., MATH"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="teacher">Assigned Teacher (Optional)</Label>
                      <Input
                        id="teacher"
                        placeholder="Teacher ID"
                        value={formData.teacherId}
                        onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Available teachers: {teachers.map(t => `${t.name} (${t.id})`).join(', ')}
                      </p>
                    </div>
                    <Button type="submit" className="w-full">Add Subject</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Assigned Teacher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => {
                  const teacher = teachers.find(t => t.id === subject.teacherId);
                  return (
                    <TableRow key={subject.id}>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{teacher?.name || 'Not assigned'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
