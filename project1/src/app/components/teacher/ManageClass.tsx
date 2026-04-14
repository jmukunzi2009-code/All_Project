import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { GraduationCap, BookOpen, Calendar, MessageSquare, Eye } from 'lucide-react';
import { getFamilyById, getUserById, getMarksByStudentId, getAttendanceByStudentId, getMarks, saveMarks, generateId } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { User, Mark, Attendance, MarkComment } from '../../types';

export const ManageClass = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedMark, setSelectedMark] = useState<Mark | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!user || !user.familyId) return;

    const family = getFamilyById(user.familyId);
    if (!family) return;

    const studentList = family.studentIds.map(id => getUserById(id)).filter(s => s) as User[];
    setStudents(studentList);

    if (studentList.length > 0 && !selectedStudent) {
      setSelectedStudent(studentList[0]);
    }
  }, [user]);

  useEffect(() => {
    if (selectedStudent) {
      setMarks(getMarksByStudentId(selectedStudent.id));
      setAttendance(getAttendanceByStudentId(selectedStudent.id));
    }
  }, [selectedStudent]);

  const handleAddComment = () => {
    if (!comment.trim() || !selectedMark || !user) {
      toast.error('Please enter a comment');
      return;
    }

    const newComment: MarkComment = {
      id: generateId('comment'),
      markId: selectedMark.id,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const allMarks = getMarks();
    const updatedMarks = allMarks.map(m =>
      m.id === selectedMark.id
        ? { ...m, comments: [...(m.comments || []), newComment] }
        : m
    );

    saveMarks(updatedMarks);
    setMarks(getMarksByStudentId(selectedStudent!.id));
    toast.success('Comment added successfully');
    setComment('');
    setIsDialogOpen(false);
    setSelectedMark(null);
  };

  const openCommentDialog = (mark: Mark) => {
    setSelectedMark(mark);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const marksColors = {
      approved: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-[#e7ac3e]/30 text-[#5d3010] border-[#e7ac3e]',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const attendanceColors = {
      present: 'bg-green-100 text-green-800 border-green-300',
      absent: 'bg-red-100 text-red-800 border-red-300',
      late: 'bg-[#e7ac3e]/30 text-[#5d3010] border-[#e7ac3e]',
      excused: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    const colors = { ...marksColors, ...attendanceColors };
    return <Badge className={colors[status as keyof typeof colors] + ' border'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#043c04]">My Students</h2>
        <p className="text-[#5d3010] mt-1">Monitor your students' academic progress and add comments</p>
      </div>

      {students.length > 0 ? (
        <>
          <div className="flex gap-2 flex-wrap">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  selectedStudent?.id === student.id
                    ? 'border-[#e7ac3e] bg-[#e7ac3e]/20 text-[#043c04] font-semibold'
                    : 'border-[#e2dede] hover:border-[#e7ac3e] text-[#5d3010]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-medium">{student.firstName} {student.lastName}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedStudent && (
            <Tabs defaultValue="marks" className="w-full">
              <TabsList className="bg-[#e2dede]">
                <TabsTrigger value="marks" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
                  Marks
                </TabsTrigger>
                <TabsTrigger value="attendance" className="data-[state=active]:bg-[#043c04] data-[state=active]:text-white">
                  Attendance
                </TabsTrigger>
              </TabsList>
              <TabsContent value="marks" className="mt-6">
                <Card className="border-2 border-[#e2dede]">
                  <CardHeader className="bg-gradient-to-r from-[#043c04] to-[#5d3010] text-white">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Marks for {selectedStudent.firstName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {marks.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-[#043c04]">Subject</TableHead>
                            <TableHead className="text-[#043c04]">Score</TableHead>
                            <TableHead className="text-[#043c04]">Percentage</TableHead>
                            <TableHead className="text-[#043c04]">Term</TableHead>
                            <TableHead className="text-[#043c04]">Status</TableHead>
                            <TableHead className="text-[#043c04]">Date Added</TableHead>
                            <TableHead className="text-[#043c04]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {marks.map((mark) => (
                            <TableRow key={mark.id}>
                              <TableCell className="font-medium text-[#043c04]">{mark.subject}</TableCell>
                              <TableCell className="text-[#5d3010]">{mark.score} / {mark.maxScore}</TableCell>
                              <TableCell className="text-[#5d3010]">{((mark.score / mark.maxScore) * 100).toFixed(1)}%</TableCell>
                              <TableCell className="text-[#5d3010]">{mark.term} {mark.year}</TableCell>
                              <TableCell>{getStatusBadge(mark.status)}</TableCell>
                              <TableCell className="text-[#5d3010]">{new Date(mark.dateAdded).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openCommentDialog(mark)}
                                    className="border-[#043c04] text-[#043c04] hover:bg-[#043c04] hover:text-white"
                                  >
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    {mark.comments && mark.comments.length > 0 ? `Comments (${mark.comments.length})` : 'Add Comment'}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
                        <p className="text-[#5d3010]">No marks recorded yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="attendance" className="mt-6">
                <Card className="border-2 border-[#e2dede]">
                  <CardHeader className="bg-gradient-to-r from-[#043c04] to-[#5d3010] text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Attendance for {selectedStudent.firstName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {attendance.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-[#043c04]">Date</TableHead>
                            <TableHead className="text-[#043c04]">Status</TableHead>
                            <TableHead className="text-[#043c04]">Notes</TableHead>
                            <TableHead className="text-[#043c04]">Recorded On</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendance.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium text-[#043c04]">{new Date(record.date).toLocaleDateString()}</TableCell>
                              <TableCell>{getStatusBadge(record.status)}</TableCell>
                              <TableCell className="text-sm text-[#5d3010]">{record.notes || '-'}</TableCell>
                              <TableCell className="text-[#5d3010]">{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
                        <p className="text-[#5d3010]">No attendance records yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      ) : (
        <Card className="border-2 border-[#e2dede]">
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
            <p className="text-[#5d3010]">No students assigned to your family yet</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#043c04]">
              Comments for {selectedMark?.subject} - {selectedStudent?.firstName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMark?.comments && selectedMark.comments.length > 0 && (
              <div className="space-y-3 mb-4">
                <h4 className="font-semibold text-[#043c04]">Previous Comments:</h4>
                {selectedMark.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-[#e2dede]/50 rounded-lg border border-[#e2dede]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#043c04]">{c.userName}</span>
                      <span className="text-xs text-[#5d3010]">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-[#5d3010]">{c.comment}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="font-semibold text-[#043c04]">Add New Comment:</h4>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment about this mark..."
                rows={4}
                className="border-[#e2dede] focus:border-[#e7ac3e] focus:ring-[#e7ac3e]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddComment}
                className="flex-1 bg-[#e7ac3e] hover:bg-[#d49a2e] text-[#043c04] font-semibold"
              >
                Add Comment
              </Button>
              <Button
                onClick={() => {
                  setIsDialogOpen(false);
                  setComment('');
                  setSelectedMark(null);
                }}
                variant="outline"
                className="border-[#5d3010] text-[#5d3010] hover:bg-[#e2dede]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};