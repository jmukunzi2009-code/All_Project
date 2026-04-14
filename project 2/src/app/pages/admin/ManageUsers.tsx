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
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, School, Key, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../../types';

export default function ManageUsers() {
  const navigate = useNavigate();
  const { getAllUsers, createUser, deleteUser } = useAuth();
  const { classes, addTeacher, addStudent } = useSchool();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const allUsers = getAllUsers();
  const teachers = allUsers.filter(u => u.role === 'teacher' || u.role === 'class_teacher');
  const students = allUsers.filter(u => u.role === 'student');
  const headmasters = allUsers.filter(u => u.role === 'headmaster');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher' as UserRole,
    classId: '',
    profilePicture: '',
  });

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
    toast.success('Password generated!');
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      // Create user account
      createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profilePicture: formData.profilePicture,
      });

      // Also add to school context if teacher or student
      if (formData.role === 'teacher' || formData.role === 'class_teacher') {
        addTeacher({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          subjects: [],
          assignedClasses: [],
          profilePicture: formData.profilePicture,
        });
      } else if (formData.role === 'student') {
        if (!formData.classId) {
          toast.error('Please select a class for the student');
          return;
        }
        addStudent({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'student',
          classId: formData.classId,
          enrollmentDate: new Date().toISOString().split('T')[0],
          profilePicture: formData.profilePicture,
        });
      }

      toast.success(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} account created successfully!`);
      toast.info(`Login credentials created for ${formData.email}`);

      setDialogOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'teacher', classId: '', profilePicture: '' });
      setShowPassword(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleDelete = (userId: string, role: string) => {
    try {
      deleteUser(userId);
      toast.success(`${role} account deleted successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Manage Users & Accounts</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Create User Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="size-4 mr-2" />
              Create New User Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User Account</DialogTitle>
              <DialogDescription>
                Admin creates accounts with login credentials for all users
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="role">User Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="headmaster">Headmaster</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="class_teacher">Class Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email (Login Username)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@school.edu"
                  required
                />
              </div>

              <div>
                <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>
                <div className="flex items-center gap-4">
                  {formData.profilePicture ? (
                    <Avatar className="size-16">
                      <AvatarImage src={formData.profilePicture} />
                      <AvatarFallback>{formData.name ? getInitials(formData.name) : '?'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                      <ImageIcon className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="cursor-pointer"
                    />
                    <Input
                      placeholder="Or paste image URL"
                      value={formData.profilePicture && !formData.profilePicture.startsWith('data:') ? formData.profilePicture : ''}
                      onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload an image or provide a URL. Max size: 2MB
                </p>
              </div>

              <div>
                <Label htmlFor="password">Password (Required for Login)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password (min 6 characters)"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generatePassword}
                    title="Generate random password"
                  >
                    <Key className="size-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Save this password securely - user will need it to login
                </p>
              </div>

              {formData.role === 'student' && (
                <div>
                  <Label htmlFor="classId">Assign to Class</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} (Grade {cls.grade})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full">
                Create User Account
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Headmasters Section */}
        <Card>
          <CardHeader>
            <CardTitle>Headmasters</CardTitle>
            <CardDescription>School administration accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {headmasters.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No headmaster accounts created yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {headmasters.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.profilePicture} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge>Headmaster</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id, 'Headmaster')}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Teachers Section */}
        <Card>
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
            <CardDescription>Teaching staff accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {teachers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No teacher accounts created yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={teacher.profilePicture} />
                          <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{teacher.name}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>
                        <Badge variant={teacher.role === 'class_teacher' ? 'default' : 'secondary'}>
                          {teacher.role === 'class_teacher' ? 'Class Teacher' : 'Teacher'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(teacher.id, 'Teacher')}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Students Section */}
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Student accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No student accounts created yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student: any) => {
                    const studentClass = classes.find(c => c.id === student.classId);
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={student.profilePicture} />
                            <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{studentClass?.name || student.classId}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(student.id, 'Student')}
                          >
                            <Trash2 className="size-4" />
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
      </main>
    </div>
  );
}
