import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  ConfirmDialog,
  AlertDialog,
  FormDialog,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Settings,
  User,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Download,
  Share,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Camera,
  Image,
  FileText,
  Folder,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CreditCard,
  Users,
  Building,
  Globe,
  Smartphone,
  Bell,
  Gift,
  Award,
  Zap,
  Rocket,
  Target,
  Copy
} from 'lucide-react'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Apollo Dialog component - Modal dialogs with comprehensive variants and preset components.

## Features
- **Multiple variants**: Default, feature, success, warning, error, glass with gradient backgrounds
- **Flexible sizing**: sm, default, lg, xl, full with responsive layouts
- **Overlay options**: Different backdrop styles and blur effects
- **Preset components**: ConfirmDialog, AlertDialog, FormDialog for common use cases
- **Apollo design**: Perfect integration with Apollo color system and animations
- **Accessibility**: Full keyboard navigation, focus trap, and screen reader support
- **Customizable**: Headers with icons, flexible footers, gradient titles

## Usage
Dialogs are perfect for:
- Confirmation actions
- Form submissions
- Alerts and notifications
- Complex interactions
- Settings panels
- User workflows
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls dialog visibility',
    },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

// Basic Dialog
export const Basic: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Basic Dialog</DialogTitle>
            <DialogDescription>
              This is a basic dialog with default styling and standard content layout.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Dialog content goes here. You can add any content like forms, images, 
              or other components inside the dialog body.
            </p>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

// Variants
export const Variants: Story = {
  render: () => {
    const [activeDialog, setActiveDialog] = React.useState<string | null>(null)

    const variants = [
      { key: 'default', label: 'Default', variant: 'default' as const },
      { key: 'feature', label: 'Feature', variant: 'feature' as const },
      { key: 'success', label: 'Success', variant: 'success' as const },
      { key: 'warning', label: 'Warning', variant: 'warning' as const },
      { key: 'error', label: 'Error', variant: 'error' as const },
      { key: 'glass', label: 'Glass', variant: 'glass' as const },
    ]

    return (
      <div className="flex flex-wrap gap-3">
        {variants.map(({ key, label, variant }) => (
          <div key={key}>
            <Dialog open={activeDialog === key} onOpenChange={(open) => setActiveDialog(open ? key : null)}>
              <DialogTrigger asChild>
                <Button variant={variant === 'default' ? 'default' : variant === 'feature' ? 'default' : variant}>
                  {label} Dialog
                </Button>
              </DialogTrigger>
              <DialogContent variant={variant}>
                <DialogHeader>
                  <DialogTitle gradient={variant === 'feature'}>
                    {label} Dialog
                  </DialogTitle>
                  <DialogDescription>
                    This is a {label.toLowerCase()} variant dialog with {variant} styling and theming.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <p className="text-sm opacity-90">
                    Each variant has its own color scheme and visual treatment to match different use cases and contexts.
                  </p>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    )
  },
}

// Sizes
export const Sizes: Story = {
  render: () => {
    const [activeDialog, setActiveDialog] = React.useState<string | null>(null)

    const sizes = [
      { key: 'sm', label: 'Small', size: 'sm' as const },
      { key: 'default', label: 'Default', size: 'default' as const },
      { key: 'lg', label: 'Large', size: 'lg' as const },
      { key: 'xl', label: 'Extra Large', size: 'xl' as const },
      { key: 'full', label: 'Full Screen', size: 'full' as const },
    ]

    return (
      <div className="flex flex-wrap gap-3">
        {sizes.map(({ key, label, size }) => (
          <div key={key}>
            <Dialog open={activeDialog === key} onOpenChange={(open) => setActiveDialog(open ? key : null)}>
              <DialogTrigger asChild>
                <Button variant="outline">{label}</Button>
              </DialogTrigger>
              <DialogContent size={size}>
                <DialogHeader>
                  <DialogTitle>{label} Dialog</DialogTitle>
                  <DialogDescription>
                    This dialog uses the {size} size variant.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Content scales appropriately with the dialog size. {size === 'full' ? 'Full screen dialogs are great for complex forms or detailed content.' : `The ${size} size is perfect for ${size === 'sm' ? 'simple confirmations' : size === 'lg' ? 'detailed forms' : size === 'xl' ? 'complex workflows' : 'standard content'}.`}
                  </p>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    )
  },
}

// Confirm Dialogs
export const ConfirmDialogs: Story = {
  render: () => {
    const [activeDialog, setActiveDialog] = React.useState<string | null>(null)

    const handleConfirm = (action: string) => {
      console.log(`Confirmed: ${action}`)
      setActiveDialog(null)
    }

    const handleCancel = () => {
      console.log('Cancelled')
      setActiveDialog(null)
    }

    return (
      <div className="flex flex-wrap gap-3">
        <Dialog open={activeDialog === 'default'} onOpenChange={(open) => setActiveDialog(open ? 'default' : null)}>
          <DialogTrigger asChild>
            <Button variant="outline">Standard Confirm</Button>
          </DialogTrigger>
          <ConfirmDialog
            title="Confirm Action"
            description="Are you sure you want to proceed with this action? This cannot be undone."
            confirmText="Yes, Continue"
            cancelText="Cancel"
            onConfirm={() => handleConfirm('standard action')}
            onCancel={handleCancel}
          />
        </Dialog>

        <Dialog open={activeDialog === 'destructive'} onOpenChange={(open) => setActiveDialog(open ? 'destructive' : null)}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Item</Button>
          </DialogTrigger>
          <ConfirmDialog
            variant="destructive"
            title="Delete Item"
            description="This action cannot be undone. The item will be permanently deleted from your account."
            confirmText="Delete"
            cancelText="Keep Item"
            onConfirm={() => handleConfirm('delete item')}
            onCancel={handleCancel}
          />
        </Dialog>

        <Dialog open={activeDialog === 'loading'} onOpenChange={(open) => setActiveDialog(open ? 'loading' : null)}>
          <DialogTrigger asChild>
            <Button variant="outline">With Loading</Button>
          </DialogTrigger>
          <ConfirmDialog
            title="Save Changes"
            description="Do you want to save your changes before closing?"
            confirmText="Save"
            cancelText="Discard"
            loading={true}
            onConfirm={() => handleConfirm('save changes')}
            onCancel={handleCancel}
          />
        </Dialog>
      </div>
    )
  },
}

// Alert Dialogs
export const AlertDialogs: Story = {
  render: () => {
    const [activeDialog, setActiveDialog] = React.useState<string | null>(null)

    const handleAction = (type: string) => {
      console.log(`Alert action: ${type}`)
      setActiveDialog(null)
    }

    const alerts = [
      { key: 'success', type: 'success' as const, label: 'Success', variant: 'success' },
      { key: 'warning', type: 'warning' as const, label: 'Warning', variant: 'warning' },
      { key: 'error', type: 'error' as const, label: 'Error', variant: 'destructive' },
      { key: 'info', type: 'info' as const, label: 'Info', variant: 'default' },
    ]

    return (
      <div className="flex flex-wrap gap-3">
        {alerts.map(({ key, type, label, variant }) => (
          <div key={key}>
            <Dialog open={activeDialog === key} onOpenChange={(open) => setActiveDialog(open ? key : null)}>
              <DialogTrigger asChild>
                <Button variant={variant as any}>{label} Alert</Button>
              </DialogTrigger>
              <AlertDialog
                type={type}
                title={`${label} Notification`}
                description={`This is a ${label.toLowerCase()} alert dialog with appropriate styling and iconography.`}
                actionText="Got it"
                onAction={() => handleAction(type)}
              />
            </Dialog>
          </div>
        ))}
      </div>
    )
  },
}

// Form Dialog
export const FormDialogs: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLoading(false)
      setOpen(false)
      console.log('Form submitted')
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </DialogTrigger>
        <FormDialog
          title="Create New Project"
          description="Set up a new project with the basic information below."
          submitText="Create Project"
          cancelText="Cancel"
          loading={loading}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name..."
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project..."
                className="min-h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <select 
                id="project-type"
                className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-background"
              >
                <option value="web">Web Application</option>
                <option value="mobile">Mobile App</option>
                <option value="desktop">Desktop Application</option>
                <option value="api">API Service</option>
              </select>
            </div>
          </div>
        </FormDialog>
      </Dialog>
    )
  },
}

// Complex Dialog Examples
export const UserProfileDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <User className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent size="lg" variant="feature">
          <DialogHeader icon={
            <div className="bg-blueberry-100 dark:bg-blueberry-900 text-blueberry-600 dark:text-blueberry-400">
              <User className="h-6 w-6" />
            </div>
          }>
            <DialogTitle gradient>User Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blueberry-400 to-blueberry-600 flex items-center justify-center text-white text-xl font-semibold">
                JD
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
                <p className="text-xs text-neutral-500">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" defaultValue="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@apollo.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Tell us about yourself..."
                defaultValue="Product designer passionate about creating beautiful and functional user experiences."
              />
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h4 className="font-semibold">Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-neutral-500">Receive email updates about your account</p>
                  </div>
                  <Button variant="outline" size="sm">Toggle</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-neutral-500">Use dark theme across the application</p>
                  </div>
                  <Button variant="outline" size="sm">Toggle</Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

export const SettingsDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState('general')

    const tabs = [
      { id: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
      { id: 'account', label: 'Account', icon: <User className="h-4 w-4" /> },
      { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
      { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    ]

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent size="xl" variant="feature">
          <DialogHeader>
            <DialogTitle gradient>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-6 min-h-96">
            {/* Sidebar */}
            <div className="w-48 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blueberry-100 dark:bg-blueberry-900 text-blueberry-700 dark:text-blueberry-300'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">General Settings</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <select className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-background">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <select className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-background">
                          <option>UTC-8 (Pacific Time)</option>
                          <option>UTC-5 (Eastern Time)</option>
                          <option>UTC+0 (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'account' && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-3">Account Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Display Name</Label>
                      <Input defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" defaultValue="john.doe@apollo.com" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="soft-success">Verified</Badge>
                      <span className="text-sm text-neutral-500">Account verified</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-3">Security & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-neutral-500">Add an extra layer of security</div>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div>
                        <div className="font-medium">Change Password</div>
                        <div className="text-sm text-neutral-500">Update your account password</div>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="font-semibold mb-3">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Email notifications', desc: 'Receive updates via email' },
                      { label: 'Push notifications', desc: 'Browser and mobile notifications' },
                      { label: 'Weekly digest', desc: 'Summary of your weekly activity' },
                      { label: 'Marketing emails', desc: 'Product updates and tips' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-neutral-500">{item.desc}</div>
                        </div>
                        <Button variant="outline" size="sm">Toggle</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

// Feature Showcase Dialog
export const FeatureShowcaseDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="gradient">
            <Rocket className="mr-2 h-4 w-4" />
            New Feature
          </Button>
        </DialogTrigger>
        <DialogContent size="lg" variant="feature">
          <DialogHeader centered icon={
            <div className="bg-gradient-to-br from-blueberry-400 to-blueberry-600 text-white">
              <Zap className="h-6 w-6" />
            </div>
          }>
            <DialogTitle gradient size="lg">Introducing Apollo AI</DialogTitle>
            <DialogDescription size="lg">
              Supercharge your workflow with intelligent automation and insights.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-blueberry-100 dark:bg-blueberry-900 flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-blueberry-600 dark:text-blueberry-400" />
                </div>
                <h4 className="font-semibold">Smart Targeting</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  AI-powered audience insights
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6 text-success-600 dark:text-success-400" />
                </div>
                <h4 className="font-semibold">Auto Optimization</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Continuous performance tuning
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                </div>
                <h4 className="font-semibold">Predictive Analytics</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Forecast trends and outcomes
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blueberry-50 to-blueberry-100 dark:from-blueberry-950 dark:to-blueberry-900 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-blueberry-600 dark:text-blueberry-400" />
                <div>
                  <div className="font-semibold text-blueberry-900 dark:text-blueberry-100">
                    Limited Time Offer
                  </div>
                  <div className="text-sm text-blueberry-700 dark:text-blueberry-300">
                    Get 30 days free when you upgrade to Pro
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter justify="between">
            <DialogClose asChild>
              <Button variant="ghost">Maybe Later</Button>
            </DialogClose>
            <div className="flex gap-2">
              <Button variant="outline">Learn More</Button>
              <Button variant="gradient">
                <Rocket className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

// Accessibility Example
export const AccessibilityExample: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Accessibility Features</h3>
          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <div>• Focus trap - Tab navigation stays within dialog</div>
            <div>• Escape key closes the dialog</div>
            <div>• Click outside to close (can be disabled)</div>
            <div>• Proper ARIA labels and roles</div>
            <div>• Screen reader announcements</div>
            <div>• High contrast support</div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open Accessible Dialog</Button>
          </DialogTrigger>
          <DialogContent
            aria-labelledby="accessible-dialog-title"
            aria-describedby="accessible-dialog-description"
          >
            <DialogHeader>
              <DialogTitle id="accessible-dialog-title">
                Accessible Dialog Example
              </DialogTitle>
              <DialogDescription id="accessible-dialog-description">
                This dialog demonstrates proper accessibility implementation with focus management and screen reader support.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessible-input">
                  Sample Input
                </Label>
                <Input 
                  id="accessible-input"
                  placeholder="Try tabbing through elements..."
                  aria-describedby="input-help"
                />
                <p id="input-help" className="text-xs text-neutral-500">
                  This input has proper labeling and help text for screen readers.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accessible-textarea">Message</Label>
                <Textarea 
                  id="accessible-textarea"
                  placeholder="Enter your message..."
                  aria-label="Message content"
                />
              </div>

              <div className="p-3 bg-blueberry-50 dark:bg-blueberry-950 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blueberry-600 dark:text-blueberry-400 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blueberry-900 dark:text-blueberry-100">
                      Accessibility Tip
                    </div>
                    <div className="text-blueberry-700 dark:text-blueberry-300">
                      Use Tab to navigate, Enter to activate buttons, and Escape to close.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" aria-label="Cancel and close dialog">
                  Cancel
                </Button>
              </DialogClose>
              <Button aria-label="Submit form and close dialog">
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  },
}

// Multi-step Dialog Example
export const MultiStepDialog: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    const [currentStep, setCurrentStep] = React.useState(1)
    const totalSteps = 3

    const nextStep = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    }

    const prevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    }

    const resetDialog = () => {
      setCurrentStep(1)
      setOpen(false)
    }

    const steps = [
      {
        title: "Project Details",
        description: "Tell us about your project",
        content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="My Awesome Project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <select 
                id="project-type"
                className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-background"
              >
                <option value="">Select a type...</option>
                <option value="web">Web Application</option>
                <option value="mobile">Mobile App</option>
                <option value="desktop">Desktop Software</option>
              </select>
            </div>
          </div>
        )
      },
      {
        title: "Team Setup",
        description: "Configure your team settings",
        content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-size">Team Size</Label>
              <select 
                id="team-size"
                className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-background"
              >
                <option value="1-5">1-5 members</option>
                <option value="6-20">6-20 members</option>
                <option value="21-50">21-50 members</option>
                <option value="50+">50+ members</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Collaboration Tools</Label>
              <div className="space-y-2">
                {['Slack Integration', 'GitHub Integration', 'Jira Integration'].map((tool) => (
                  <label key={tool} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-neutral-300" />
                    <span className="text-sm">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Review & Confirm",
        description: "Review your project configuration",
        content: (
          <div className="space-y-4">
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Project Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Name:</span>
                  <span>My Awesome Project</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Type:</span>
                  <span>Web Application</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Team Size:</span>
                  <span>1-5 members</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Integrations:</span>
                  <span>Slack, GitHub</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-success-600 dark:text-success-400">
              <CheckCircle className="h-4 w-4" />
              <span>Ready to create your project</span>
            </div>
          </div>
        )
      }
    ]

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Multi-step Setup
          </Button>
        </DialogTrigger>
        <DialogContent size="lg" variant="feature">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <DialogTitle gradient>Project Setup</DialogTitle>
              <Badge variant="outline">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <DialogDescription>
              {steps[currentStep - 1].description}
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-6">
            <div 
              className="bg-blueberry-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          
          {/* Step Content */}
          <div className="min-h-48">
            <h3 className="text-lg font-semibold mb-4">{steps[currentStep - 1].title}</h3>
            {steps[currentStep - 1].content}
          </div>
          
          <DialogFooter justify="between">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="ghost" onClick={resetDialog}>
                  Cancel
                </Button>
              </DialogClose>
              
              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next Step
                </Button>
              ) : (
                <Button onClick={resetDialog}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
}

// Interactive Examples
export const InteractiveExamples: Story = {
  render: () => {
    const [notifications, setNotifications] = React.useState(true)
    const [theme, setTheme] = React.useState('light')
    const [activeDialog, setActiveDialog] = React.useState<string | null>(null)

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interactive Dialog Examples</h3>
        
        <div className="flex flex-wrap gap-3">
          {/* Quick Settings */}
          <Dialog open={activeDialog === 'settings'} onOpenChange={(open) => setActiveDialog(open ? 'settings' : null)}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Quick Settings
              </Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Quick Settings</DialogTitle>
                <DialogDescription>
                  Adjust your preferences quickly
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications</Label>
                    <p className="text-sm text-neutral-500">Receive push notifications</p>
                  </div>
                  <Button 
                    variant={notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications(!notifications)}
                  >
                    {notifications ? 'On' : 'Off'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-neutral-500">Interface appearance</p>
                  </div>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="p-1 border border-neutral-300 dark:border-neutral-600 rounded text-sm bg-background"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Done</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Upload Dialog */}
          <Dialog open={activeDialog === 'upload'} onOpenChange={(open) => setActiveDialog(open ? 'upload' : null)}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  Select files to upload to your project
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Drag and drop files here</p>
                    <p className="text-xs text-neutral-500">or click to browse</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    Choose Files
                  </Button>
                </div>
                
                <div className="text-xs text-neutral-500">
                  Supported formats: JPG, PNG, GIF, PDF, DOC, XLS (Max 10MB)
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button disabled>
                  Upload (0 files)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Share Dialog */}
          <Dialog open={activeDialog === 'share'} onOpenChange={(open) => setActiveDialog(open ? 'share' : null)}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share className="mr-2 h-4 w-4" />
                Share Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Project</DialogTitle>
                <DialogDescription>
                  Invite team members or share with external collaborators
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="share-email">Invite by email</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="share-email"
                      placeholder="Enter email address..."
                      className="flex-1"
                    />
                    <Button size="sm">Invite</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Share link</Label>
                  <div className="flex gap-2">
                    <Input 
                      defaultValue="https://apollo.com/project/abc123"
                      className="flex-1"
                      readOnly
                    />
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Permission level</Label>
                  <select className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-background">
                    <option value="view">Can view</option>
                    <option value="comment">Can comment</option>
                    <option value="edit">Can edit</option>
                    <option value="admin">Admin access</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  },
}
