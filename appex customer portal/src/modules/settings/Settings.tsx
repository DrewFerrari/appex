import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings as SettingsIcon, User, Bell, Shield, Database, Smartphone, CreditCard, HelpCircle, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'

export default function Settings() {
  const { user, logout } = useAuthStore()
  const { settings: notificationSettings, updateSettings } = useNotificationStore()
  const [activeTab, setActiveTab] = useState('profile')

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Smartphone },
    { id: 'business', label: 'Business', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${activeTab === tab.id
                        ? 'bg-accent-blue/20 text-accent-blue'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                      }
                    `}
                  >
                    <tab.icon className="mr-3 h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-background-tertiary">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-status-error hover:text-status-error hover:bg-status-error/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-accent-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">{user?.name}</h3>
                    <p className="text-text-muted">{user?.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name
                    </label>
                    <Input defaultValue={user?.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email
                    </label>
                    <Input defaultValue={user?.email} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone
                    </label>
                    <Input defaultValue="+263 71 234 5678" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Role
                    </label>
                    <Input value={user?.role} disabled />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Email Notifications</h4>
                      <p className="text-sm text-text-muted">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.email}
                      onChange={(e) => updateSettings({ email: e.target.checked })}
                      className="h-4 w-4 text-accent-blue rounded focus:ring-accent-blue"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">SMS Notifications</h4>
                      <p className="text-sm text-text-muted">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.sms}
                      onChange={(e) => updateSettings({ sms: e.target.checked })}
                      className="h-4 w-4 text-accent-blue rounded focus:ring-accent-blue"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Push Notifications</h4>
                      <p className="text-sm text-text-muted">Receive browser push notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.push}
                      onChange={(e) => updateSettings({ push: e.target.checked })}
                      className="h-4 w-4 text-accent-blue rounded focus:ring-accent-blue"
                    />
                  </div>
                </div>

                <div className="border-t border-background-tertiary pt-6">
                  <h4 className="font-medium text-text-primary mb-4">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-text-primary">Low Stock Alerts</h4>
                        <p className="text-sm text-text-muted">Get notified when products are running low</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.lowStock}
                        onChange={(e) => updateSettings({ lowStock: e.target.checked })}
                        className="h-4 w-4 text-accent-blue rounded focus:ring-accent-blue"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-text-primary">Sales Notifications</h4>
                        <p className="text-sm text-text-muted">Get notified about new sales</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.sales}
                        onChange={(e) => updateSettings({ sales: e.target.checked })}
                        className="h-4 w-4 text-accent-blue rounded focus:ring-accent-blue"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-text-primary">Customer Updates</h4>
                        <p className="text-sm text-text-muted">Get notified about customer activities</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.customers}
                        onChange={(e) => updateSettings({ customers: e.target.checked })}
                        className="h-4 w-4 text-accent-blue rounded focus:ring-accent-blue"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-text-primary mb-4">Password</h4>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button className="mt-3">Update Password</Button>
                </div>

                <div className="border-t border-background-tertiary pt-6">
                  <h4 className="font-medium text-text-primary mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary">Enable 2FA for enhanced security</p>
                      <p className="text-sm text-text-muted">Use authenticator app or SMS codes</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <div className="border-t border-background-tertiary pt-6">
                  <h4 className="font-medium text-text-primary mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
                      <div>
                        <p className="text-text-primary">Current Session</p>
                        <p className="text-sm text-text-muted">Chrome on Windows • Harare, Zimbabwe</p>
                      </div>
                      <span className="text-xs text-status-success bg-status-success/10 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Settings Tabs */}
          {activeTab !== 'profile' && activeTab !== 'notifications' && activeTab !== 'security' && (
            <Card>
              <CardContent className="p-12 text-center">
                <SettingsIcon className="h-16 w-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {settingsTabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-text-muted">
                  {activeTab === 'integrations' && 'Connect third-party services and applications'}
                  {activeTab === 'business' && 'Configure your business information and preferences'}
                  {activeTab === 'billing' && 'Manage your subscription and payment methods'}
                  {activeTab === 'support' && 'Get help and contact support'}
                </p>
                <p className="text-xs text-text-muted mt-2">
                  Detailed settings for this section would be implemented here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
