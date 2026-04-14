import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { getUserById, getMarksByStudentId, getAttendanceByStudentId, getSubjectsByClassId, getClassById } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';

export const GuardianChildren = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  useEffect(() => {
    if (user?.guardianOf) {
      const childrenData = user.guardianOf.map(studentId => {
        const student = getUserById(studentId);
        if (!student) return null;

        const studentClass = getClassById(student.classId || '');
        const marks = getMarksByStudentId(studentId);
        const attendance = getAttendanceByStudentId(studentId);

        return {
          id: studentId,
          student,
          class: studentClass,
          marks,
          attendance,
        };
      }).filter(Boolean);

      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0].id);
      }
    }
  }, [user]);

  const selectedChildData = children.find(c => c.id === selectedChild);

  const getMarkStatus = (mark: any) => {
    if (mark.status === 'pending') return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
    if (mark.status === 'approved') {
      return mark.score >= 50
        ? { label: 'Pass', color: 'bg-green-100 text-green-800' }
        : { label: 'Fail', color: 'bg-red-100 text-red-800' };
    }
    return { label: 'Rejected', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">My Children</h2>
        <p className="text-gray-600 mt-1">View detailed academic progress for each child</p>
      </div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No children assigned to your account</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Children List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Children</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedChild === child.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">
                      {child.student.firstName} {child.student.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Class: {child.class?.name || 'Not assigned'}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Child Details */}
          <div className="lg:col-span-3">
            {selectedChildData && (
              <Tabs defaultValue="marks" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="marks">Marks</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                </TabsList>

                <TabsContent value="marks" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Academic Marks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedChildData.marks.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No marks recorded yet</p>
                        ) : (
                          selectedChildData.marks.map((mark: any) => {
                            const status = getMarkStatus(mark);
                            return (
                              <div key={mark.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium">{mark.subject}</h4>
                                    <p className="text-sm text-gray-600">
                                      {mark.term} {mark.year} • Max: {mark.maxScore}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">{mark.score}/{mark.maxScore}</div>
                                    <Badge className={status.color}>{status.label}</Badge>
                                  </div>
                                </div>
                                {mark.comments && mark.comments.length > 0 && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                    <strong>Comments:</strong> {mark.comments[0].comment}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedChildData.attendance.length === 0 ? (
                          <p className="text-gray-500 col-span-full text-center py-4">No attendance records</p>
                        ) : (
                          selectedChildData.attendance.map((record: any) => (
                            <div key={record.id} className="p-3 border border-gray-200 rounded-lg">
                              <div className="text-sm font-medium">{new Date(record.date).toLocaleDateString()}</div>
                              <Badge
                                className={`mt-1 ${
                                  record.status === 'present'
                                    ? 'bg-green-100 text-green-800'
                                    : record.status === 'absent'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {record.status}
                              </Badge>
                              {record.notes && (
                                <p className="text-xs text-gray-600 mt-1">{record.notes}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Academic Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Total Marks</h4>
                            <p className="text-2xl font-bold text-blue-600">
                              {selectedChildData.marks.filter((m: any) => m.status === 'approved').length}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Average Score</h4>
                            <p className="text-2xl font-bold text-green-600">
                              {selectedChildData.marks.filter((m: any) => m.status === 'approved').length > 0
                                ? Math.round(
                                    selectedChildData.marks
                                      .filter((m: any) => m.status === 'approved')
                                      .reduce((sum: number, m: any) => sum + (m.score / m.maxScore) * 100, 0) /
                                    selectedChildData.marks.filter((m: any) => m.status === 'approved').length
                                  )
                                : 0}%
                            </p>
                          </div>
                        </div>

                        {selectedChildData.marks.filter((m: any) => m.status === 'approved' && m.score < 50).length > 0 && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <h4 className="font-medium text-red-900">Subjects Needing Attention</h4>
                            </div>
                            <div className="space-y-1">
                              {selectedChildData.marks
                                .filter((m: any) => m.status === 'approved' && m.score < 50)
                                .map((mark: any) => (
                                  <div key={mark.id} className="text-sm text-red-800">
                                    • {mark.subject}: {mark.score}/{mark.maxScore}
                                  </div>
                                ))}
                            </div>
                            <Button
                              size="sm"
                              className="mt-3"
                              onClick={() => {
                                // Navigate to chat with teacher
                                window.location.href = `/guardian/chat?concern=${selectedChild}`;
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Discuss with Teacher
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      )}
    </div>
  );
};