import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, GraduationCap, TrendingUp, MessageSquare } from 'lucide-react';
import { getUserById, getMarksByStudentId, getAttendanceByStudentId } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';

export const GuardianOverview = () => {
  const { user } = useAuth();
  const [childrenInfo, setChildrenInfo] = useState<any[]>([]);

  useEffect(() => {
    if (user?.guardianOf) {
      const info = user.guardianOf.map(studentId => {
        const student = getUserById(studentId);
        if (!student) return null;

        const marks = getMarksByStudentId(studentId);
        const attendance = getAttendanceByStudentId(studentId);
        const approvedMarks = marks.filter(m => m.status === 'approved').length;
        const totalMarks = marks.length;
        const presentDays = attendance.filter(a => a.status === 'present').length;
        const totalDays = attendance.length;

        return {
          id: studentId,
          name: `${student.firstName} ${student.lastName}`,
          marksApproved: approvedMarks,
          marksTotal: totalMarks,
          attendanceRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
          failedSubjects: marks.filter(m => m.status === 'approved' && m.score < 50).length,
        };
      }).filter(Boolean);

      setChildrenInfo(info);
    }
  }, [user]);

  const totalChildren = childrenInfo.length;
  const totalMarks = childrenInfo.reduce((sum, child) => sum + child.marksTotal, 0);
  const approvedMarks = childrenInfo.reduce((sum, child) => sum + child.marksApproved, 0);
  const avgAttendance = childrenInfo.length > 0
    ? Math.round(childrenInfo.reduce((sum, child) => sum + child.attendanceRate, 0) / childrenInfo.length)
    : 0;
  const childrenWithFailures = childrenInfo.filter(child => child.failedSubjects > 0).length;

  const statCards = [
    { title: 'My Children', value: totalChildren, icon: Users, color: 'bg-blue-500' },
    { title: 'Approved Marks', value: `${approvedMarks}/${totalMarks}`, icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Avg Attendance', value: `${avgAttendance}%`, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Children Needing Attention', value: childrenWithFailures, icon: MessageSquare, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Guardian Overview</h2>
        <p className="text-gray-600 mt-1">Monitor your children's academic progress and well-being</p>
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
          <CardTitle>My Children</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {childrenInfo.map((child) => (
              <div key={child.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{child.name}</h3>
                  {child.failedSubjects > 0 && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {child.failedSubjects} failing subject{child.failedSubjects > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Marks: {child.marksApproved}/{child.marksTotal} approved</div>
                  <div>Attendance: {child.attendanceRate}%</div>
                </div>
              </div>
            ))}
            {childrenInfo.length === 0 && (
              <p className="text-gray-500 text-center py-4">No children assigned yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};