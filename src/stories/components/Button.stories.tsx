import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { 
  Button, 
  IconButton,
  type ButtonProps 
} from '@/components/ui/button'
import { 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Settings, 
  Mail, 
  ArrowRight,
  Heart,
  Star,
  Play,
  Pause
} from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Apollo Button component with comprehensive variants, sizes, and states.

## Features
- **Multiple variants**: Default, secondary, success, destructive, warning, outline variants, ghost variants, gradient, glass, and link
- **Flexible sizing**: xs, sm, default, lg, xl with icon variants
- **Loading states**: Built-in loading spinner with custom text
- **Icon support**: Left icons, right icons, and icon-only buttons
- **Apollo design**: Perfect integration with Apollo color system and typography
- **Accessibility**: Full keyboard navigation and screen reader support
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
        'outline-secondary',
        'outline-success', 
        'outline-destructive',
        'ghost',
        'ghost-secondary',
        'ghost-success',
        'ghost-destructive',
        'gradient',
        'glass',
        'link'
      ],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select', 
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
      description: 'Size of the button',
    },
    rounded: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'full', 'none'],
      description: 'Border radius variant',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state with spinner',
    },
    loadingText: {
      control: 'text',
      description: 'Text to show when loading (optional)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    children: {
      control: 'text',
      description: 'Button text content',
    },
  },
  args: {
    onClick: () => console.log('Button clicked!'),
  },
}

export default meta
type Story = StoryObj<typeof Button>

// Basic Stories
export const Default: Story = {
  args: {
    children: 'Button',
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
    children: 'Delete',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
}

// Outline Variants
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const OutlineSecondary: Story = {
  args: {
    variant: 'outline-secondary',
    children: 'Outline Secondary',
  },
}

// Ghost Variants  
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
}

export const GhostSecondary: Story = {
  args: {
    variant: 'ghost-secondary',
    children: 'Ghost Secondary',
  },
}

// Special Variants
export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: 'Gradient',
  },
}

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: 'Glass Effect',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
}

// Rounded Variants
export const RoundedVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button rounded="none">None</Button>
      <Button rounded="sm">Small</Button>
      <Button rounded="default">Default</Button>
      <Button rounded="lg">Large</Button>
      <Button rounded="full">Full</Button>
    </div>
  ),
}

// With Icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <Save className="h-4 w-4" />,
    children: 'Save File',
  },
}

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRight className="h-4 w-4" />,
    children: 'Continue',
  },
}

export const WithBothIcons: Story = {
  args: {
    leftIcon: <Download className="h-4 w-4" />,
    rightIcon: <ArrowRight className="h-4 w-4" />,
    children: 'Download',
  },
}

// Icon Buttons
export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={<Plus />} size="sm" tooltip="Add item" />
      <IconButton icon={<Settings />} tooltip="Settings" />
      <IconButton icon={<Trash2 />} size="lg" variant="destructive" tooltip="Delete" />
      <IconButton icon={<Heart />} size="xl" variant="ghost" tooltip="Like" />
    </div>
  ),
}

// Loading States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
}

export const LoadingWithCustomText: Story = {
  args: {
    loading: true,
    loadingText: 'Saving your work...',
    children: 'Save',
  },
}

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
}

export const DisabledVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>Default</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="destructive" disabled>Destructive</Button>
    </div>
  ),
}

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-6">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="outline-secondary">Outline Secondary</Button>
      <Button variant="outline-success">Outline Success</Button>
      <Button variant="outline-destructive">Outline Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost-secondary">Ghost Secondary</Button>
      <Button variant="ghost-success">Ghost Success</Button>
      <Button variant="ghost-destructive">Ghost Destructive</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Interactive Examples
export const InteractiveExample: Story = {
  render: () => {
    const [liked, setLiked] = React.useState(false)
    const [playing, setPlaying] = React.useState(false)
    
    return (
      <div className="flex items-center gap-4">
        <Button
          variant={liked ? "success" : "outline"}
          leftIcon={<Heart className={liked ? "fill-current" : ""} />}
          onClick={() => setLiked(!liked)}
        >
          {liked ? 'Liked' : 'Like'}
        </Button>
        
        <IconButton
          icon={playing ? <Pause /> : <Play />}
          variant={playing ? "secondary" : "default"}
          onClick={() => setPlaying(!playing)}
          tooltip={playing ? "Pause" : "Play"}
        />
        
        <Button
          variant="gradient"
          leftIcon={<Star className="fill-current" />}
          rightIcon={<ArrowRight />}
        >
          Premium Feature
        </Button>
      </div>
    )
  },
}

// Form Example
export const FormExample: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4 p-6 border border-neutral-200 rounded-lg">
      <h3 className="text-lg font-semibold">Contact Form</h3>
      
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Your name" 
          className="w-full p-2 border border-neutral-300 rounded-md"
        />
        <input 
          type="email" 
          placeholder="Your email" 
          className="w-full p-2 border border-neutral-300 rounded-md"
        />
        <textarea 
          placeholder="Your message" 
          className="w-full p-2 border border-neutral-300 rounded-md h-24"
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Save />}>
            Save Draft
          </Button>
          <Button leftIcon={<Mail />}>
            Send Message
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Accessibility Story
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Keyboard Navigation</h3>
        <p className="text-xs text-neutral-600 mb-4">
          Use Tab to navigate, Enter/Space to activate, Escape to cancel focus
        </p>
        <div className="flex gap-2">
          <Button>First</Button>
          <Button variant="secondary">Second</Button>
          <Button variant="outline">Third</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Screen Reader Support</h3>
        <div className="flex gap-2">
          <IconButton 
            icon={<Plus />} 
            tooltip="Add new item"
            aria-label="Add new item"
          />
          <Button 
            variant="destructive"
            aria-describedby="delete-help"
          >
            Delete
          </Button>
          <p id="delete-help" className="sr-only">
            This action cannot be undone
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}