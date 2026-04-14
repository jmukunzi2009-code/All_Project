import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, School, Send, MessageSquare, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagingPage() {
  const navigate = useNavigate();
  const { user, getAllUsers } = useAuth();
  const { teachers, students, messages, sendMessage } = useSchool();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedUserId]);

  // Get available contacts based on user role with security rules
  const getAvailableContacts = () => {
    const allSystemUsers = getAllUsers();
    
    if (!user) return [];

    // Security rules based on role
    if (user.role === 'student') {
      // Students can only message:
      // - Their teachers (from their class)
      // - Their class teacher
      // - Headmaster (for queries)
      return allSystemUsers.filter(u => 
        u.id !== user.id && 
        (u.role === 'teacher' || u.role === 'class_teacher' || u.role === 'headmaster')
      );
    } else if (user.role === 'teacher') {
      // Regular teachers can message:
      // - Other teachers
      // - Students (for academic purposes)
      // - Headmaster
      return allSystemUsers.filter(u => 
        u.id !== user.id && 
        (u.role === 'student' || u.role === 'teacher' || u.role === 'class_teacher' || u.role === 'headmaster')
      );
    } else if (user.role === 'class_teacher') {
      // Class teachers can message:
      // - All students (especially their class)
      // - Other teachers
      // - Headmaster
      return allSystemUsers.filter(u => 
        u.id !== user.id && 
        u.role !== 'admin'
      );
    } else if (user.role === 'headmaster') {
      // Headmaster can message:
      // - Teachers (for administrative purposes)
      // - Class Teachers
      // - Admin
      // CANNOT see student messages for privacy
      return allSystemUsers.filter(u =>
        u.id !== user.id &&
        (u.role === 'teacher' || u.role === 'class_teacher' || u.role === 'admin')
      );
    } else if (user.role === 'admin') {
      // Admin can message everyone except other admins
      return allSystemUsers.filter(u => 
        u.id !== user.id && 
        u.role !== 'admin'
      );
    }
    
    return [];
  };

  const availableContacts = getAvailableContacts();

  // Security check before sending message
  const canMessageUser = (recipientId: string): boolean => {
    return availableContacts.some(contact => contact.id === recipientId);
  };

  // Get conversation with selected user
  const getConversation = () => {
    if (!selectedUserId || !user) return [];
    
    // Security: Only show messages where user is participant
    return messages.filter(
      m =>
        (m.senderId === user.id && m.recipientId === selectedUserId) ||
        (m.senderId === selectedUserId && m.recipientId === user.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const conversation = getConversation();
  const selectedContact = availableContacts.find(u => u.id === selectedUserId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedUserId || !user) {
      toast.error('Please enter a message');
      return;
    }

    // Security check
    if (!canMessageUser(selectedUserId)) {
      toast.error('You do not have permission to message this user');
      return;
    }

    sendMessage({
      senderId: user.id,
      recipientId: selectedUserId,
      content: messageText,
      read: false,
    });

    setMessageText('');
    toast.success('Message sent!');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLastMessage = (contactId: string) => {
    const msgs = messages.filter(
      m =>
        (m.senderId === user?.id && m.recipientId === contactId) ||
        (m.senderId === contactId && m.recipientId === user?.id)
    );
    return msgs[msgs.length - 1];
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
          <School className="size-8 text-primary" />
          <h1 className="text-xl">Secure Messages</h1>
          <Badge variant="secondary" className="ml-auto">
            <Shield className="size-3 mr-1" />
            Role-Based Access
          </Badge>
        </div>
      </header>

      <main className="container py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-160px)]">
          {/* Contacts List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="size-5" />
                Authorized Contacts
              </CardTitle>
              <CardDescription>{availableContacts.length} available</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                {availableContacts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No contacts available based on your role
                  </div>
                ) : (
                  <div className="space-y-1 p-4 pt-0">
                    {availableContacts.map(contact => {
                      const lastMsg = getLastMessage(contact.id);
                      const isSelected = selectedUserId === contact.id;

                      return (
                        <button
                          key={contact.id}
                          onClick={() => setSelectedUserId(contact.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <Avatar>
                            <AvatarImage src={contact.profilePicture} />
                            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm truncate">{contact.name}</p>
                            <p className={`text-xs truncate ${
                              isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                            }`}>
                              {lastMsg ? lastMsg.content : 'No messages yet'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2">
            {selectedContact ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedContact.profilePicture} />
                      <AvatarFallback>{getInitials(selectedContact.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                      <CardDescription className="capitalize">{selectedContact.role.replace('_', ' ')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col h-[calc(100vh-360px)]">
                  <ScrollArea className="flex-1 pr-4 mb-4">
                    <div className="space-y-4">
                      {conversation.length > 0 ? (
                        conversation.map(msg => {
                          const isOwn = msg.senderId === user?.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isOwn
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-xs mt-1 ${
                                  isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No messages yet. Start a conversation!
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="size-4" />
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
                  <p>Select a contact to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}