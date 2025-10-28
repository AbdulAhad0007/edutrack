'use client';

import { useState } from 'react';
import { Settings, Save, User, Bell, Shield, Palette, Database } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    profile: {
      name: 'Admin User',
      email: 'admin@school.com',
      phone: '+91 8826324063'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      meetingReminders: true,
      noticeAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      backupFrequency: 'daily'
    }
  });

  const [saving, setSaving] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleProfileChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Mock save - in real app, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 xs:gap-0">
        <h1 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm xs:text-base"
        >
          <Save className="w-4 h-4 xs:w-5 xs:h-5 mr-1 xs:mr-2" />
          <span className="hidden xs:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
          <span className="xs:hidden">{saving ? 'Saving' : 'Save'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex items-center mb-3 xs:mb-4">
            <User className="w-5 h-5 xs:w-6 xs:h-6 text-indigo-600 mr-2" />
            <h2 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={settings.profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex items-center mb-3 xs:mb-4">
            <Bell className="w-5 h-5 xs:w-6 xs:h-6 text-indigo-600 mr-2" />
            <h2 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Push Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Meeting Reminders
              </span>
              <input
                type="checkbox"
                checked={settings.notifications.meetingReminders}
                onChange={(e) => handleSettingChange('notifications', 'meetingReminders', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Notice Alerts
              </span>
              <input
                type="checkbox"
                checked={settings.notifications.noticeAlerts}
                onChange={(e) => handleSettingChange('notifications', 'noticeAlerts', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex items-center mb-3 xs:mb-4">
            <Shield className="w-5 h-5 xs:w-6 xs:h-6 text-indigo-600 mr-2" />
            <h2 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Two-Factor Authentication
              </span>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Timeout (minutes)
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={480}>8 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password Expiry (days)
              </label>
              <select
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex items-center mb-3 xs:mb-4">
            <Database className="w-5 h-5 xs:w-6 xs:h-6 text-indigo-600 mr-2" />
            <h2 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">System Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maintenance Mode
              </span>
              <input
                type="checkbox"
                checked={settings.system.maintenanceMode}
                onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Debug Mode
              </span>
              <input
                type="checkbox"
                checked={settings.system.debugMode}
                onChange={(e) => handleSettingChange('system', 'debugMode', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Backup Frequency
              </label>
              <select
                value={settings.system.backupFrequency}
                onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* System Information */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">System Information</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Backup:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Database Status:</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Server Status:</span>
                  <span className="text-green-600">Running</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Settings Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex items-center mb-3 xs:mb-4">
            <Palette className="w-5 h-5 xs:w-6 xs:h-6 text-indigo-600 mr-2" />
            <h2 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Theme
              </label>
              <select
                value="system"
                onChange={() => {}}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value="en"
                onChange={() => {}}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <div className="flex items-center mb-3 xs:mb-4">
            <Settings className="w-5 h-5 xs:w-6 xs:h-6 text-indigo-600 mr-2" />
            <h2 className="text-base xs:text-lg font-semibold text-gray-900 dark:text-white">Advanced Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Rate Limit (requests/minute)
              </label>
              <input
                type="number"
                defaultValue={100}
                min={1}
                max={1000}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cache Duration (seconds)
              </label>
              <input
                type="number"
                defaultValue={300}
                min={0}
                max={3600}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Reset to Defaults</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This will reset all settings to their default values
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all settings to defaults?')) {
                    // Reset logic would go here
                    alert('Settings reset to defaults');
                  }
                }}
                className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
