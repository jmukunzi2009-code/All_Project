import { useEffect, useState } from 'react';
import { ChatComponent } from '../shared/ChatComponent';
import { getConversationsByUserId } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { Conversation } from '../../types';

export const TeacherChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (user) {
      // Mom can see conversations related to her family
      const userConversations = getConversationsByUserId(user.id);
      setConversations(userConversations);
    }
  }, [user]);

  return <ChatComponent conversations={conversations} />;
};