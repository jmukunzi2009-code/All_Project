import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { School, LogOut, Sun, Moon, Home, BarChart, MessageSquare, Users, BookOpen } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '../../components/ui/chart';
import { BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';

export default function HeadmasterDashboard() {
  const { user, logout } = useAuth();
  const { teachers, students, classes, marks, reports, subjects } = useSchool();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Teachers', value: teachers.length, icon: Users, color: 'text-blue-500' },
    { label: 'Total Students', value: students.length, icon: Users, color: 'text-green-500' },
    { label: 'Classes', value: classes.length, icon: School, color: 'text-purple-500' },
    { label: 'Reports Generated', value: reports.length, icon: BarChart, color: 'text-orange-500' },
  ];

  // Calculate average performance
  const averageMarks =
    marks.length > 0
      ? marks.reduce((sum, mark) => sum + (mark.marks / mark.maxMarks) * 100, 0) / marks.length
      : 0;

  const subjectPerformance = subjects.map((subject) => {
    const subjectMarks = marks.filter((m) => m.subjectId === subject.id);
    const average =
      subjectMarks.length > 0
        ? subjectMarks.reduce((sum, mark) => sum + (mark.marks / mark.maxMarks) * 100, 0) / subjectMarks.length
        : 0;

    return {
      subject: subject.name,
      average: Number(average.toFixed(0)),
    };
  }).slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white/95 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <School className="size-8 text-primary" />
            <div>
              <h1 className="text-xl">Headmaster Dashboard</h1>
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
            <CardTitle>Headmaster Profile</CardTitle>
            <CardDescription>Your leadership information and school oversight</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
                <School className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-primary font-medium">Headmaster</p>
                <p className="text-sm text-muted-foreground">School Leadership</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Performance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>School Performance Overview</CardTitle>
            <CardDescription>Monitor overall academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Average Student Performance</span>
                  <span className="text-sm">{averageMarks.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${averageMarks}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>• Total marks recorded: {marks.length}</p>
                <p>• Reports generated: {reports.length}</p>
                <p>• All teachers are actively recording marks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Average student scores by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ average: { label: 'Average score', color: '#0f766e' } }} className="h-80">
              <RechartsBarChart data={subjectPerformance} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="average" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access key features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/reports')}
              >
                <BarChart className="size-6" />
                <span className="text-sm">View All Reports</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="size-6" />
                <span className="text-sm">Messages</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="size-6" />
                <span className="text-sm">View Staff</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
