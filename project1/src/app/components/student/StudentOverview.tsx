import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getMarksByStudentId, getAttendanceByStudentId } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';

export const StudentOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMarks: 0,
    approvedMarks: 0,
    pendingMarks: 0,
    presentDays: 0,
  });

  useEffect(() => {
    if (!user) return;
    
    const marks = getMarksByStudentId(user.id);
    const attendance = getAttendanceByStudentId(user.id);

    setStats({
      totalMarks: marks.length,
      approvedMarks: marks.filter(m => m.status === 'approved').length,
      pendingMarks: marks.filter(m => m.status === 'pending').length,
      presentDays: attendance.filter(a => a.status === 'present').length,
    });
  }, [user]);

  const statCards = [
    { title: 'Total Marks', value: stats.totalMarks, icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Approved Marks', value: stats.approvedMarks, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Pending Marks', value: stats.pendingMarks, icon: XCircle, color: 'bg-orange-500' },
    { title: 'Days Present', value: stats.presentDays, icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600 mt-1">Track your academic progress and stay connected</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              href="/student/marks"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Add Marks</h3>
              <p className="text-sm text-gray-600 mt-1">Submit your test scores for approval</p>
            </a>
            <a
              href="/student/attendance"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Record Attendance</h3>
              <p className="text-sm text-gray-600 mt-1">Mark your presence for today</p>
            </a>
            <a
              href="/student/chat"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Messages</h3>
              <p className="text-sm text-gray-600 mt-1">Chat with your mom and social worker</p>
            </a>
            <a
              href="/student/trending"
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
