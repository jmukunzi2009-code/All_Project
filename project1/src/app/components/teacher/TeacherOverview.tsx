import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraduationCap, BookOpen, Calendar, Users } from 'lucide-react';
import { getFamilyById, getUserById, getMarksByStudentId, getAttendanceByStudentId } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';

export const TeacherOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMarks: 0,
    totalAttendance: 0,
    familyName: '',
  });

  useEffect(() => {
    if (!user || !user.familyId) return;

    const family = getFamilyById(user.familyId);
    if (!family) return;

    let totalMarks = 0;
    let totalAttendance = 0;

    family.studentIds.forEach(studentId => {
      const marks = getMarksByStudentId(studentId);
      const attendance = getAttendanceByStudentId(studentId);
      totalMarks += marks.filter(m => m.status === 'approved').length;
      totalAttendance += attendance.filter(a => a.status === 'present').length;
    });

    setStats({
      totalStudents: family.studentIds.length,
      totalMarks,
      totalAttendance,
      familyName: family.name,
    });
  }, [user]);

  const statCards = [
    { title: 'My Students', value: stats.totalStudents, icon: GraduationCap, color: 'bg-blue-500' },
    { title: 'Total Marks', value: stats.totalMarks, icon: BookOpen, color: 'bg-green-500' },
    { title: 'Total Present Days', value: stats.totalAttendance, icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600 mt-1">Monitor your students from {stats.familyName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/mom/students"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">View Students</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor your students' performance</p>
            </a>
            <a
              href="/mom/chat"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Messages</h3>
              <p className="text-sm text-gray-600 mt-1">Chat with your students</p>
            </a>
            <a
              href="/mom/trending"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Trending Updates</h3>
              <p className="text-sm text-gray-600 mt-1">View important announcements</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
