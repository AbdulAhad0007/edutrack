// src/components/NotificationPopup.jsx
'use client';

import { X } from 'lucide-react';

export default function NotificationPopup({ notifications, isOpen, onClose, markAllAsRead }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 md:left-0 md:right-auto top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No new notifications
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {notification.text}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notification.timestamp || 'Just now'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={markAllAsRead}
            className="w-full text-center text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
