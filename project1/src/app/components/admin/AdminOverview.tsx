import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, UserCircle, GraduationCap, Home as HomeIcon } from 'lucide-react';
import { getUsers, getClasses, getMarks, getActivityLogs } from '../../lib/storage';

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalGuardians: 0,
    totalHeadmasters: 0,
    totalMarks: 0,
    recentActivities: 0,
  });

  useEffect(() => {
    const users = getUsers();
    const classes = getClasses();
    const marks = getMarks();
    const logs = getActivityLogs();

    setStats({
      totalClasses: classes.length,
      totalStudents: users.filter(u => u.role === 'student').length,
      totalTeachers: users.filter(u => u.role === 'teacher').length,
      totalGuardians: users.filter(u => u.role === 'guardian').length,
      totalHeadmasters: users.filter(u => u.role === 'headmaster').length,
      totalMarks: marks.length,
      recentActivities: logs.slice(-10).length,
    });
  }, []);

  const statCards = [
    { title: 'Total Classes', value: stats.totalClasses, icon: HomeIcon, color: 'bg-blue-500' },
    { title: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Total Teachers', value: stats.totalTeachers, icon: UserCircle, color: 'bg-purple-500' },
    { title: 'Total Guardians', value: stats.totalGuardians, icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">System Overview</h2>
        <p className="text-gray-600 mt-1">Welcome to the Ingabo Marks Track administration panel</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/families"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Families</h3>
              <p className="text-sm text-gray-600 mt-1">Create and organize family groups</p>
            </a>
            <a
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">Add social workers, moms, and students</p>
            </a>
            <a
              href="/admin/logs"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">View Activity Logs</h3>
              <p className="text-sm text-gray-600 mt-1">Monitor system activity and security</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
