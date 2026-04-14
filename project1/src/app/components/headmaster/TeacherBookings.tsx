import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, Clock, BookOpen, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getBookings,
  saveBookings,
  getUsers,
  getUserById,
  addActivityLog
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { TeacherBooking, User as UserType } from '../../types';

export const TeacherBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<TeacherBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<TeacherBooking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    const allBookings = getBookings();
    setBookings(allBookings.filter(b => b.teacherId === user.id));
  };

  const handleUpdateStatus = (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed', note?: string) => {
    const allBookings = getBookings();
    const updatedBookings = allBookings.map(b => 
      b.id === bookingId 
        ? { ...b, status, notes: note || b.notes }
        : b
    );
    saveBookings(updatedBookings);
    setBookings(updatedBookings.filter(b => b.teacherId === user?.id));

    const booking = allBookings.find(b => b.id === bookingId);
    if (booking && user) {
      addActivityLog({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        action: 'Update Booking',
        details: `Updated booking status to ${status}`,
      });
    }

    toast.success(`Booking ${status}!`);
    setIsDialogOpen(false);
    setSelectedBooking(null);
    setNotes('');
  };

  const openBookingDialog = (booking: TeacherBooking) => {
    setSelectedBooking(booking);
    setNotes(booking.notes || '');
    setIsDialogOpen(true);
  };

  const getStudent = (studentId: string) => {
    return getUserById(studentId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#043c04]">Teacher Bookings</h2>
        <p className="text-[#5d3010] mt-1">Manage student booking requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5d3010]">Pending</p>
                <p className="text-3xl font-bold text-[#043c04]">{pendingBookings.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5d3010]">Confirmed</p>
                <p className="text-3xl font-bold text-[#043c04]">{confirmedBookings.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5d3010]">Completed</p>
                <p className="text-3xl font-bold text-[#043c04]">{completedBookings.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
            <p className="text-[#5d3010]">No bookings yet</p>
          </div>
        )}

        {bookings.map((booking) => {
          const student = getStudent(booking.studentId);
          return (
            <Card key={booking.id} className="border-2 border-[#e2dede] hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-[#043c04]">
                      <AvatarImage src={student?.profileImage} />
                      <AvatarFallback className="bg-gradient-to-br from-[#043c04] to-[#5d3010] text-white">
                        {student?.firstName[0]}{student?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-[#043c04]">
                        {student?.firstName} {student?.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <BookOpen className="w-3 h-3 text-[#5d3010]" />
                        <p className="text-sm text-[#5d3010]">{booking.subject}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <Badge className={`${getStatusColor(booking.status)} border capitalize`}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-[#043c04]">Description:</p>
                  <p className="text-sm text-[#5d3010]">{booking.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#043c04]" />
                    <span className="text-[#5d3010]">
                      {new Date(booking.scheduledDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#043c04]" />
                    <span className="text-[#5d3010]">{booking.scheduledTime}</span>
                  </div>
                </div>

                {booking.notes && (
                  <div className="p-3 bg-[#e2dede]/50 rounded-lg border border-[#e2dede]">
                    <p className="text-xs font-medium text-[#043c04] mb-1">Your Note:</p>
                    <p className="text-sm text-[#5d3010]">{booking.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {booking.status === 'pending' && (
                    <>
                      <Button 
                        onClick={() => openBookingDialog(booking)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm
                      </Button>
                      <Button 
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button 
                      onClick={() => handleUpdateStatus(booking.id, 'completed')}
                      className="flex-1 bg-[#043c04] hover:bg-[#032d03] text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                  {booking.status !== 'pending' && (
                    <Button 
                      onClick={() => openBookingDialog(booking)}
                      variant="outline"
                      className="flex-1 border-[#043c04] text-[#043c04] hover:bg-[#043c04] hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#043c04]">
              {selectedBooking?.status === 'pending' ? 'Confirm Booking' : 'Update Booking'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-[#5d3010]">
                Add a note for the student (optional):
              </p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Please bring your textbook and notes..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              {selectedBooking?.status === 'pending' && (
                <Button 
                  onClick={() => selectedBooking && handleUpdateStatus(selectedBooking.id, 'confirmed', notes)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Booking
                </Button>
              )}
              {selectedBooking?.status !== 'pending' && (
                <Button 
                  onClick={() => {
                    if (selectedBooking) {
                      const allBookings = getBookings();
                      const updatedBookings = allBookings.map(b => 
                        b.id === selectedBooking.id 
                          ? { ...b, notes }
                          : b
                      );
                      saveBookings(updatedBookings);
                      setBookings(updatedBookings.filter(b => b.teacherId === user?.id));
                      toast.success('Note updated!');
                      setIsDialogOpen(false);
                    }
                  }}
                  className="flex-1 bg-[#e7ac3e] hover:bg-[#d49a2e] text-[#043c04] font-semibold"
                >
                  Save Note
                </Button>
              )}
              <Button 
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedBooking(null);
                  setNotes('');
                }}
                variant="outline"
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
