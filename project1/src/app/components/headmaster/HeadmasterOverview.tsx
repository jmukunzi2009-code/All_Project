import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, GraduationCap, Clock, CheckCircle, BookOpen, TrendingUp } from 'lucide-react';
import { getUsers, getClasses, getMarks, getTrendingPosts } from '../../lib/storage';

export const HeadmasterOverview = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    pendingMarks: 0,
    approvedMarks: 0,
    totalAnnouncements: 0,
  });

  useEffect(() => {
    const users = getUsers();
    const classes = getClasses();
    const marks = getMarks();
    const announcements = getTrendingPosts();

    setStats({
      totalClasses: classes.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalTeachers: users.filter(u => u.role === 'teacher').length,
      pendingMarks: marks.filter(m => m.status === 'pending').length,
      approvedMarks: marks.filter(m => m.status === 'approved').length,
      totalAnnouncements: announcements.length,
    });
  }, []);

  const statCards = [
    { title: 'Total Classes', value: stats.totalClasses, icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Total Teachers', value: stats.totalTeachers, icon: Users, color: 'bg-teal-500' },
    { title: 'Pending Marks', value: stats.pendingMarks, icon: Clock, color: 'bg-orange-500' },
    { title: 'Approved Marks', value: stats.approvedMarks, icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'School Announcements', value: stats.totalAnnouncements, icon: TrendingUp, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Headmaster Overview</h2>
        <p className="text-gray-600 mt-1">Manage school operations, teachers, and student progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/headmaster/marks"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Approve Marks</h3>
              <p className="text-sm text-gray-600 mt-1">Review and approve student marks</p>
            </a>
            <a
              href="/headmaster/classes"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">View Classes</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor all classes and students</p>
            </a>
            <a
              href="/headmaster/trending"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Announcements</h3>
              <p className="text-sm text-gray-600 mt-1">Post school announcements and updates</p>
            </a>
            <a
              href="/headmaster/chat"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">School Communication</h3>
              <p className="text-sm text-gray-600 mt-1">Communicate with teachers and community</p>
            </a>
            <a
              href="/headmaster/teachers"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Teachers</h3>
              <p className="text-sm text-gray-600 mt-1">Add teachers and assign to classes</p>
            </a>
            <a
              href="/headmaster/bookings"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Teacher Bookings</h3>
              <p className="text-sm text-gray-600 mt-1">Manage student-teacher tutoring sessions</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
