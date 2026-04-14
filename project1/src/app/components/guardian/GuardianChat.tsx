import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageSquare, Send, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getConversations,
  getMessagesByConversationId,
  saveMessages,
  saveConversations,
  getUserById,
  generateId,
  getClassById,
  getUsers
} from '../../lib/storage';
import type { Conversation, Message, User } from '../../types';

export const GuardianChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [availableContacts, setAvailableContacts] = useState<User[]>([]);

  useEffect(() => {
    if (user) {
      loadConversations();
      loadAvailableContacts();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = () => {
    if (!user) return;

    const allConversations = getConversations();
    const userConversations = allConversations.filter(conv =>
      conv.participants.includes(user.id) &&
      (conv.type === 'direct' || conv.type === 'class_group')
    );
    setConversations(userConversations);
  };

  const loadAvailableContacts = () => {
    if (!user?.guardianOf) return;

    const allUsers = getUsers();
    const contacts: User[] = [];

    // Add children
    user.guardianOf.forEach(studentId => {
      const student = getUserById(studentId);
      if (student) contacts.push(student);
    });

    // Add teachers of children's classes
    user.guardianOf.forEach(studentId => {
      const student = getUserById(studentId);
      if (student?.classId) {
        const cls = getClassById(student.classId);
        if (cls?.teacherId) {
          const teacher = getUserById(cls.teacherId);
          if (teacher && !contacts.find(c => c.id === teacher.id)) {
            contacts.push(teacher);
          }
        }
      }
    });

    setAvailableContacts(contacts);
  };

  const loadMessages = (conversationId: string) => {
    const conversationMessages = getMessagesByConversationId(conversationId);
    setMessages(conversationMessages);
  };

  const startConversation = (contactId: string) => {
    if (!user) return;

    const existingConv = conversations.find(conv =>
      conv.type === 'direct' &&
      conv.participants.includes(contactId) &&
      conv.participants.includes(user.id) &&
      conv.participants.length === 2
    );

    if (existingConv) {
      setSelectedConversation(existingConv.id);
      return;
    }

    // Create new conversation
    const contact = getUserById(contactId);
    if (!contact) return;

    const newConv: Conversation = {
      id: generateId('conv'),
      type: 'direct',
      participants: [user.id, contactId],
      lastMessage: undefined,
      createdAt: new Date().toISOString(),
      name: `${contact.firstName} ${contact.lastName}`,
    };

    const allConversations = getConversations();
    allConversations.push(newConv);
    saveConversations(allConversations);

    setConversations([...conversations, newConv]);
    setSelectedConversation(newConv.id);
  };

  const sendMessage = () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    const message: Message = {
      id: generateId('msg'),
      conversationId: selectedConversation,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const allMessages = getMessagesByConversationId(selectedConversation);
    allMessages.push(message);
    saveMessages(allMessages);

    // Update conversation's last message
    const allConversations = getConversations();
    const convIndex = allConversations.findIndex(c => c.id === selectedConversation);
    if (convIndex !== -1) {
      allConversations[convIndex].lastMessage = message;
      saveConversations(allConversations);
    }

    setMessages([...messages, message]);
    setNewMessage('');
    loadConversations(); // Refresh conversation list
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Messages</h2>
        <p className="text-gray-600 mt-1">Communicate with your children and their teachers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Conversations/Contacts List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-4">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedConversation === conv.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm truncate">
                      {conv.name || 'Group Chat'}
                    </div>
                    {conv.lastMessage && (
                      <div className="text-xs text-gray-500 truncate mt-1">
                        {conv.lastMessage.senderName}: {conv.lastMessage.content}
                      </div>
                    )}
                  </button>
                ))}

                {conversations.length === 0 && (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    No conversations yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Available Contacts */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1 p-4">
                {availableContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => startConversation(contact.id)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {contact.firstName[0]}{contact.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {contact.role.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedConv ? selectedConv.name || 'Chat' : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[500px]">
            {selectedConversation ? (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">
                            {message.senderId === user?.id ? 'You' : message.senderName}
                          </div>
                          <div className="text-sm">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};