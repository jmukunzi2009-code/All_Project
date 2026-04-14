import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { School, LogOut, Sun, Moon, Home, ClipboardList, Users, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { teachers, classes, students, marks, subjects, assignments } = useSchool();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get current teacher's data
  const currentTeacher = teachers.find(t => t.id === user?.id);
  const teacherAssignments = assignments.filter(a => a.teacherId === user?.id);
  const teacherClasses = classes.filter(c =>
    currentTeacher?.assignedClasses?.includes(c.id) ||
    currentTeacher?.classTeacherOf === c.id
  );
  const teacherSubjects = subjects.filter(s =>
    currentTeacher?.subjects?.includes(s.id)
  );

  // Get students from assigned classes
  const assignedStudents = students.filter(s =>
    teacherClasses.some(c => c.id === s.classId)
  );

  // Chart data
  const marksData = teacherSubjects.map(subject => ({
    subject: subject.name,
    marks: marks.filter(m => m.subjectId === subject.id && m.teacherId === user?.id).length,
  }));

  const attendanceData = teacherClasses.map(cls => ({
    class: cls.name,
    attendance: Math.floor(Math.random() * 100), // Placeholder, replace with real data
  }));

  const stats = [
    { label: 'My Classes', value: teacherClasses.length, icon: School },
    { label: 'My Subjects', value: teacherSubjects.length, icon: ClipboardList },
    { label: 'My Students', value: assignedStudents.length, icon: Users },
    { label: 'Marks Recorded', value: marks.filter(m => m.teacherId === user?.id).length, icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="border-b bg-white/95 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <School className="size-8 text-primary" />
            <div>
              <h1 className="text-xl">{currentTeacher?.role === 'class_teacher' ? 'Class Teacher Dashboard' : 'Teacher Dashboard'}</h1>
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
            <CardTitle>Teacher Profile</CardTitle>
            <CardDescription>Your teaching information and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-primary font-medium">{currentTeacher?.role === 'class_teacher' ? 'Class Teacher' : 'Teacher'}</p>
                <p className="text-sm text-muted-foreground">Role: {currentTeacher?.role === 'class_teacher' ? 'Class Teacher' : 'Subject Teacher'}</p>
                <p className="text-sm text-muted-foreground">Role: {currentTeacher?.role}</p>
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
                <stat.icon className="size-5 text-primary" />
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
              <CardTitle>Marks by Subject</CardTitle>
              <CardDescription>Number of marks recorded per subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <RechartsBarChart data={marksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="marks" fill="var(--chart-1)" />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Attendance</CardTitle>
              <CardDescription>Average attendance percentage per class</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="attendance" stroke="var(--chart-2)" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Class Teacher Activity */}
        {currentTeacher?.role === 'class_teacher' && currentTeacher.classTeacherOf && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Class Activity</CardTitle>
              <CardDescription>Recent marks and attendance in your class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Recent Marks Added</h4>
                  <div className="space-y-2">
                    {marks
                      .filter(m => students.find(s => s.id === m.studentId)?.classId === currentTeacher.classTeacherOf)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map(mark => {
                        const student = students.find(s => s.id === mark.studentId);
                        const subject = subjects.find(s => s.id === mark.subjectId);
                        const teacher = teachers.find(t => t.id === mark.teacherId);
                        return (
                          <div key={mark.id} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <p className="text-sm">{student?.name} - {subject?.name}</p>
                              <p className="text-xs text-muted-foreground">by {teacher?.name} on {mark.date}</p>
                            </div>
                            <Badge>{mark.marks}/{mark.maxMarks}</Badge>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Classes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>Classes you are teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teacherClasses.length > 0 ? (
                teacherClasses.map(cls => (
                  <div key={cls.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p>{cls.name}</p>
                      <p className="text-sm text-muted-foreground">{cls.studentIds.length} students</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No classes assigned yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Subjects */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Subjects</CardTitle>
            <CardDescription>Subjects you are teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {teacherSubjects.length > 0 ? (
                teacherSubjects.map(subject => (
                  <div key={subject.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p>{subject.name}</p>
                      <p className="text-sm text-muted-foreground">Code: {subject.code}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No subjects assigned yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your teaching tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/teacher/marks')}
              >
                <ClipboardList className="size-6" />
                <span className="text-sm">Manage Marks</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/teacher/attendance')}
              >
                <Users className="size-6" />
                <span className="text-sm">Take Attendance</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare className="size-6" />
                <span className="text-sm">Messages</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
