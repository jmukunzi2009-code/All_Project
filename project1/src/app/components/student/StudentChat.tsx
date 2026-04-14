import { useEffect, useState } from 'react';
import { ChatComponent } from '../shared/ChatComponent';
import { getConversationsByUserId, getConversations, saveConversations, generateId, getUserById, getFamilyById } from '../../lib/storage';
import { useAuth } from '../../contexts/AuthContext';
import type { Conversation } from '../../types';

export const StudentChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = () => {
    if (!user || !user.familyId) return;

    let userConversations = getConversationsByUserId(user.id);
    const allConversations = getConversations();

    // Create conversations if they don't exist
    const family = getFamilyById(user.familyId);
    if (family) {
      // Family group chat
      let familyGroupChat = userConversations.find(c => c.type === 'family_group' && c.familyId === user.familyId);
      if (!familyGroupChat) {
        familyGroupChat = {
          id: generateId('conversation'),
          type: 'family_group',
          participants: [family.momId, ...family.studentIds],
          familyId: family.id,
          createdAt: new Date().toISOString(),
          name: `${family.name} Group`,
        };
        allConversations.push(familyGroupChat);
        saveConversations(allConversations);
      }

      // Direct chat with mom
      let momChat = userConversations.find(c => c.type === 'direct' && c.participants.includes(family.momId));
      if (!momChat) {
        const mom = getUserById(family.momId);
        if (mom) {
          momChat = {
            id: generateId('conversation'),
            type: 'direct',
            participants: [user.id, family.momId],
            createdAt: new Date().toISOString(),
          };
          allConversations.push(momChat);
          saveConversations(allConversations);
        }
      }
    }

    // Reload conversations
    userConversations = getConversationsByUserId(user.id);
    setConversations(userConversations);
  };

  return <ChatComponent conversations={conversations} />;
};
