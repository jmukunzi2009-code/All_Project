import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getMarksByStudentId, getMarks, saveMarks, generateId, addActivityLog } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { Mark } from '../../types';

const SUBJECTS = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
const CURRENT_YEAR = new Date().getFullYear().toString();

export const MyMarks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMark, setNewMark] = useState({
    subject: '',
    score: '',
    maxScore: '100',
    term: '',
    year: CURRENT_YEAR,
  });

  useEffect(() => {
    if (user) {
      loadMarks();
    }
  }, [user]);

  const loadMarks = () => {
    if (!user) return;
    const studentMarks = getMarksByStudentId(user.id);
    setMarks(studentMarks.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()));
  };

  const handleAddMark = () => {
    if (!user || !newMark.subject || !newMark.score || !newMark.maxScore || !newMark.term) {
      toast.error('Please fill in all fields');
      return;
    }

    const score = parseFloat(newMark.score);
    const maxScore = parseFloat(newMark.maxScore);

    if (isNaN(score) || isNaN(maxScore) || score < 0 || maxScore <= 0 || score > maxScore) {
      toast.error('Please enter valid scores');
      return;
    }

    const mark: Mark = {
      id: generateId('mark'),
      studentId: user.id,
      subject: newMark.subject,
      score,
      maxScore,
      term: newMark.term,
      year: newMark.year,
      dateAdded: new Date().toISOString(),
      addedBy: user.id,
      status: 'pending',
    };

    const allMarks = getMarks();
    const updatedMarks = [...allMarks, mark];
    saveMarks(updatedMarks);

    addActivityLog({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: 'Add Mark',
      details: `Added ${newMark.subject} mark: ${score}/${maxScore} - ${newMark.term}`,
    });

    toast.success('Mark submitted for approval');
    setNewMark({ subject: '', score: '', maxScore: '100', term: '', year: CURRENT_YEAR });
    setIsDialogOpen(false);
    loadMarks();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Marks</h2>
          <p className="text-gray-600 mt-1">View and add your academic marks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Mark
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Mark</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={newMark.subject} onValueChange={(value) => setNewMark({ ...newMark, subject: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">Score</Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="85"
                    value={newMark.score}
                    onChange={(e) => setNewMark({ ...newMark, score: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxScore">Max Score</Label>
                  <Input
                    id="maxScore"
                    type="number"
                    value={newMark.maxScore}
                    onChange={(e) => setNewMark({ ...newMark, maxScore: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Select value={newMark.term} onValueChange={(value) => setNewMark({ ...newMark, term: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERMS.map((term) => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMark} className="w-full">
                Submit Mark for Approval
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            All Marks ({marks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {marks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marks.map((mark) => (
                  <TableRow key={mark.id}>
                    <TableCell className="font-medium">{mark.subject}</TableCell>
                    <TableCell>{mark.score} / {mark.maxScore}</TableCell>
                    <TableCell>{((mark.score / mark.maxScore) * 100).toFixed(1)}%</TableCell>
                    <TableCell>{mark.term}</TableCell>
                    <TableCell>{mark.year}</TableCell>
                    <TableCell>{getStatusBadge(mark.status)}</TableCell>
                    <TableCell>{new Date(mark.dateAdded).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No marks recorded yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Mark" to submit your first mark</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
