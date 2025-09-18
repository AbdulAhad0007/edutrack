// src/app/settings/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Bell, Moon, Sun, User, Shield, Palette, Globe, Volume2, Eye, EyeOff, Home } from 'lucide-react';
import i18n from '@/lib/i18n';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      address: '',
      photo: '',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      assignmentReminders: true,
      examReminders: true,
      feeReminders: true,
    },
    appearance: {
      language: 'en',
      fontSize: 'medium',
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsTracking: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordChange: false,
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        handleSettingChange('appearance', 'language', savedLang);
        i18n.changeLanguage(savedLang);
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/email');
    }
  }, [status, router]);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        activeModule="settings"
        setActiveModule={() => {}}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-col flex-1 w-full">
        <Header
          darkMode={darkMode}
          setSidebarOpen={setSidebarOpen}
          showToggle={false}
          showNav={false}
        />

        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white dark:text-white">Settings</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Settings Menu */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <nav className="space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'dashboard') {
                              router.push(`/erp/${session.user.id}`);
                            } else {
                              setActiveSection(item.id);
                            }
                          }}
                          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                            activeSection === item.id
                              ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  {/* Profile Settings */}
                  {activeSection === 'profile' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={settings.profile.name}
                              onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={settings.profile.email}
                              onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={settings.profile.phone}
                              onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={settings.profile.address}
                              onChange={(e) => handleSettingChange('profile', 'address', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Enter your address"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  handleSettingChange('profile', 'photo', reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-gray-700 dark:file:text-purple-400 dark:hover:file:bg-gray-600"
                          />
                          {settings.profile.photo && (
                            <img src={settings.profile.photo} alt="Profile Photo" className="mt-4 w-24 h-24 rounded-full object-cover" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeSection === 'notifications' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                      <div className="space-y-6">
                        {Object.entries(settings.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeSection === 'appearance' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={settings.appearance.language}
                            onChange={(e) => {
                              const lang = e.target.value;
                              handleSettingChange('appearance', 'language', lang);
                              i18n.changeLanguage(lang);
                              if (typeof window !== 'undefined') {
                                localStorage.setItem('language', lang);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="ta">Tamil</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Size
                          </label>
                          <select
                            value={settings.appearance.fontSize}
                            onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Settings */}
                  {activeSection === 'privacy' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Visibility
                          </label>
                          <select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends">Friends Only</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Data Sharing</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Allow sharing of anonymized data for research
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.privacy.dataSharing}
                              onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeSection === 'security' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security.twoFactorAuth}
                              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <select
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="240">4 hours</option>
                          </select>
                        </div>
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <div className="relative">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={passwordData.current}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                  placeholder="Enter current password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                value={passwordData.new}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Enter new password"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Confirm new password"
                              />
                            </div>
                            <button
                              onClick={() => {
                                if (passwordData.current && passwordData.new && passwordData.confirm) {
                                  if (passwordData.new === passwordData.confirm) {
                                    // Simulate password change
                                    alert('Password changed successfully!');
                                    setPasswordData({ current: '', new: '', confirm: '' });
                                  } else {
                                    alert('New passwords do not match!');
                                  }
                                } else {
                                  alert('Please fill all password fields!');
                                }
                              }}
                              className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setSettings({
                          profile: { name: '', email: '', phone: '', address: '', photo: '' },
                          notifications: { emailNotifications: true, pushNotifications: true, smsNotifications: false, assignmentReminders: true, examReminders: true, feeReminders: true },
                          appearance: { language: 'en', fontSize: 'medium' },
                          privacy: { profileVisibility: 'private', dataSharing: false, analyticsTracking: true },
                          security: { twoFactorAuth: false, sessionTimeout: '30', passwordChange: false }
                        })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Reset to Defaults
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
