import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getMarks, saveMarks, getUserById, addActivityLog } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { Mark } from '../../types';

export const ApproveMarks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selectedMark, setSelectedMark] = useState<Mark | null>(null);
  const [comments, setComments] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    loadMarks();
  }, []);

  const loadMarks = () => {
    const allMarks = getMarks();
    setMarks(allMarks.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()));
  };

  const handleOpenDialog = (mark: Mark, actionType: 'approve' | 'reject') => {
    setSelectedMark(mark);
    setAction(actionType);
    setComments('');
    setIsDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedMark || !user) return;

    const allMarks = getMarks();
    const updatedMarks = allMarks.map(m =>
      m.id === selectedMark.id
        ? {
            ...m,
            status: action,
            approvedBy: user.id,
            approvalDate: new Date().toISOString(),
            comments: comments || undefined,
          }
        : m
    );
    saveMarks(updatedMarks);

    const student = getUserById(selectedMark.studentId);
    addActivityLog({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: action === 'approve' ? 'Approve Mark' : 'Reject Mark',
      details: `${action === 'approve' ? 'Approved' : 'Rejected'} ${selectedMark.subject} mark for ${student?.firstName} ${student?.lastName}`,
    });

    toast.success(`Mark ${action}d successfully`);
    setIsDialogOpen(false);
    loadMarks();
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const pendingMarks = marks.filter(m => m.status === 'pending');
  const reviewedMarks = marks.filter(m => m.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Approve Marks</h2>
        <p className="text-gray-600 mt-1">Review and approve student marks</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Pending Approval ({pendingMarks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingMarks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingMarks.map((mark) => {
                  const student = getUserById(mark.studentId);
                  return (
                    <TableRow key={mark.id}>
                      <TableCell className="font-medium">
                        {student ? `${student.firstName} ${student.lastName}` : 'Unknown'}
                      </TableCell>
                      <TableCell>{mark.subject}</TableCell>
                      <TableCell>{mark.score} / {mark.maxScore} ({((mark.score / mark.maxScore) * 100).toFixed(1)}%)</TableCell>
                      <TableCell>{mark.term} {mark.year}</TableCell>
                      <TableCell>{new Date(mark.dateAdded).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleOpenDialog(mark, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleOpenDialog(mark, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No pending marks to review</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviewed Marks ({reviewedMarks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewedMarks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewed By</TableHead>
                  <TableHead>Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewedMarks.map((mark) => {
                  const student = getUserById(mark.studentId);
                  const reviewer = mark.approvedBy ? getUserById(mark.approvedBy) : null;
                  return (
                    <TableRow key={mark.id}>
                      <TableCell className="font-medium">
                        {student ? `${student.firstName} ${student.lastName}` : 'Unknown'}
                      </TableCell>
                      <TableCell>{mark.subject}</TableCell>
                      <TableCell>{mark.score} / {mark.maxScore}</TableCell>
                      <TableCell>{mark.term} {mark.year}</TableCell>
                      <TableCell>{getStatusBadge(mark.status)}</TableCell>
                      <TableCell>{reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : '-'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{mark.comments || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviewed marks yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve' : 'Reject'} Mark
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMark && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Subject:</strong> {selectedMark.subject}</p>
                <p className="text-sm"><strong>Score:</strong> {selectedMark.score} / {selectedMark.maxScore}</p>
                <p className="text-sm"><strong>Term:</strong> {selectedMark.term} {selectedMark.year}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Comments (Optional)</label>
              <Textarea
                placeholder="Add comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleConfirmAction}
                className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={action === 'reject' ? 'destructive' : 'default'}
              >
                Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
