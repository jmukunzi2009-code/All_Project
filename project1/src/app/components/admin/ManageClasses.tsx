import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Users, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getClasses, 
  saveClasses, 
  getUsers, 
  generateId,
  addActivityLog 
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { Class, User } from '../../types';

export const ManageClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allClasses = getClasses();
    const allUsers = getUsers();
    
    setClasses(allClasses);
    setTeachers(allUsers.filter(u => u.role === 'teacher'));
    setStudents(allUsers.filter(u => u.role === 'student'));
  };

  const handleCreateClass = () => {
    if (!newClass.name) {
      toast.error('Please enter a class name');
      return;
    }

    // Check if class name already exists
    const existingClass = classes.find(c => c.name.toLowerCase() === newClass.name.toLowerCase());
    if (existingClass) {
      toast.error('A class with this name already exists');
      return;
    }

    const cls: Class = {
      id: generateId('class'),
      name: newClass.name,
      teacherId: undefined, // Teacher will be assigned later
      studentIds: [],
      createdAt: new Date().toISOString(),
    };

    const updatedClasses = [...classes, cls];
    saveClasses(updatedClasses);
    setClasses(updatedClasses);

    if (user) {
      addActivityLog({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        action: 'Create Class',
        details: `Created class: ${cls.name}`,
      });
    }

    toast.success('Class created successfully');
    setNewClass({ name: '' });
    setIsDialogOpen(false);
  };

  const handleDeleteClass = (classId: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    const updatedClasses = classes.filter(c => c.id !== classId);
    saveClasses(updatedClasses);
    setClasses(updatedClasses);

    if (user) {
      addActivityLog({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        action: 'Delete Class',
        details: `Deleted class with ID: ${classId}`,
      });
    }

    toast.success('Class deleted successfully');
  };

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Not assigned';
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const getStudentNames = (studentIds: string[]) => {
    return studentIds.map(id => {
      const student = students.find(s => s.id === id);
      return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
    }).join(', ') || 'No students assigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manage Classes</h2>
          <p className="text-gray-600 mt-1">Create and organize class groups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  placeholder="e.g., Grade 1A"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateClass} className="w-full">
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <p className="text-xs text-gray-500">
                      Created {new Date(cls.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClass(cls.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-700">Teacher:</p>
                <p className="text-sm text-gray-600">{getTeacherName(cls.teacherId)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Students:</p>
                <p className="text-sm text-gray-600">{getStudentNames(cls.studentIds)}</p>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  {cls.studentIds.length} student(s) assigned
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No classes created yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Create Class" to add your first class</p>
          </div>
        )}
      </div>
    </div>
  );
};