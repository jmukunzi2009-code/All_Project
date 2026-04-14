import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getAttendanceByStudentId, getAttendance, saveAttendance, generateId, addActivityLog } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { Attendance } from '../../types';

export const MyAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late' | 'excused',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      loadAttendance();
    }
  }, [user]);

  const loadAttendance = () => {
    if (!user) return;
    const studentAttendance = getAttendanceByStudentId(user.id);
    setAttendance(studentAttendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleAddAttendance = () => {
    if (!user || !newAttendance.date || !newAttendance.status) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if attendance already exists for this date
    const existingAttendance = attendance.find(a => a.date === newAttendance.date);
    if (existingAttendance) {
      toast.error('Attendance already recorded for this date');
      return;
    }

    const record: Attendance = {
      id: generateId('attendance'),
      studentId: user.id,
      date: newAttendance.date,
      status: newAttendance.status,
      notes: newAttendance.notes || undefined,
      addedBy: user.id,
      createdAt: new Date().toISOString(),
    };

    const allAttendance = getAttendance();
    const updatedAttendance = [...allAttendance, record];
    saveAttendance(updatedAttendance);

    addActivityLog({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: 'Record Attendance',
      details: `Recorded ${newAttendance.status} for ${newAttendance.date}`,
    });

    toast.success('Attendance recorded successfully');
    setNewAttendance({ date: new Date().toISOString().split('T')[0], status: 'present', notes: '' });
    setIsDialogOpen(false);
    loadAttendance();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'late':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'excused':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-orange-100 text-orange-800',
      excused: 'bg-blue-100 text-blue-800',
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const stats = {
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Attendance</h2>
          <p className="text-gray-600 mt-1">Track and record your attendance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Attendance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <input
                  id="date"
                  type="date"
                  value={newAttendance.date}
                  onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newAttendance.status} onValueChange={(value: any) => setNewAttendance({ ...newAttendance, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes..."
                  value={newAttendance.notes}
                  onChange={(e) => setNewAttendance({ ...newAttendance, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleAddAttendance} className="w-full">
                Record Attendance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Excused</p>
                <p className="text-2xl font-bold text-gray-900">{stats.excused}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Attendance History ({attendance.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Recorded On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{record.notes || '-'}</TableCell>
                    <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No attendance records yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Record Attendance" to add your first record</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
