import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Users,
  BookOpen,
  School,
  Calendar,
  BarChart,
  Settings,
  LogOut,
  Sun,
  Moon,
  Home,
  UserCheck,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';

export default function AdminDashboard() {
  const { user, logout, getAllUsers } = useAuth();
  const { teachers, students, classes, subjects, terms } = useSchool();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allUsers = getAllUsers();
  const totalUsers = allUsers.length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-indigo-500' },
    { label: 'Teachers', value: teachers.length, icon: Users, color: 'text-blue-500' },
    { label: 'Students', value: students.length, icon: Users, color: 'text-green-500' },
    { label: 'Classes', value: classes.length, icon: School, color: 'text-purple-500' },
    { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'text-orange-500' },
  ];

  // Chart data
  const userTypeData = [
    { name: 'Teachers', value: teachers.length, fill: 'var(--chart-1)' },
    { name: 'Students', value: students.length, fill: 'var(--chart-2)' },
  ];

  const classData = classes.map(cls => ({
    name: cls.name,
    students: cls.studentIds.length,
  }));

  const quickActions = [
    { label: 'Manage Users', icon: Users, path: '/admin/users' },
    { label: 'Manage Classes', icon: School, path: '/admin/classes' },
    { label: 'Manage Subjects', icon: BookOpen, path: '/admin/subjects' },
    { label: 'Teacher Assignments', icon: UserCheck, path: '/admin/assignments' },
    { label: 'Manage Terms', icon: Calendar, path: '/admin/terms' },
    { label: 'View Reports', icon: BarChart, path: '/reports' },
  ];

  const currentTerm = terms.find(t => t.isCurrent);
  const setupComplete = totalUsers > 1 && classes.length > 0 && subjects.length > 0;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white/95 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <School className="size-8 text-primary" />
            <div>
              <h1 className="text-xl">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Home className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>Your account information and system access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-primary font-medium">Administrator</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Setup Alert */}
        {!setupComplete && (
          <Card className="mb-8 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-300">Getting Started</CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Complete the following steps to set up your school management system:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {totalUsers === 1 && <p>✓ Step 1: Create user accounts (teachers, headmaster, students)</p>}
                {totalUsers > 1 && <p className="text-green-600 dark:text-green-400">✅ Users created</p>}
                {classes.length === 0 && <p>✓ Step 2: Create classes and assign class teachers</p>}
                {classes.length > 0 && <p className="text-green-600 dark:text-green-400">✅ Classes created</p>}
                {subjects.length === 0 && <p>✓ Step 3: Create subjects and assign teachers</p>}
                {subjects.length > 0 && <p className="text-green-600 dark:text-green-400">✅ Subjects created</p>}
                {terms.length === 0 && <p>✓ Step 4: Create academic terms</p>}
                {terms.length > 0 && <p className="text-green-600 dark:text-green-400">✅ Terms created</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.label}</CardTitle>
                <stat.icon className={`size-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown of teachers and students</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Enrollment</CardTitle>
              <CardDescription>Number of students per class</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <RechartsBarChart data={classData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="students" fill="var(--chart-3)" />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              As Admin, you have full control over the system structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex flex-col gap-2"
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className="size-6" />
                  <span className="text-sm text-center">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Monitor the complete academic structure and ensure everything runs smoothly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm mb-2">Recent Activity</h3>
                <div className="text-sm text-muted-foreground">
                  <p>• System running normally</p>
                  <p>• All teachers have been assigned to classes</p>
                  <p>• Current term: {currentTerm?.name || 'Not set'}</p>
                  <p>• Academic year: {currentTerm?.year || 'Not set'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}