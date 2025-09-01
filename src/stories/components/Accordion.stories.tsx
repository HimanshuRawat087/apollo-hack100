import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from '@/components/ui/accordion'
import { 
  ChevronDown, 
  Settings, 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle,
  FileText,
  Database,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Apollo Accordion component with beautiful animations and Apollo design integration.

## Features
- **Smooth animations**: 300ms spring transitions with micro-interactions
- **Visual states**: Hover effects, gradient backgrounds when opened, border animations
- **Apollo design**: Perfect color integration with blueberry palette and typography
- **Accessibility**: Full keyboard navigation and screen reader support
- **Flexible**: Single or multiple items, controlled or uncontrolled
- **Interactive**: Color-changing borders, elevated shadows, icon rotations

## Visual Enhancements
- Cards lift and get gradient backgrounds when opened
- Borders animate to blueberry colors on interaction
- Icons smoothly rotate and change colors
- Shadows progressively deepen for depth
- Typography uses Apollo's heading and body classes
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether multiple items can be open at once',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether items can be collapsed (only for single type)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default open item(s)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Accordion>

// Basic Stories
export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-2xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Apollo Design System?</AccordionTrigger>
        <AccordionContent>
          Apollo is a comprehensive design system built with modern web technologies. 
          It provides a consistent visual language and component library that helps teams 
          build beautiful, accessible user interfaces quickly and efficiently.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Getting started with Apollo is easy! Simply install the package, import the 
          components you need, and start building. Our comprehensive documentation and 
          Storybook examples will guide you through every step of the process.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes! Apollo components are built with accessibility in mind. We follow WCAG 
          guidelines and include proper ARIA attributes, keyboard navigation, and screen 
          reader support out of the box.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-2xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>Personal Information</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blueberry-600" />
              <div>
                <p className="font-medium">Full Name</p>
                <p className="text-sm text-neutral-600">John Doe</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blueberry-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-neutral-600">john@example.com</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger>Account Settings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-success-600" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-neutral-600">Enabled</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blueberry-600" />
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-sm text-neutral-600">•••• •••• •••• 1234</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span>SMS notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>Push notifications</span>
            </label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const WithDefaultOpen: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-2',
  },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-2xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>Getting Started</AccordionTrigger>
        <AccordionContent>
          Learn the basics of Apollo Design System and how to integrate it into your project.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger>Components (Opens by default)</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Explore our comprehensive component library:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-600">
              <li>Buttons with multiple variants and states</li>
              <li>Form inputs with validation</li>
              <li>Navigation components</li>
              <li>Feedback and overlay components</li>
              <li>Data display components</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger>Customization</AccordionTrigger>
        <AccordionContent>
          Customize Apollo components to match your brand using our theming system.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-3xl">
      <AccordionItem value="faq-1">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-blueberry-600" />
            What browsers are supported?
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Apollo Design System supports all modern browsers:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blueberry-600" />
                <span className="text-sm">Chrome 90+</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blueberry-600" />
                <span className="text-sm">Firefox 88+</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blueberry-600" />
                <span className="text-sm">Safari 14+</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blueberry-600" />
                <span className="text-sm">Edge 90+</span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="faq-2">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-blueberry-600" />
            Is it mobile-friendly?
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>
              Absolutely! All Apollo components are designed with mobile-first principles and 
              are fully responsive. They work seamlessly across all device sizes.
            </p>
            <div className="bg-blueberry-50 dark:bg-blueberry-950 p-4 rounded-lg">
              <p className="text-sm text-blueberry-800 dark:text-blueberry-200">
                💡 <strong>Pro tip:</strong> Use our responsive utilities to customize 
                component behavior across different breakpoints.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="faq-3">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-blueberry-600" />
            Can I use it with my existing design system?
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p>
              Yes! Apollo is designed to be flexible and can be integrated alongside 
              existing design systems. You can:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-success-600 mt-0.5" />
                <span className="text-sm">Import only the components you need</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-success-600 mt-0.5" />
                <span className="text-sm">Customize colors and spacing</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-success-600 mt-0.5" />
                <span className="text-sm">Override styles with CSS-in-JS or CSS modules</span>
              </li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="faq-4">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blueberry-600" />
            How do I contribute?
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p>We welcome contributions! Here's how you can help:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blueberry-600 dark:text-blueberry-400">1</span>
                </div>
                <span className="text-sm">Fork the repository on GitHub</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blueberry-600 dark:text-blueberry-400">2</span>
                </div>
                <span className="text-sm">Create a feature branch</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blueberry-600 dark:text-blueberry-400">3</span>
                </div>
                <span className="text-sm">Submit a pull request</span>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const NestedContent: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-2xl">
      <AccordionItem value="features">
        <AccordionTrigger>Product Features</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p className="text-neutral-700 dark:text-neutral-300">
              Our platform includes everything you need to build modern applications:
            </p>
            
            <Accordion type="multiple" className="border-l-2 border-blueberry-200 pl-4">
              <AccordionItem value="ui">
                <AccordionTrigger className="text-sm">UI Components</AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm space-y-2">
                    <p>50+ pre-built components including:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span>• Buttons & Forms</span>
                      <span>• Navigation</span>
                      <span>• Data Display</span>
                      <span>• Feedback</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tools">
                <AccordionTrigger className="text-sm">Developer Tools</AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm space-y-2">
                    <p>Complete development toolkit:</p>
                    <div className="space-y-1 text-xs">
                      <div>• Storybook integration</div>
                      <div>• TypeScript support</div>
                      <div>• Testing utilities</div>
                      <div>• Design tokens</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="pricing">
        <AccordionTrigger>Pricing Plans</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <h4 className="font-semibold">Starter</h4>
                <p className="text-2xl font-bold text-blueberry-600">Free</p>
                <p className="text-sm text-neutral-600">Perfect for getting started</p>
              </div>
              <div className="p-4 border-2 border-blueberry-300 bg-blueberry-50 dark:bg-blueberry-950 rounded-lg">
                <h4 className="font-semibold">Pro</h4>
                <p className="text-2xl font-bold text-blueberry-600">$29/mo</p>
                <p className="text-sm text-neutral-600">For growing teams</p>
              </div>
              <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <h4 className="font-semibold">Enterprise</h4>
                <p className="text-2xl font-bold text-blueberry-600">Custom</p>
                <p className="text-sm text-neutral-600">For large organizations</p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-2xl">
      <AccordionItem value="terms">
        <AccordionTrigger>Terms of Service</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-sm max-h-64 overflow-y-auto">
            <section>
              <h4 className="font-semibold mb-2">1. Acceptance of Terms</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                By accessing and using this service, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the 
                above, please do not use this service.
              </p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">2. Use License</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                Permission is granted to temporarily download one copy of the materials on 
                our website for personal, non-commercial transitory viewing only. This is 
                the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose</li>
                <li>attempt to decompile or reverse engineer any software</li>
                <li>remove any copyright or other proprietary notations</li>
              </ul>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">3. Disclaimer</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                The materials on our website are provided on an 'as is' basis. We make no 
                warranties, expressed or implied, and hereby disclaim and negate all other 
                warranties including without limitation, implied warranties or conditions of 
                merchantability, fitness for a particular purpose, or non-infringement of 
                intellectual property or other violation of rights.
              </p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">4. Limitations</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                In no event shall our company or its suppliers be liable for any damages 
                (including, without limitation, damages for loss of data or profit, or due to 
                business interruption) arising out of the use or inability to use the materials 
                on our website, even if we or our authorized representative has been notified 
                orally or in writing of the possibility of such damage.
              </p>
            </section>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="privacy">
        <AccordionTrigger>Privacy Policy</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-sm">
            <p className="text-neutral-600 dark:text-neutral-400">
              Your privacy is important to us. This privacy statement explains the personal 
              data we process, how we process it, and for what purposes.
            </p>
            
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Data We Collect</h4>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>• Account information (name, email, phone)</li>
                <li>• Usage data and analytics</li>
                <li>• Device and browser information</li>
                <li>• Cookies and similar technologies</li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const EmptyState: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-2xl">
      <AccordionItem value="empty">
        <AccordionTrigger>Click to see empty content</AccordionTrigger>
        <AccordionContent>
          {/* Empty content to show the animation */}
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="minimal">
        <AccordionTrigger>Minimal content</AccordionTrigger>
        <AccordionContent>
          Just a single line of text.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

// Interactive Example
export const InteractiveExample: Story = {
  render: () => {
    const [openItems, setOpenItems] = React.useState<string[]>([])
    
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Interactive Settings Panel</h3>
          <div className="text-sm text-neutral-600">
            Open items: {openItems.length}
          </div>
        </div>
        
        <Accordion 
          type="multiple" 
          value={openItems}
          onValueChange={setOpenItems}
        >
          <AccordionItem value="account">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                Account Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-3 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    <div className="font-medium">Profile</div>
                    <div className="text-sm text-neutral-600">Update your profile information</div>
                  </button>
                  <button className="p-3 text-left border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-neutral-600">Change your password</div>
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="notifications">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" />
                Notifications
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {['Email updates', 'Push notifications', 'SMS alerts'].map((item) => (
                  <label key={item} className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="billing">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                Billing & Plans
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="p-4 bg-blueberry-50 dark:bg-blueberry-950 rounded-lg">
                  <div className="font-medium">Current Plan: Pro</div>
                  <div className="text-sm text-neutral-600">$29/month • Renews Dec 15, 2024</div>
                </div>
                <button className="w-full p-3 border border-blueberry-300 text-blueberry-600 rounded-lg hover:bg-blueberry-50">
                  Manage Billing
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  },
}
