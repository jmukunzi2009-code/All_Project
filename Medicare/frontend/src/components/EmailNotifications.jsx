import React, { useState, useEffect } from 'react';
import { Mail, X, CheckCircle, Clock, Calendar } from 'lucide-react';

const EmailNotifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = () => {
    // Mock email notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'appointment_confirmed',
        title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Sarah Johnson on January 15, 2024 at 10:00 AM has been confirmed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false
      },
      {
        id: 2,
        type: 'payment_receipt',
        title: 'Payment Receipt',
        message: 'Your payment of $155.00 for consultation has been processed successfully. Payment ID: PAY_123456',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false
      },
      {
        id: 3,
        type: 'reminder',
        title: 'Appointment Reminder',
        message: 'Reminder: You have an appointment with Dr. Michael Chen tomorrow at 2:30 PM. Please arrive 15 minutes early.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true
      },
      {
        id: 4,
        type: 'follow_up',
        title: 'Follow-up Required',
        message: 'Dr. Emily Rodriguez has requested a follow-up appointment. Please schedule your next visit.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true
      }
    ];
    setNotifications(mockNotifications);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'payment_receipt':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'follow_up':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      default:
        return <Mail className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium ${
                            notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.title}
                          </h3>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {notifications.filter(n => !n.read).length} unread notifications
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setNotifications([])}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;