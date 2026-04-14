import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users, GraduationCap, UserCircle } from 'lucide-react';
import {
  getUsers,
  getClasses,
  addActivityLog
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { User, Class } from '../../types';

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    const allClasses = getClasses();

    setUsers(allUsers.filter(u => u.role !== 'admin'));
    setClasses(allClasses);
  };

  const getClassName = (classId?: string) => {
    if (!classId) return 'Not assigned';
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown';
  };

  const renderUserList = (role: string) => {
    const roleUsers = users.filter(u => u.role === role);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleUsers.map((user) => (
          <Card key={user.id} className="border-2 border-[#e2dede] hover:border-[#e7ac3e] transition-all">
            <CardHeader className="pb-3">
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
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5d3010]">Role:</span>
                <Badge className="bg-[#e7ac3e] text-[#043c04] capitalize">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              {(user.role === 'teacher' || user.role === 'student') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Class:</span>
                  <span className="text-sm font-medium text-[#043c04]">{getClassName(user.classId)}</span>
                </div>
              )}
              {user.role === 'guardian' && user.guardianOf && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Students:</span>
                  <span className="text-sm font-medium text-[#043c04]">{user.guardianOf.length} assigned</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {roleUsers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {role.replace('_', ' ')}s found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">View all users in the system</p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#e2dede]">
          <TabsTrigger value="headmaster" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
            Headmasters
          </TabsTrigger>
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
        <TabsContent value="headmaster" className="mt-6">
          {renderUserList('headmaster')}
        </TabsContent>
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
};import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users, GraduationCap, UserCircle } from 'lucide-react';
import {
  getUsers,
  getClasses,
  addActivityLog
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { User, Class } from '../../types';

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    const allClasses = getClasses();

    setUsers(allUsers.filter(u => u.role !== 'admin'));
    setClasses(allClasses);
  };

  const getClassName = (classId?: string) => {
    if (!classId) return 'Not assigned';
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown';
  };

  const renderUserList = (role: string) => {
    const roleUsers = users.filter(u => u.role === role);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleUsers.map((user) => (
          <Card key={user.id} className="border-2 border-[#e2dede] hover:border-[#e7ac3e] transition-all">
            <CardHeader className="pb-3">
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
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5d3010]">Role:</span>
                <Badge className="bg-[#e7ac3e] text-[#043c04] capitalize">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              {(user.role === 'teacher' || user.role === 'student') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Class:</span>
                  <span className="text-sm font-medium text-[#043c04]">{getClassName(user.classId)}</span>
                </div>
              )}
              {user.role === 'guardian' && user.guardianOf && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Students:</span>
                  <span className="text-sm font-medium text-[#043c04]">{user.guardianOf.length} assigned</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {roleUsers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {role.replace('_', ' ')}s found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">View all users in the system</p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#e2dede]">
          <TabsTrigger value="headmaster" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
            Headmasters
          </TabsTrigger>
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
        <TabsContent value="headmaster" className="mt-6">
          {renderUserList('headmaster')}
        </TabsContent>
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
};import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users, GraduationCap, UserCircle } from 'lucide-react';
import { 
  getUsers, 
  getClasses,
  addActivityLog
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { User, Class } from '../../types';

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    const allClasses = getClasses();
    
    setUsers(allUsers.filter(u => u.role !== 'admin'));
    setClasses(allClasses);
  };

  const getClassName = (classId?: string) => {
    if (!classId) return 'Not assigned';
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown';
  };

  const renderUserList = (role: string) => {
    const roleUsers = users.filter(u => u.role === role);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleUsers.map((user) => (
          <Card key={user.id} className="border-2 border-[#e2dede] hover:border-[#e7ac3e] transition-all">
            <CardHeader className="pb-3">
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
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5d3010]">Role:</span>
                <Badge className="bg-[#e7ac3e] text-[#043c04] capitalize">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              {(user.role === 'teacher' || user.role === 'student') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Class:</span>
                  <span className="text-sm font-medium text-[#043c04]">{getClassName(user.classId)}</span>
                </div>
              )}
              {user.role === 'guardian' && user.guardianOf && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Students:</span>
                  <span className="text-sm font-medium text-[#043c04]">{user.guardianOf.length} assigned</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {roleUsers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {role.replace('_', ' ')}s found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">View all users in the system</p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#e2dede]">
          <TabsTrigger value="headmaster" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
            Headmasters
          </TabsTrigger>
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
        <TabsContent value="headmaster" className="mt-6">
          {renderUserList('headmaster')}
        </TabsContent>
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
};import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Users, GraduationCap, UserCircle } from 'lucide-react';
import { 
  getUsers, 
  getClasses,
  addActivityLog
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { User, Class } from '../../types';

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = getUsers();
    const allClasses = getClasses();
    
    setUsers(allUsers.filter(u => u.role !== 'admin'));
    setClasses(allClasses);
  };

  const getClassName = (classId?: string) => {
    if (!classId) return 'Not assigned';
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown';
  };

  const renderUserList = (role: string) => {
    const roleUsers = users.filter(u => u.role === role);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleUsers.map((user) => (
          <Card key={user.id} className="border-2 border-[#e2dede] hover:border-[#e7ac3e] transition-all">
            <CardHeader className="pb-3">
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
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5d3010]">Role:</span>
                <Badge className="bg-[#e7ac3e] text-[#043c04] capitalize">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              {(user.role === 'teacher' || user.role === 'student') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Class:</span>
                  <span className="text-sm font-medium text-[#043c04]">{getClassName(user.classId)}</span>
                </div>
              )}
              {user.role === 'guardian' && user.guardianOf && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#5d3010]">Students:</span>
                  <span className="text-sm font-medium text-[#043c04]">{user.guardianOf.length} assigned</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {roleUsers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {role.replace('_', ' ')}s found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">View all users in the system</p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-[#e2dede]">
          <TabsTrigger value="headmaster" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
            Headmasters
          </TabsTrigger>
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
        <TabsContent value="headmaster" className="mt-6">
          {renderUserList('headmaster')}
        </TabsContent>
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

    let familyId = newUser.familyId;

    // For mom role, validate family name and password
    if (newUser.role === 'mom') {
      if (!newUser.familyName || !newUser.familyPassword) {
        toast.error('Please enter family name and password for mom');
        return;
      }

      // Validate family password
      const validatedFamily = validateFamilyPassword(newUser.familyName, newUser.familyPassword);
      if (!validatedFamily) {
        toast.error('Invalid family name or password');
        return;
      }

      // Check if family already has a mom
      if (validatedFamily.momId) {
        toast.error('This family already has a mom assigned');
        return;
      }

      familyId = validatedFamily.id;
    }

    // For student role, validate family assignment
    if (newUser.role === 'student' && !familyId) {
      toast.error('Please assign a family for student');
      return;
    }

    const user: User = {
      id: generateId('user'),
      username: newUser.username,
      password: hashPassword(newUser.password),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      familyId: newUser.role === 'social_worker' ? undefined : familyId,
      createdAt: new Date().toISOString(),
    };

    const allUsers = getUsers();
    const updatedUsers = [...allUsers, user];
    saveUsers(updatedUsers);

    // Update family with momId when creating a mom
    if (user.role === 'mom' && user.familyId) {
      const updatedFamilies = families.map(f => 
        f.id === user.familyId 
          ? { ...f, momId: user.id }
          : f
      );
      saveFamilies(updatedFamilies);
      setFamilies(updatedFamilies);
    }

    // Update family if student
    if (user.role === 'student' && user.familyId) {
      const updatedFamilies = families.map(f => 
        f.id === user.familyId 
          ? { ...f, studentIds: [...f.studentIds, user.id] }
          : f
      );
      saveFamilies(updatedFamilies);
      setFamilies(updatedFamilies);
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

    toast.success(`${user.role.replace('_', ' ')} created successfully`);
    setNewUser({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'student',
      familyId: '',
      familyName: '',
      familyPassword: '',
    });
    setIsDialogOpen(false);
    loadData();
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    // Remove from family if student
    if (userToDelete.role === 'student' && userToDelete.familyId) {
      const updatedFamilies = families.map(f => 
        f.id === userToDelete.familyId
          ? { ...f, studentIds: f.studentIds.filter(id => id !== userId) }
          : f
      );
      saveFamilies(updatedFamilies);
      setFamilies(updatedFamilies);
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

  const getFamilyName = (familyId?: string) => {
    if (!familyId) return 'Not assigned';
    const family = families.find(f => f.id === familyId);
    return family ? family.name : 'Unknown';
  };

  const renderUserList = (role: UserRole) => {
    const roleUsers = users.filter(u => u.role === role);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roleUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge variant="secondary" className="capitalize">
                  {role.replace('_', ' ')}
                </Badge>
              </div>
              {(role === 'mom' || role === 'student') && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Family:</span>
                  <span className="text-sm font-medium">{getFamilyName(user.familyId)}</span>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Created {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {roleUsers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No {role.replace('_', ' ')}s found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manage Users</h2>
          <p className="text-gray-600 mt-1">Add and manage social workers, moms, and students</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value, familyId: '' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_worker">Social Worker</SelectItem>
                    <SelectItem value="mom">Mom</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              {newUser.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="family">Assign to Family</Label>
                  <Select value={newUser.familyId} onValueChange={(value) => setNewUser({ ...newUser, familyId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a family" />
                    </SelectTrigger>
                    <SelectContent>
                      {families.map((family) => (
                        <SelectItem key={family.id} value={family.id}>
                          {family.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {newUser.role === 'mom' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Family Name</Label>
                    <Input
                      id="familyName"
                      placeholder="Enter family name"
                      value={newUser.familyName}
                      onChange={(e) => setNewUser({ ...newUser, familyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyPassword">Family Password</Label>
                    <Input
                      id="familyPassword"
                      type="password"
                      placeholder="Enter family password"
                      value={newUser.familyPassword}
                      onChange={(e) => setNewUser({ ...newUser, familyPassword: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Enter the family password to verify access to this family.
                    </p>
                  </div>
                </>
              )}
              <Button onClick={handleCreateUser} className="w-full">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="student">Students</TabsTrigger>
          <TabsTrigger value="mom">Moms</TabsTrigger>
          <TabsTrigger value="social_worker">Social Workers</TabsTrigger>
        </TabsList>
        <TabsContent value="student" className="mt-6">
          {renderUserList('student')}
        </TabsContent>
        <TabsContent value="mom" className="mt-6">
          {renderUserList('mom')}
        </TabsContent>
        <TabsContent value="social_worker" className="mt-6">
          {renderUserList('social_worker')}
        </TabsContent>
      </Tabs>
    </div>
  );
};