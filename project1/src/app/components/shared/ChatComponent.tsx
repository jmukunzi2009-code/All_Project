import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Send, MessageSquare, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getMessages, 
  saveMessages, 
  getConversations,
  saveConversations,
  getConversationsByUserId,
  getMessagesByConversationId,
  generateId,
  getUserById,
  getUsers,
  getFamilyById
} from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { Message, Conversation } from '../../types';
import { cn } from '../ui/utils';

interface ChatComponentProps {
  conversations: Conversation[];
  canMonitorAll?: boolean;
}

export const ChatComponent = ({ conversations, canMonitorAll = false }: ChatComponentProps) => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const loadMessages = () => {
    if (!selectedConversation) return;
    const conversationMessages = getMessagesByConversationId(selectedConversation.id);
    setMessages(conversationMessages);

    // Mark messages as read
    if (user) {
      const allMessages = getMessages();
      const updatedMessages = allMessages.map(m => 
        m.conversationId === selectedConversation.id && m.senderId !== user.id
          ? { ...m, read: true }
          : m
      );
      saveMessages(updatedMessages);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const message: Message = {
      id: generateId('message'),
      conversationId: selectedConversation.id,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      senderRole: user.role,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const allMessages = getMessages();
    const updatedMessages = [...allMessages, message];
    saveMessages(updatedMessages);

    // Update conversation's last message
    const allConversations = getConversations();
    const updatedConversations = allConversations.map(c =>
      c.id === selectedConversation.id ? { ...c, lastMessage: message } : c
    );
    saveConversations(updatedConversations);

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    
    if (conversation.type === 'family_group') {
      const family = getFamilyById(conversation.familyId || '');
      return family ? `${family.name} Group` : 'Family Group';
    }

    // Direct conversation - get the other participant's name
    const otherParticipantId = conversation.participants.find(p => p !== user?.id);
    if (otherParticipantId) {
      const otherUser = getUserById(otherParticipantId);
      return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown';
    }

    return 'Conversation';
  };

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.type === 'family_group') {
      return `${conversation.participants.length} members`;
    }
    const otherParticipantId = conversation.participants.find(p => p !== user?.id);
    if (otherParticipantId) {
      const otherUser = getUserById(otherParticipantId);
      return otherUser ? otherUser.role.replace('_', ' ') : '';
    }
    return '';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getUnreadCount = (conversationId: string) => {
    if (!user) return 0;
    const allMessages = getMessages();
    return allMessages.filter(m => 
      m.conversationId === conversationId && 
      m.senderId !== user.id && 
      !m.read
    ).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="space-y-1 p-4">
              {conversations.map((conversation) => {
                const unreadCount = getUnreadCount(conversation.id);
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      'w-full p-3 rounded-lg text-left transition-colors',
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {conversation.type === 'family_group' ? (
                            <UsersIcon className="w-4 h-4" />
                          ) : (
                            getInitials(getConversationName(conversation))
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {getConversationName(conversation)}
                          </p>
                          {unreadCount > 0 && (
                            <Badge className="ml-2 bg-blue-600">{unreadCount}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 capitalize">
                          {getConversationSubtitle(conversation)}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {conversations.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No conversations yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages Area */}
      <Card className="lg:col-span-2">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">
                    {selectedConversation.type === 'family_group' ? (
                      <UsersIcon className="w-5 h-5" />
                    ) : (
                      getInitials(getConversationName(selectedConversation))
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {getConversationName(selectedConversation)}
                  </CardTitle>
                  <p className="text-xs text-gray-500 capitalize">
                    {getConversationSubtitle(selectedConversation)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-500px)] mb-4" ref={scrollAreaRef}>
                <div className="space-y-4 pr-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.senderId === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex gap-3',
                          isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                        )}
                      >
                        <Avatar className="flex-shrink-0">
                          <AvatarFallback className={isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-300'}>
                            {getInitials(message.senderName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn('flex-1 max-w-[70%]', isOwnMessage && 'flex flex-col items-end')}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-700">
                              {message.senderName}
                            </span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {message.senderRole.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div
                            className={cn(
                              'rounded-lg p-3',
                              isOwnMessage 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
