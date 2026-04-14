import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar, Plus, Clock, User, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getBookings,
  saveBookings,
  getUsers,
  generateId,
  addActivityLog
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { TeacherBooking, User as UserType } from '../../types';

export const TeacherBooking = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<TeacherBooking[]>([]);
  const [teachers, setTeachers] = useState<UserType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    teacherId: '',
    subject: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    if (!user) return;
    
    const allBookings = getBookings();
    const allUsers = getUsers();
    
    setBookings(allBookings.filter(b => b.studentId === user.id));
    setTeachers(allUsers.filter(u => u.role === 'social_worker'));
  };

  const handleCreateBooking = () => {
    if (!user) return;

    if (!newBooking.teacherId || !newBooking.subject || !newBooking.description || 
        !newBooking.scheduledDate || !newBooking.scheduledTime) {
      toast.error('Please fill in all fields');
      return;
    }

    const booking: TeacherBooking = {
      id: generateId('booking'),
      studentId: user.id,
      teacherId: newBooking.teacherId,
      subject: newBooking.subject,
      description: newBooking.description,
      scheduledDate: newBooking.scheduledDate,
      scheduledTime: newBooking.scheduledTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const allBookings = getBookings();
    const updatedBookings = [...allBookings, booking];
    saveBookings(updatedBookings);
    setBookings(updatedBookings.filter(b => b.studentId === user.id));

    const teacher = teachers.find(t => t.id === newBooking.teacherId);
    addActivityLog({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: 'Book Teacher Session',
      details: `Booked session with ${teacher?.firstName} ${teacher?.lastName} for ${newBooking.subject}`,
    });

    toast.success('Booking created! Waiting for teacher confirmation.');
    setNewBooking({
      teacherId: '',
      subject: '',
      description: '',
      scheduledDate: '',
      scheduledTime: '',
    });
    setIsDialogOpen(false);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
  };

  const getTeacher = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-[#043c04]">Teacher Bookings</h2>
          <p className="text-[#5d3010] mt-1">Schedule one-on-one sessions with teachers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#043c04] hover:bg-[#032d03] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Book Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#043c04]">Book a Teacher Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacher">Select Teacher</Label>
                <Select value={newBooking.teacherId} onValueChange={(value) => setNewBooking({ ...newBooking, teacherId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, English, Science"
                  value={newBooking.subject}
                  onChange={(e) => setNewBooking({ ...newBooking, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What would you like to discuss?"
                  value={newBooking.description}
                  onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newBooking.scheduledDate}
                    onChange={(e) => setNewBooking({ ...newBooking, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newBooking.scheduledTime}
                    onChange={(e) => setNewBooking({ ...newBooking, scheduledTime: e.target.value })}
                  />
                </div>
              </div>

              <Button 
                onClick={handleCreateBooking} 
                className="w-full bg-[#e7ac3e] hover:bg-[#d49a2e] text-[#043c04] font-semibold"
              >
                Submit Booking Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => {
          const teacher = getTeacher(booking.teacherId);
          return (
            <Card key={booking.id} className="border-2 border-[#e2dede] hover:shadow-lg transition-all">
              <CardHeader className="pb-3 bg-gradient-to-br from-[#043c04] to-[#5d3010] text-white rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-white">
                      <AvatarImage src={teacher?.profileImage} />
                      <AvatarFallback className="bg-[#e7ac3e] text-[#043c04]">
                        {teacher?.firstName[0]}{teacher?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg text-white">{getTeacherName(booking.teacherId)}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <BookOpen className="w-3 h-3" />
                        <p className="text-xs text-white/90">{booking.subject}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(booking.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="text-sm text-[#5d3010] line-clamp-2">{booking.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#043c04]" />
                    <span className="text-[#5d3010]">
                      {new Date(booking.scheduledDate).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#043c04]" />
                    <span className="text-[#5d3010]">{booking.scheduledTime}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e2dede]">
                  <Badge className={`${getStatusColor(booking.status)} border capitalize`}>
                    {booking.status}
                  </Badge>
                </div>

                {booking.notes && (
                  <div className="pt-2 border-t border-[#e2dede]">
                    <p className="text-xs text-[#5d3010]">
                      <strong>Teacher's Note:</strong> {booking.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {bookings.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Calendar className="w-12 h-12 text-[#e2dede] mx-auto mb-4" />
            <p className="text-[#5d3010]">No bookings yet</p>
            <p className="text-sm text-[#5d3010]/70 mt-1">Click "Book Teacher" to schedule your first session</p>
          </div>
        )}
      </div>
    </div>
  );
};
