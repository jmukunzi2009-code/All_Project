import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Activity, Clock, User } from 'lucide-react';
import { getActivityLogs } from '../../lib/storage';
import type { ActivityLog } from '../../types';

export const ViewActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const allLogs = getActivityLogs();
    setLogs(allLogs.reverse()); // Most recent first
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'social_worker':
        return 'bg-blue-100 text-blue-800';
      case 'mom':
        return 'bg-purple-100 text-purple-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Activity Logs</h2>
        <p className="text-gray-600 mt-1">Monitor all system activities and user actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity ({logs.length} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{log.userName}</span>
                          <Badge className={getRoleBadgeColor(log.userRole)}>
                            {log.userRole.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{log.action}</p>
                        <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {formatDate(log.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No activity logs yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
