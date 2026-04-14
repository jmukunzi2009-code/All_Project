import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, GraduationCap, BookOpen } from 'lucide-react';
import { getClasses, getUserById, getMarksByStudentId, getAttendanceByStudentId } from '../../lib/storage';
import type { Class } from '../../types';

export const ViewAllClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    setClasses(getClasses());
  }, []);

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Not assigned';
    const teacher = getUserById(teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const getStudentInfo = (studentId: string) => {
    const student = getUserById(studentId);
    if (!student) return null;
    
    const marks = getMarksByStudentId(studentId);
    const attendance = getAttendanceByStudentId(studentId);
    const approvedMarks = marks.filter(m => m.status === 'approved').length;
    const presentDays = attendance.filter(a => a.status === 'present').length;

    return {
      name: `${student.firstName} ${student.lastName}`,
      marks: `${approvedMarks} approved`,
      attendance: `${presentDays} days present`,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">All Classes</h2>
        <p className="text-gray-600 mt-1">Monitor all classes and their students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>{cls.name}</CardTitle>
                  <p className="text-sm text-gray-500">Teacher: {getTeacherName(cls.teacherId)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Students ({cls.studentIds.length})</h4>
                {cls.studentIds.map((studentId) => {
                  const info = getStudentInfo(studentId);
                  if (!info) return null;
                  return (
                    <div key={studentId} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-gray-600" />
                        <p className="font-medium text-sm">{info.name}</p>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Marks: {info.marks}</p>
                        <p>Attendance: {info.attendance}</p>
                      </div>
                    </div>
                  );
                })}
                {cls.studentIds.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No students assigned</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {classes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No classes to display</p>
          </div>
        )}
      </div>
    </div>
  );
};
