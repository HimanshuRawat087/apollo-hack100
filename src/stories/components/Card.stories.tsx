import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  FeatureCard,
  StatsCard,
  ActionCard,
  type CardProps 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  Heart, 
  Share, 
  BookOpen, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Award,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Settings,
  Download,
  Eye,
  MessageCircle,
  ThumbsUp,
  ChevronRight,
  Zap,
  Shield,
  Rocket,
  Target,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Play
} from 'lucide-react'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Apollo Card component with comprehensive variants, sizes, and specialized components.

## Features
- **Multiple variants**: Default, elevated, outlined, ghost, gradient, glass, interactive, feature, success, warning, error
- **Flexible sizing**: sm, default, lg, xl with custom padding options
- **Specialized cards**: FeatureCard, StatsCard, ActionCard for common use cases
- **Apollo design**: Perfect integration with Apollo color system and typography
- **Interactive states**: Hover effects, animations, and cursor styles
- **Accessibility**: Proper semantic structure and keyboard navigation
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'elevated',
        'outlined', 
        'ghost',
        'gradient',
        'glass',
        'interactive',
        'feature',
        'success',
        'warning',
        'error'
      ],
      description: 'Visual style variant of the card',
    },
    size: {
      control: 'select', 
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Padding size of the card',
    },
    rounded: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'none'],
      description: 'Border radius variant',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

// Basic Stories
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>
          This is a default card with basic styling and subtle shadows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Card content goes here. You can add any content like text, images, buttons, or other components.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Learn More</Button>
      </CardFooter>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-80">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>
          Cards with elevated variant have stronger shadows and lift on hover.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Perfect for highlighting important content or creating depth in your layout.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-80">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>
          Outlined cards have prominent borders and minimal shadows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Great for creating clear boundaries and structured layouts.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Ghost: Story = {
  render: () => (
    <Card variant="ghost" className="w-80">
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
        <CardDescription>
          Ghost cards have minimal styling with subtle hover effects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Perfect for content that needs to blend into the background.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Gradient: Story = {
  render: () => (
    <Card variant="gradient" className="w-80">
      <CardHeader>
        <CardTitle>Gradient Card</CardTitle>
        <CardDescription>
          Gradient cards feature subtle background gradients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Adds visual interest while maintaining readability.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Glass: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-br from-blueberry-500 to-blueberry-700 rounded-lg">
      <Card variant="glass" className="w-80">
        <CardHeader>
          <CardTitle>Glass Card</CardTitle>
          <CardDescription>
            Glass cards have a frosted glass effect with backdrop blur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/80">
            Perfect for overlays and modern design aesthetics.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
}

export const Interactive: Story = {
  render: () => (
    <Card variant="interactive" className="w-80">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>
          Interactive cards respond to user interactions with animations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Click or hover to see the interactive effects in action.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Click me <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Feature: Story = {
  render: () => (
    <Card variant="feature" className="w-80">
      <CardHeader>
        <CardTitle gradient>Feature Card</CardTitle>
        <CardDescription>
          Feature cards highlight important content with Apollo branding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="soft-primary">New</Badge>
          <Badge variant="outline">Premium</Badge>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Perfect for showcasing key features, announcements, or premium content.
        </p>
      </CardContent>
    </Card>
  ),
}

// Status Variants
export const StatusCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="success" className="w-64">
        <CardHeader>
          <CardTitle>Success Card</CardTitle>
          <CardDescription>Everything completed successfully!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center">
              <Award className="h-4 w-4 text-success-600 dark:text-success-400" />
            </div>
            <span className="text-sm font-medium">Task completed</span>
          </div>
        </CardContent>
      </Card>

      <Card variant="warning" className="w-64">
        <CardHeader>
          <CardTitle>Warning Card</CardTitle>
          <CardDescription>Attention required for this item.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center">
              <Clock className="h-4 w-4 text-warning-600 dark:text-warning-400" />
            </div>
            <span className="text-sm font-medium">Review needed</span>
          </div>
        </CardContent>
      </Card>

      <Card variant="error" className="w-64">
        <CardHeader>
          <CardTitle>Error Card</CardTitle>
          <CardDescription>Something went wrong here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-error-100 dark:bg-error-900 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-error-600 dark:text-error-400" />
            </div>
            <span className="text-sm font-medium">Action required</span>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card size="sm" className="w-48">
        <CardHeader compact>
          <CardTitle size="sm">Small Card</CardTitle>
          <CardDescription size="sm">Compact padding</CardDescription>
        </CardHeader>
      </Card>

      <Card size="default" className="w-56">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Standard padding</CardDescription>
        </CardHeader>
      </Card>

      <Card size="lg" className="w-64">
        <CardHeader>
          <CardTitle size="lg">Large Card</CardTitle>
          <CardDescription>Spacious padding</CardDescription>
        </CardHeader>
      </Card>

      <Card size="xl" className="w-72">
        <CardHeader>
          <CardTitle size="xl">Extra Large</CardTitle>
          <CardDescription size="lg">Maximum padding</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Rounded Variants
export const RoundedVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card rounded="none" className="w-40">
        <CardHeader compact>
          <CardTitle size="sm">None</CardTitle>
        </CardHeader>
      </Card>

      <Card rounded="sm" className="w-40">
        <CardHeader compact>
          <CardTitle size="sm">Small</CardTitle>
        </CardHeader>
      </Card>

      <Card rounded="default" className="w-40">
        <CardHeader compact>
          <CardTitle size="sm">Default</CardTitle>
        </CardHeader>
      </Card>

      <Card rounded="lg" className="w-40">
        <CardHeader compact>
          <CardTitle size="sm">Large</CardTitle>
        </CardHeader>
      </Card>

      <Card rounded="xl" className="w-40">
        <CardHeader compact>
          <CardTitle size="sm">Extra Large</CardTitle>
        </CardHeader>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Specialized Components
export const FeatureCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FeatureCard
        icon={<Zap className="h-6 w-6" />}
        title="Lightning Fast"
        description="Built for speed with optimized performance and minimal load times."
      >
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Load Time</span>
            <span className="font-medium">&lt; 100ms</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div className="bg-blueberry-500 h-2 rounded-full w-4/5"></div>
          </div>
        </div>
      </FeatureCard>

      <FeatureCard
        icon={<Shield className="h-6 w-6" />}
        title="Secure by Design"
        description="Enterprise-grade security with end-to-end encryption and compliance."
      >
        <div className="flex gap-2">
          <Badge variant="soft-success" size="sm">SOC 2</Badge>
          <Badge variant="soft-success" size="sm">GDPR</Badge>
          <Badge variant="soft-success" size="sm">HIPAA</Badge>
        </div>
      </FeatureCard>

      <FeatureCard
        icon={<Rocket className="h-6 w-6" />}
        title="Easy to Scale"
        description="Grows with your business from startup to enterprise level."
      >
        <div className="text-center py-2">
          <div className="text-2xl font-bold text-blueberry-600 dark:text-blueberry-400">99.9%</div>
          <div className="text-xs text-neutral-500">Uptime SLA</div>
        </div>
      </FeatureCard>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const StatsCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        label="Total Revenue"
        value="$24,500"
        change="+12.5% from last month"
        trend="up"
        icon={<DollarSign className="h-6 w-6" />}
      />

      <StatsCard
        label="Active Users"
        value="1,429"
        change="+5.2% from last week"
        trend="up"
        icon={<Users className="h-6 w-6" />}
      />

      <StatsCard
        label="Conversion Rate"
        value="3.24%"
        change="-0.8% from yesterday"
        trend="down"
        icon={<Target className="h-6 w-6" />}
      />

      <StatsCard
        label="Page Views"
        value="12,450"
        change="No change"
        trend="neutral"
        icon={<BarChart3 className="h-6 w-6" />}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

export const ActionCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ActionCard
        title="Product Documentation"
        description="Complete guides and API references for developers."
        action={
          <Button size="sm" variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Read Docs
          </Button>
        }
        image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop"
      />

      <ActionCard
        title="Community Forum"
        description="Connect with other developers and get help from the community."
        action={
          <Button size="sm">
            <Users className="mr-2 h-4 w-4" />
            Join Forum
          </Button>
        }
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop"
      />

      <ActionCard
        title="Video Tutorials"
        description="Step-by-step video guides to get you started quickly."
        action={
          <Button size="sm" variant="success">
            <Play className="mr-2 h-4 w-4" />
            Watch Now
          </Button>
        }
        image="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

// Complex Examples
export const BlogPostCard: Story = {
  render: () => (
    <Card variant="elevated" className="w-96">
      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop"
          alt="Data Analytics Dashboard"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="soft-primary" size="sm">Analytics</Badge>
          <span className="text-xs text-neutral-500">5 min read</span>
        </div>
        <CardTitle>The Future of Data Analytics</CardTitle>
        <CardDescription>
          Discover how modern analytics tools are reshaping business intelligence and decision-making processes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Mar 15, 2024</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>2.4k views</span>
          </div>
        </div>
      </CardContent>

      <CardFooter justify="between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blueberry-400 to-blueberry-600"></div>
          <div className="text-sm">
            <div className="font-medium">Sarah Chen</div>
            <div className="text-neutral-500">Data Scientist</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
}

export const ProductCard: Story = {
  render: () => (
    <Card variant="interactive" className="w-80">
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blueberry-400 to-blueberry-600 flex items-center justify-center">
              <Rocket className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
        <Badge variant="success" className="absolute top-3 right-3">
          New
        </Badge>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Apollo Pro</CardTitle>
            <CardDescription>Advanced analytics platform</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blueberry-600 dark:text-blueberry-400">$49</div>
            <div className="text-xs text-neutral-500">/month</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-success-500"></div>
            <span>Unlimited dashboards</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-success-500"></div>
            <span>Real-time data sync</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-success-500"></div>
            <span>Advanced integrations</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const NotificationCard: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Card variant="ghost" className="border-l-4 border-l-blueberry-500">
        <CardHeader compact>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blueberry-100 dark:bg-blueberry-900 flex items-center justify-center flex-shrink-0">
              <Settings className="h-4 w-4 text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle size="sm">System Update Available</CardTitle>
              <CardDescription size="sm">
                A new version with enhanced security features is ready.
              </CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="ghost" size="sm">Dismiss</Button>
                <Button size="sm">Update Now</Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card variant="ghost" className="border-l-4 border-l-success-500">
        <CardHeader compact>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center flex-shrink-0">
              <Award className="h-4 w-4 text-success-600 dark:text-success-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle size="sm">Deployment Successful</CardTitle>
              <CardDescription size="sm">
                Your application has been deployed to production.
              </CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="ghost" size="sm">View Logs</Button>
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 h-3 w-3" />
                  Visit Site
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  ),
}

// Interactive Example
export const InteractiveExample: Story = {
  render: () => {
    const [liked, setLiked] = React.useState(false)
    const [bookmarked, setBookmarked] = React.useState(false)
    
    return (
      <Card variant="elevated" className="w-96">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Interactive Card Example</CardTitle>
              <CardDescription>
                This card demonstrates interactive elements and state management.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Star className={bookmarked ? "fill-current text-warning-500" : ""} />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blueberry-400 to-blueberry-600"></div>
              <div>
                <div className="font-medium">Alex Thompson</div>
                <div className="text-sm text-neutral-500">2 hours ago</div>
              </div>
            </div>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              "Just launched our new Apollo design system! The components are incredibly flexible and the documentation is top-notch. Highly recommend checking it out."
            </p>
          </div>
        </CardContent>

        <CardFooter justify="between">
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <MessageCircle className="h-4 w-4" />
            <span>12 comments</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={liked ? "fill-current text-error-500" : ""} />
              {liked ? "Liked" : "Like"}
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  },
}

// Accessibility Story
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Keyboard Navigation</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Interactive cards support keyboard navigation. Use Tab to navigate between focusable elements.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="interactive" tabIndex={0} className="focus:ring-2 focus:ring-blueberry-500 focus:ring-offset-2">
            <CardHeader>
              <CardTitle>Focusable Card</CardTitle>
              <CardDescription>This card can receive keyboard focus</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>With proper heading hierarchy and semantic structure</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li>• Proper heading levels (h1, h2, h3)</li>
                <li>• Descriptive alt text for images</li>
                <li>• Accessible color contrast</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Screen Reader Support</h3>
        <Card variant="feature">
          <CardHeader>
            <CardTitle>Accessible Content Structure</CardTitle>
            <CardDescription>
              This card follows proper semantic HTML structure for screen readers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div role="list" className="space-y-2">
              <div role="listitem" className="flex items-center gap-2">
                <Award className="h-4 w-4 text-success-500" aria-hidden="true" />
                <span>Semantic HTML elements</span>
              </div>
              <div role="listitem" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blueberry-500" aria-hidden="true" />
                <span>ARIA labels and roles</span>
              </div>
              <div role="listitem" className="flex items-center gap-2">
                <Target className="h-4 w-4 text-warning-500" aria-hidden="true" />
                <span>Proper focus management</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}