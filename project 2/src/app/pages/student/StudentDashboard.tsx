import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { School, LogOut, Sun, Moon, Home, FileText, Calendar, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { marks, attendance, subjects, classes, students, terms } = useSchool();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get current student data
  const currentStudent = students.find(s => s.id === user?.id);
  const studentClass = classes.find(c => c.id === currentStudent?.classId);
  const studentMarks = marks.filter(m => m.studentId === user?.id);
  const studentAttendance = attendance.filter(a => a.studentId === user?.id);

  // Calculate attendance percentage
  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter(a => a.status === 'present').length;
  const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  // Calculate average marks
  const averageMarks =
    studentMarks.length > 0
      ? studentMarks.reduce((sum, mark) => sum + (mark.marks / mark.maxMarks) * 100, 0) /
        studentMarks.length
      : 0;

  const currentTerm = terms.find(t => t.isCurrent);

  // Chart data
  const marksBySubject = subjects.map(subject => {
    const subjectMarks = studentMarks.filter(m => m.subjectId === subject.id);
    const average = subjectMarks.length > 0
      ? subjectMarks.reduce((sum, m) => sum + (m.marks / m.maxMarks) * 100, 0) / subjectMarks.length
      : 0;
    return {
      subject: subject.name,
      average: Math.round(average),
    };
  }).filter(item => item.average > 0);

  const attendanceOverTime = studentAttendance.slice(-10).map((att, index) => ({
    day: `Day ${index + 1}`,
    status: att.status === 'present' ? 100 : 0,
  }));

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white/95 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <School className="size-8 text-primary" />
            <div>
              <h1 className="text-xl">Student Dashboard</h1>
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
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>Your academic information and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-primary font-medium">Student</p>
                <p className="text-sm text-muted-foreground">Class: {studentClass?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p>{studentClass?.name || 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrollment Date</p>
                <p>{currentStudent?.enrollmentDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Term</p>
                <p>{currentTerm?.name || 'No active term'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl mb-2">{averageMarks.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Average across all subjects</p>
              <div className="mt-4">
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${averageMarks}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl mb-2">{attendancePercentage.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">
                Present {presentDays} out of {totalDays} days
              </p>
              <div className="mt-4">
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${attendancePercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Marks by Subject</CardTitle>
              <CardDescription>Average performance per subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <RechartsBarChart data={marksBySubject}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="average" fill="var(--chart-1)" />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Attendance status over the last 10 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <LineChart data={attendanceOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="status" stroke="var(--chart-2)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Marks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Marks</CardTitle>
            <CardDescription>Your recent academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            {studentMarks.length > 0 ? (
              <div className="space-y-3">
                {studentMarks.slice(-5).reverse().map((mark) => {
                  const subject = subjects.find(s => s.id === mark.subjectId);
                  const percentage = (mark.marks / mark.maxMarks) * 100;

                  return (
                    <div
                      key={mark.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p>{subject?.name || 'Unknown Subject'}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {mark.type} • {mark.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl">
                          {mark.marks}/{mark.maxMarks}
                        </p>
                        <Badge variant={percentage >= 70 ? 'default' : 'destructive'}>
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No marks recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/reports')}
              >
                <FileText className="size-6" />
                <span className="text-sm">View Reports</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/messages')}
              >
                <School className="size-6" />
                <span className="text-sm">Messages</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
