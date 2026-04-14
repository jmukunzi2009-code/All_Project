import { useEffect, useState } from 'react';
import { ChatComponent } from '../shared/ChatComponent';
import { getConversations } from '../../lib/storage';
import type { Conversation } from '../../types';

export const ChatMonitor = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Social worker can see all conversations
    const allConversations = getConversations();
    setConversations(allConversations);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Chat Monitor</h2>
        <p className="text-gray-600 mt-1">Monitor all conversations for safety and support</p>
      </div>
      <ChatComponent conversations={conversations} canMonitorAll={true} />
    </div>
  );
};
