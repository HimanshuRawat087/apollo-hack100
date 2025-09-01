import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { cn } from '@/lib/utils'

import { 
  Badge, 
  StatusBadge, 
  PriorityBadge,
  type BadgeProps 
} from '@/components/ui/badge'
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap, 
  Star, 
  Heart,
  Bell,
  Shield,
  Flame,
  Crown,
  Gift,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  Target
} from 'lucide-react'

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Apollo Badge component with comprehensive variants and smart presets.

## Features
- **15+ Variants**: Solid, outline, soft, gradient, and ghost styles
- **Multiple Sizes**: sm, default, lg, xl for different contexts
- **Border Radius**: Default (pill), sm, lg, none options
- **Smart Presets**: StatusBadge and PriorityBadge for common use cases
- **Apollo Design**: Perfect integration with Apollo color system
- **Icon Support**: Built-in icon spacing and alignment
- **Accessibility**: Proper contrast ratios and screen reader support

## Visual Features
- Smooth hover transitions and active states
- Shadow depth progression for solid variants
- Perfect typography scaling across sizes
- Dark mode comprehensive support
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'success', 
        'destructive',
        'warning',
        'outline',
        'outline-primary',
        'outline-success',
        'outline-error',
        'outline-warning',
        'soft-primary',
        'soft-success',
        'soft-error',
        'soft-warning',
        'gradient',
        'ghost'
      ],
      description: 'Visual style variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Size of the badge',
    },
    rounded: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'none'],
      description: 'Border radius variant',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

// Basic Stories
export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Error',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-600">Solid</h4>
        <div className="space-y-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-600">Outline</h4>
        <div className="space-y-2">
          <Badge variant="outline">Outline</Badge>
          <Badge variant="outline-primary">Primary</Badge>
          <Badge variant="outline-success">Success</Badge>
          <Badge variant="outline-error">Error</Badge>
          <Badge variant="outline-warning">Warning</Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-600">Soft</h4>
        <div className="space-y-2">
          <Badge variant="soft-primary">Primary</Badge>
          <Badge variant="soft-success">Success</Badge>
          <Badge variant="soft-error">Error</Badge>
          <Badge variant="soft-warning">Warning</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-neutral-600">Special</h4>
        <div className="space-y-2">
          <Badge variant="gradient">Gradient</Badge>
          <Badge variant="gradient">
            <Sparkles className="h-3 w-3" />
            Premium
          </Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
      <Badge size="xl">Extra Large</Badge>
    </div>
  ),
}

// Border Radius Options
export const BorderRadius: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge rounded="none">None</Badge>
      <Badge rounded="sm">Small</Badge>
      <Badge rounded="default">Default</Badge>
      <Badge rounded="lg">Large</Badge>
    </div>
  ),
}

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Status Icons</h4>
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="success">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
          <Badge variant="warning">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
          <Badge variant="outline-primary">
            <Zap className="h-3 w-3" />
            Active
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Feature Icons</h4>
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="gradient">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
          <Badge variant="soft-warning">
            <Star className="h-3 w-3" />
            Featured
          </Badge>
          <Badge variant="soft-error">
            <Heart className="h-3 w-3" />
            Favorite
          </Badge>
          <Badge variant="soft-success">
            <Shield className="h-3 w-3" />
            Verified
          </Badge>
        </div>
      </div>
    </div>
  ),
}

// Status Badge Preset
export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Status Badge Preset</h4>
        <div className="flex items-center gap-4 flex-wrap">
          <StatusBadge status="active">Online</StatusBadge>
          <StatusBadge status="inactive">Offline</StatusBadge>
          <StatusBadge status="pending">Processing</StatusBadge>
          <StatusBadge status="success">Completed</StatusBadge>
          <StatusBadge status="error">Failed</StatusBadge>
          <StatusBadge status="warning">Attention</StatusBadge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Different Sizes</h4>
        <div className="flex items-center gap-4 flex-wrap">
          <StatusBadge status="success" size="sm">Done</StatusBadge>
          <StatusBadge status="warning">In Progress</StatusBadge>
          <StatusBadge status="error" size="lg">Critical</StatusBadge>
        </div>
      </div>
    </div>
  ),
}

// Priority Badge Preset
export const PriorityBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Priority Badge Preset</h4>
        <div className="flex items-center gap-4 flex-wrap">
          <PriorityBadge priority="low">Low Priority</PriorityBadge>
          <PriorityBadge priority="medium">Medium Priority</PriorityBadge>
          <PriorityBadge priority="high">High Priority</PriorityBadge>
          <PriorityBadge priority="urgent">Urgent</PriorityBadge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">With Custom Content</h4>
        <div className="flex items-center gap-4 flex-wrap">
          <PriorityBadge priority="low">
            <Target className="h-3 w-3" />
            P3
          </PriorityBadge>
          <PriorityBadge priority="medium">
            <TrendingUp className="h-3 w-3" />
            P2
          </PriorityBadge>
          <PriorityBadge priority="high">
            <Flame className="h-3 w-3" />
            P1
          </PriorityBadge>
          <PriorityBadge priority="urgent">
            <AlertCircle className="h-3 w-3" />
            P0
          </PriorityBadge>
        </div>
      </div>
    </div>
  ),
}

// Real-world Examples
export const UserProfile: Story = {
  render: () => (
    <div className="w-full max-w-md p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blueberry-100 dark:bg-blueberry-900 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-blueberry-600 dark:text-blueberry-400" />
          </div>
          <div>
            <h3 className="font-semibold">Sarah Chen</h3>
            <p className="text-sm text-neutral-600">Product Designer</p>
          </div>
        </div>
        <StatusBadge status="active">Online</StatusBadge>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Account Type</span>
          <Badge variant="gradient">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Verification</span>
          <Badge variant="soft-success">
            <Shield className="h-3 w-3" />
            Verified
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Team Role</span>
          <Badge variant="outline-primary">Admin</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Projects</span>
          <div className="flex gap-2">
            <Badge variant="soft-warning" size="sm">
              <Star className="h-3 w-3" />
              3 Active
            </Badge>
            <Badge variant="ghost" size="sm">12 Total</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const NotificationCenter: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Badge variant="destructive" size="sm">5 New</Badge>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blueberry-600" />
              <span className="font-medium">New message</span>
            </div>
            <Badge variant="soft-primary" size="sm">New</Badge>
          </div>
          <p className="text-sm text-neutral-600">You have a new message from Alex</p>
          <span className="text-xs text-neutral-500">2 minutes ago</span>
        </div>
        
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-success-600" />
              <span className="font-medium">Achievement unlocked</span>
            </div>
            <Badge variant="gradient" size="sm">
              <Sparkles className="h-3 w-3" />
              Special
            </Badge>
          </div>
          <p className="text-sm text-neutral-600">You've completed 100 tasks!</p>
          <span className="text-xs text-neutral-500">1 hour ago</span>
        </div>
        
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-warning-600" />
              <span className="font-medium">Subscription reminder</span>
            </div>
            <Badge variant="outline-warning" size="sm">Important</Badge>
          </div>
          <p className="text-sm text-neutral-600">Your subscription expires in 3 days</p>
          <span className="text-xs text-neutral-500">1 day ago</span>
        </div>
      </div>
    </div>
  ),
}

export const TaskList: Story = {
  render: () => (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Tasks</h3>
        <div className="flex gap-2">
          <Badge variant="soft-success" size="sm">8 Done</Badge>
          <Badge variant="soft-warning" size="sm">3 In Progress</Badge>
          <Badge variant="soft-error" size="sm">2 Blocked</Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Design system implementation</h4>
            <div className="flex gap-2">
              <PriorityBadge priority="high" size="sm">High</PriorityBadge>
              <StatusBadge status="pending" size="sm">In Progress</StatusBadge>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-3">
            Create reusable components for the design system
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="soft-primary" size="sm">Frontend</Badge>
            <Badge variant="outline" size="sm">Design</Badge>
            <Badge variant="ghost" size="sm">3 days left</Badge>
          </div>
        </div>
        
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">API documentation</h4>
            <div className="flex gap-2">
              <PriorityBadge priority="medium" size="sm">Medium</PriorityBadge>
              <StatusBadge status="success" size="sm">Completed</StatusBadge>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-3">
            Write comprehensive API documentation
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="soft-success" size="sm">Backend</Badge>
            <Badge variant="outline" size="sm">Documentation</Badge>
            <Badge variant="ghost" size="sm">
              <CheckCircle className="h-3 w-3" />
              Done
            </Badge>
          </div>
        </div>
        
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Performance optimization</h4>
            <div className="flex gap-2">
              <PriorityBadge priority="urgent" size="sm">Urgent</PriorityBadge>
              <StatusBadge status="error" size="sm">Blocked</StatusBadge>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-3">
            Optimize bundle size and loading performance
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="soft-warning" size="sm">Performance</Badge>
            <Badge variant="outline" size="sm">Frontend</Badge>
            <Badge variant="soft-error" size="sm">
              <AlertCircle className="h-3 w-3" />
              Needs Review
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}

// Interactive Example
export const InteractiveFilters: Story = {
  render: () => {
    const [selectedFilters, setSelectedFilters] = React.useState<string[]>(['active'])
    
    const toggleFilter = (filter: string) => {
      setSelectedFilters(prev => 
        prev.includes(filter) 
          ? prev.filter(f => f !== filter)
          : [...prev, filter]
      )
    }
    
    const filters = [
      { id: 'active', label: 'Active', variant: 'success' as const },
      { id: 'pending', label: 'Pending', variant: 'warning' as const },
      { id: 'completed', label: 'Completed', variant: 'outline-success' as const },
      { id: 'archived', label: 'Archived', variant: 'ghost' as const },
      { id: 'urgent', label: 'Urgent', variant: 'destructive' as const },
      { id: 'featured', label: 'Featured', variant: 'gradient' as const },
    ]
    
    return (
      <div className="w-full max-w-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filter Tasks</h3>
          <Badge variant="soft-primary" size="sm">
            {selectedFilters.length} active
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <Badge
                variant={selectedFilters.includes(filter.id) ? filter.variant : 'outline'}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedFilters.includes(filter.id) 
                    ? "ring-2 ring-offset-2 ring-blueberry-300" 
                    : "hover:border-blueberry-300"
                )}
              >
                {filter.label}
              </Badge>
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h4 className="font-medium mb-2">Active Filters:</h4>
          {selectedFilters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter) => (
                <Badge key={filter} variant="soft-primary" size="sm">
                  {filters.find(f => f.id === filter)?.label}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">No filters selected</p>
          )}
        </div>
      </div>
    )
  },
}

// Dark Mode Example
export const DarkModeShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="p-4 bg-white rounded-lg border">
        <h4 className="font-semibold mb-4">Light Mode</h4>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline-primary">Outline</Badge>
            <Badge variant="soft-success">Soft</Badge>
            <Badge variant="gradient">Gradient</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-700">
        <h4 className="font-semibold mb-4 text-white">Dark Mode</h4>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline-primary">Outline</Badge>
            <Badge variant="soft-success">Soft</Badge>
            <Badge variant="gradient">Gradient</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}