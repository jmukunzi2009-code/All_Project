import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Plus, UserCircle, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getUsers, 
  saveUsers, 
  getClasses,
  saveClasses,
  generateId,
  hashPassword,
  addActivityLog,
  getUserByUsername
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { User, UserRole, Class } from '../../types';

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student' as UserRole,
    classId: '',
    guardianId: '',
    profileImage: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    const allClasses = getClasses();
    
    setUsers(allUsers.filter(u => u.role !== 'admin' && u.role !== 'headmaster'));
    setClasses(allClasses);
  };

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password || !newUser.firstName || !newUser.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if username exists
    if (getUserByUsername(newUser.username)) {
      toast.error('Username already exists');
      return;
    }

    // Validate class assignment for teacher, student, and guardian
    if ((newUser.role === 'teacher' || newUser.role === 'student') && !newUser.classId) {
      toast.error(`Please assign a class for ${newUser.role}`);
      return;
    }

    // Validate guardian assignment for student
    if (newUser.role === 'student' && !newUser.guardianId) {
      toast.error('Please assign a guardian for the student');
      return;
    }

    // Check if class already has a teacher (when adding teacher)
    if (newUser.role === 'teacher') {
      const cls = classes.find(c => c.id === newUser.classId);
      if (cls && cls.teacherId) {
        toast.error('This class already has a teacher assigned');
        return;
      }
    }

    const user: User = {
      id: generateId('user'),
      username: newUser.username,
      password: hashPassword(newUser.password),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      classId: newUser.classId || undefined,
      guardianOf: newUser.role === 'guardian' ? [] : undefined,
      profileImage: newUser.profileImage || undefined,
      createdAt: new Date().toISOString(),
    };

    const allUsers = getUsers();
    const updatedUsers = [...allUsers, user];
    saveUsers(updatedUsers);

    // Update class with teacherId when creating a teacher
    if (user.role === 'teacher' && user.classId) {
      const updatedClasses = classes.map(c => 
        c.id === user.classId 
          ? { ...c, teacherId: user.id }
          : c
      );
      saveClasses(updatedClasses);
      setClasses(updatedClasses);
    }

    // Update class and guardian if student
    if (user.role === 'student' && user.classId) {
      const updatedClasses = classes.map(c => 
        c.id === user.classId 
          ? { ...c, studentIds: [...c.studentIds, user.id] }
          : c
      );
      saveClasses(updatedClasses);
      setClasses(updatedClasses);

      // Add student to guardian's list
      if (newUser.guardianId) {
        const allUsers = getUsers();
        const updatedUsers = allUsers.map(u => 
          u.id === newUser.guardianId 
            ? { ...u, guardianOf: [...(u.guardianOf || []), user.id] }
            : u
        );
        saveUsers(updatedUsers);
      }
    }

    if (currentUser) {
      addActivityLog({
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userRole: currentUser.role,
        action: 'Create User',
        details: `Created ${user.role}: ${user.firstName} ${user.lastName}`,
      });
    }

    toast.success(`${user.role.replace('_', ' ')} created successfully with password: ${newUser.password}`);
    setNewUser({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'student',
      classId: '',
      guardianId: '',
      profileImage: '',
    });
    setIsDialogOpen(false);
    loadData();
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    // Remove from class if student
    if (userToDelete.role === 'student' && userToDelete.classId) {
      const updatedClasses = classes.map(c => 
        c.id === userToDelete.classId
          ? { ...c, studentIds: c.studentIds.filter(id => id !== userId) }
          : c
      );
      saveClasses(updatedClasses);
      setClasses(updatedClasses);
    }

    // Remove teacherId from class if teacher
    if (userToDelete.role === 'teacher' && userToDelete.classId) {
      const updatedClasses = classes.map(c => 
        c.id === userToDelete.classId
          ? { ...c, teacherId: undefined }
          : c
      );
      saveClasses(updatedClasses);
      setClasses(updatedClasses);
    }

    // Remove from guardian's list if student
    if (userToDelete.role === 'student') {
      const allUsers = getUsers();
      const updatedUsers = allUsers.map(u => 
        u.guardianOf?.includes(userId) 
          ? { ...u, guardianOf: u.guardianOf.filter(id => id !== userId) }
          : u
      );
      saveUsers(updatedUsers);
    }

    const allUsers = getUsers();
    const updatedUsers = allUsers.filter(u => u.id !== userId);
    saveUsers(updatedUsers);

    if (currentUser) {
      addActivityLog({
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userRole: currentUser.role,
        action: 'Delete User',
        details: `Deleted ${userToDelete.role}: ${userToDelete.firstName} ${userToDelete.lastName}`,
      });
    }

    toast.success('User deleted successfully');
    loadData();
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password });
    toast.success('Password generated!');
  };

  const getClassName = (classId?: string) => {
    if (!classId) return 'Not assigned';
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown';
  };

  const renderUserList = (role: UserRole) => {
    const roleUsers = users.filter(u => u.role === role);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleUsers.map((user) => (
          <Card key={user.id} className="border-2 border-[#e2dede] hover:border-[#e7ac3e] transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-[#043c04]">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback className="bg-gradient-to-br from-[#043c04] to-[#5d3010] text-white">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-[#043c04]">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <p className="text-xs text-[#5d3010]">@{user.username}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                  className="hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5d3010]">Role:</span>
                <Badge className="bg-[#e7ac3e] text-[#043c04] capitalize">
                  {role.replace('_', ' ')}
                </Badge>
              </div>
              {(role === 'teacher' || role === 'student') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Class:</span>
                  <span className="text-sm font-medium text-[#043c04]">{getClassName(user.classId)}</span>
                </div>
              )}

              {role === 'guardian' && user.guardianOf && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Students:</span>
                  <span className="text-sm font-medium text-[#043c04]">{user.guardianOf.length} assigned</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#e2dede]">
                <p className="text-xs text-[#5d3010]">
                  Created {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {roleUsers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <UserCircle className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
            <p className="text-[#5d3010]">No {role.replace('_', ' ')}s found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-[#043c04]">Manage Users</h2>
          <p className="text-[#5d3010] mt-1">Create and manage moms and students with their passwords</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#043c04] hover:bg-[#032d03] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#043c04]">Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value, classId: '', guardianId: '' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter or generate password"
                  />
                  <Button 
                    type="button" 
                    onClick={generatePassword}
                    variant="outline"
                    className="border-[#043c04] text-[#043c04] hover:bg-[#043c04] hover:text-white"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-[#5d3010]">
                  Remember to securely share this password with the user
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image URL (Optional)</Label>
                <Input
                  id="profileImage"
                  value={newUser.profileImage}
                  onChange={(e) => setNewUser({ ...newUser, profileImage: e.target.value })}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
              
              {(newUser.role === 'teacher' || newUser.role === 'student') && (
                <div className="space-y-2">
                  <Label htmlFor="class">Assign to Class</Label>
                  <Select value={newUser.classId} onValueChange={(value) => setNewUser({ ...newUser, classId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newUser.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="guardian">Assign Guardian</Label>
                  <Select value={newUser.guardianId} onValueChange={(value) => setNewUser({ ...newUser, guardianId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a guardian" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(u => u.role === 'guardian').map((guardian) => (
                        <SelectItem key={guardian.id} value={guardian.id}>
                          {guardian.firstName} {guardian.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button 
                onClick={handleCreateUser} 
                className="w-full bg-[#e7ac3e] hover:bg-[#d49a2e] text-[#043c04] font-semibold"
              >
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#e2dede]">
          <TabsTrigger value="teacher" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
            Teachers
          </TabsTrigger>
          <TabsTrigger value="student" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
            Students
          </TabsTrigger>
          <TabsTrigger value="guardian" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
            Guardians
          </TabsTrigger>
        </TabsList>
        <TabsContent value="teacher" className="mt-6">
          {renderUserList('teacher')}
        </TabsContent>
        <TabsContent value="student" className="mt-6">
          {renderUserList('student')}
        </TabsContent>
        <TabsContent value="guardian" className="mt-6">
          {renderUserList('guardian')}
        </TabsContent>
      </Tabs>
    </div>
  );
};