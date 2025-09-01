import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { 
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandQuickActions,
  CommandSearchResults,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  Plus,
  Settings,
  User,
  FileText,
  Folder,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Copy,
  Trash2,
  Archive,
  Star,
  Heart,
  Share,
  Edit,
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Home,
  Building,
  Users,
  Database,
  Server,
  Code,
  Terminal,
  Globe,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Bookmark,
  Tag,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Zap,
  Sparkles,
  Rocket,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Calculator,
  Palette,
  Brush,
  Layers,
  Grid,
  Maximize,
  Minimize,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Type
} from 'lucide-react'

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Apollo Command component - A powerful command palette for navigation and actions.

## Features
- **Fuzzy search**: Fast and intelligent search through commands
- **Keyboard shortcuts**: Full keyboard navigation with shortcuts display
- **Grouping**: Organize commands into logical groups
- **Icons & badges**: Rich visual indicators for commands
- **Dialog integration**: Modal command palette with Apollo styling
- **Quick actions**: Preset component for common actions
- **Search results**: Organized display of search results
- **Empty states**: Customizable no-results display
- **Apollo design**: Perfect integration with Apollo color system

## Usage
Command palettes are perfect for power users who want quick access to functionality without mouse navigation. Common use cases include:
- Application navigation
- File operations
- Quick settings
- Search functionality
- Workflow automation
        `,
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes for styling',
    },
  },
}

export default meta
type Story = StoryObj<typeof Command>

// Basic Command
export const Basic: Story = {
  render: () => (
    <Command className="w-96 h-80">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Suggestions">
          <CommandItem icon={<Calendar />}>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem icon={<User />}>
            <span>Profile</span>
          </CommandItem>
          <CommandItem icon={<Settings />}>
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Actions">
          <CommandItem icon={<Plus />} shortcut="⌘N">
            <span>New File</span>
          </CommandItem>
          <CommandItem icon={<FileText />} shortcut="⌘O">
            <span>Open File</span>
          </CommandItem>
          <CommandItem icon={<Download />} shortcut="⌘S">
            <span>Save</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// Command Dialog
export const DialogExample: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }
      }
      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
    }, [])

    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Press <kbd className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 rounded border font-mono">⌘K</kbd> or click the button to open
          </p>
          <Button onClick={() => setOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            Open Command Palette
          </Button>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Quick Actions">
              <CommandItem icon={<Plus />} shortcut="⌘N">
                Create New
              </CommandItem>
              <CommandItem icon={<Upload />} shortcut="⌘U">
                Upload File
              </CommandItem>
              <CommandItem icon={<Download />} shortcut="⌘D">
                Download
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Navigation">
              <CommandItem icon={<Home />} shortcut="⌘H">
                Go to Dashboard
              </CommandItem>
              <CommandItem icon={<Users />} shortcut="⌘T">
                Team
              </CommandItem>
              <CommandItem icon={<Settings />} shortcut="⌘,">
                Settings
              </CommandItem>
              <CommandItem icon={<User />} shortcut="⌘P">
                Profile
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Tools">
              <CommandItem icon={<Calculator />}>
                Calculator
              </CommandItem>
              <CommandItem icon={<Calendar />}>
                Calendar
              </CommandItem>
              <CommandItem icon={<Clock />}>
                Time Tracker
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    )
  },
}

// Advanced Command with Rich Content
export const AdvancedExample: Story = {
  render: () => (
    <Command className="w-[600px] h-96">
      <CommandInput 
        placeholder="Search files, commands, or anything..." 
        showSparkles={true}
      />
      <CommandList>
        <CommandEmpty 
          icon={<Search />}
          title="No results found"
          description="Try searching for something else or check your spelling"
        />
        
        <CommandGroup heading="Recent Files">
          <CommandItem 
            icon={<FileText />}
            description="Updated 2 minutes ago"
            badge={<Badge variant="soft-primary" size="sm">Draft</Badge>}
          >
            Project Proposal.docx
          </CommandItem>
          <CommandItem 
            icon={<Image />}
            description="Created yesterday"
            badge={<Badge variant="soft-success" size="sm">New</Badge>}
          >
            Apollo_Logo_2024.png
          </CommandItem>
          <CommandItem 
            icon={<Video />}
            description="Shared last week"
          >
            Team_Meeting_Recording.mp4
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem icon={<Plus />} shortcut="⌘N">
            New Document
          </CommandItem>
          <CommandItem icon={<Folder />} shortcut="⌘⇧N">
            New Folder
          </CommandItem>
          <CommandItem icon={<Upload />} shortcut="⌘U">
            Upload Files
          </CommandItem>
          <CommandItem icon={<Share />} shortcut="⌘⇧S">
            Share Selection
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Edit">
          <CommandItem icon={<Copy />} shortcut="⌘C">
            Copy
          </CommandItem>
          <CommandItem icon={<Trash2 />} shortcut="⌫">
            Delete
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="View">
          <CommandItem icon={<Grid />} shortcut="⌘1">
            Grid View
          </CommandItem>
          <CommandItem icon={<FileText />} shortcut="⌘2">
            List View
          </CommandItem>
          <CommandItem icon={<Maximize />} shortcut="⌘F">
            Fullscreen
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// Application Command Palette
export const ApplicationExample: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (action: string) => {
      console.log(`Selected: ${action}`)
      setOpen(false)
    }

    return (
      <div className="space-y-4">
        <div className="text-center">
          <Button onClick={() => setOpen(true)} variant="outline">
            <Terminal className="mr-2 h-4 w-4" />
            Open App Command Palette
          </Button>
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search for commands, files, or settings..." />
          <CommandList>
            <CommandEmpty>
              <div className="text-center py-6">
                <Search className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
                <p className="subtitle text-neutral-600 dark:text-neutral-400">
                  No commands found
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  Try a different search term
                </p>
              </div>
            </CommandEmpty>
            
            <CommandGroup heading="Create">
              <CommandItem 
                icon={<FileText />} 
                shortcut="⌘N"
                onSelect={() => handleSelect('new-document')}
              >
                New Document
              </CommandItem>
              <CommandItem 
                icon={<Folder />} 
                shortcut="⌘⇧N"
                onSelect={() => handleSelect('new-folder')}
              >
                New Folder
              </CommandItem>
              <CommandItem 
                icon={<Code />} 
                shortcut="⌘⌥N"
                onSelect={() => handleSelect('new-project')}
              >
                New Project
              </CommandItem>
              <CommandItem 
                icon={<Database />}
                onSelect={() => handleSelect('new-database')}
              >
                New Database
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Navigation">
              <CommandItem 
                icon={<Home />} 
                shortcut="⌘H"
                onSelect={() => handleSelect('go-home')}
              >
                Go to Home
              </CommandItem>
              <CommandItem 
                icon={<Building />} 
                shortcut="⌘⇧H"
                onSelect={() => handleSelect('go-workspace')}
              >
                Go to Workspace
              </CommandItem>
              <CommandItem 
                icon={<Users />} 
                shortcut="⌘T"
                onSelect={() => handleSelect('go-team')}
              >
                Go to Team
              </CommandItem>
              <CommandItem 
                icon={<BarChart3 />} 
                shortcut="⌘R"
                onSelect={() => handleSelect('go-reports')}
              >
                Go to Reports
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Tools">
              <CommandItem 
                icon={<Calculator />}
                onSelect={() => handleSelect('calculator')}
              >
                Calculator
              </CommandItem>
              <CommandItem 
                icon={<Calendar />}
                onSelect={() => handleSelect('calendar')}
              >
                Calendar
              </CommandItem>
              <CommandItem 
                icon={<Clock />}
                onSelect={() => handleSelect('time-tracker')}
              >
                Time Tracker
              </CommandItem>
              <CommandItem 
                icon={<Terminal />}
                shortcut="⌘`"
                onSelect={() => handleSelect('terminal')}
              >
                Terminal
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Settings">
              <CommandItem 
                icon={<Settings />} 
                shortcut="⌘,"
                onSelect={() => handleSelect('preferences')}
              >
                Preferences
              </CommandItem>
              <CommandItem 
                icon={<User />} 
                shortcut="⌘⇧P"
                onSelect={() => handleSelect('profile')}
              >
                Profile Settings
              </CommandItem>
              <CommandItem 
                icon={<Shield />}
                onSelect={() => handleSelect('security')}
              >
                Security & Privacy
              </CommandItem>
              <CommandItem 
                icon={<Bell />}
                onSelect={() => handleSelect('notifications')}
              >
                Notifications
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Help">
              <CommandItem 
                icon={<FileText />}
                onSelect={() => handleSelect('documentation')}
              >
                Documentation
              </CommandItem>
              <CommandItem 
                icon={<MessageSquare />}
                onSelect={() => handleSelect('support')}
              >
                Contact Support
              </CommandItem>
              <CommandItem 
                icon={<Rocket />}
                onSelect={() => handleSelect('whats-new')}
              >
                What's New
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    )
  },
}

// File Manager Command
export const FileManagerExample: Story = {
  render: () => (
    <Command className="w-[500px] h-80">
      <CommandInput placeholder="Search files and folders..." />
      <CommandList>
        <CommandEmpty>No files or folders found.</CommandEmpty>
        
        <CommandGroup heading="Recent Files">
          <CommandItem 
            icon={<FileText />}
            description="Apollo Design System documentation"
            badge={<Badge variant="outline" size="sm">PDF</Badge>}
          >
            design-system-guide.pdf
          </CommandItem>
          <CommandItem 
            icon={<Image />}
            description="Logo variations and brand assets"
            badge={<Badge variant="soft-primary" size="sm">PNG</Badge>}
          >
            apollo-brand-kit.png
          </CommandItem>
          <CommandItem 
            icon={<Code />}
            description="React component library"
            badge={<Badge variant="soft-success" size="sm">TSX</Badge>}
          >
            button-component.tsx
          </CommandItem>
          <CommandItem 
            icon={<Video />}
            description="Team standup recording"
            badge={<Badge variant="soft-warning" size="sm">MP4</Badge>}
          >
            standup-march-15.mp4
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Folders">
          <CommandItem icon={<Folder />} description="Project documentation">
            📁 Documentation
          </CommandItem>
          <CommandItem icon={<Folder />} description="Design assets and resources">
            🎨 Design Assets
          </CommandItem>
          <CommandItem icon={<Folder />} description="Source code repository">
            💻 Source Code
          </CommandItem>
          <CommandItem icon={<Folder />} description="Meeting recordings and notes">
            📹 Recordings
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem icon={<Upload />} shortcut="⌘U">
            Upload Files
          </CommandItem>
          <CommandItem icon={<Plus />} shortcut="⌘⇧N">
            New Folder
          </CommandItem>
          <CommandItem icon={<Share />} shortcut="⌘⇧S">
            Share Selected
          </CommandItem>
          <CommandItem icon={<Archive />} shortcut="⌘A">
            Archive Selected
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// Search Results Example
export const SearchResultsExample: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = React.useState('')

    const allItems = [
      { id: 1, title: 'Apollo Design System', description: 'Complete design system documentation', type: 'document', icon: <FileText /> },
      { id: 2, title: 'Button Component', description: 'Reusable button component with variants', type: 'component', icon: <Code /> },
      { id: 3, title: 'Color Palette', description: 'Apollo brand colors and usage guidelines', type: 'design', icon: <Palette /> },
      { id: 4, title: 'Typography Scale', description: 'Font sizes and typography system', type: 'design', icon: <Type /> },
      { id: 5, title: 'Team Meeting Notes', description: 'Weekly sync meeting minutes', type: 'document', icon: <FileText /> },
      { id: 6, title: 'User Research', description: 'Insights from recent user interviews', type: 'research', icon: <Users /> },
      { id: 7, title: 'Performance Metrics', description: 'Application performance dashboard', type: 'analytics', icon: <BarChart3 /> },
      { id: 8, title: 'API Documentation', description: 'REST API reference and examples', type: 'technical', icon: <Server /> },
    ]

    const filteredItems = allItems.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'component': return 'soft-primary'
        case 'design': return 'soft-success'
        case 'document': return 'outline'
        case 'research': return 'soft-warning'
        case 'analytics': return 'soft-error'
        case 'technical': return 'outline-primary'
        default: return 'outline'
      }
    }

    return (
      <Command className="w-[600px] h-96">
        <CommandInput 
          placeholder="Search documentation, components, and resources..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>
            <div className="text-center py-8">
              <Search className="mx-auto h-16 w-16 text-neutral-300 dark:text-neutral-600 mb-4" />
              <p className="subtitle text-neutral-600 dark:text-neutral-400 mb-2">
                No results for "{searchTerm}"
              </p>
              <p className="text-sm text-neutral-500">
                Try adjusting your search or browse categories below
              </p>
            </div>
          </CommandEmpty>
          
          {searchTerm === '' ? (
            <>
              <CommandGroup heading="Popular">
                <CommandItem icon={<Star />}>Apollo Design System</CommandItem>
                <CommandItem icon={<Code />}>Component Library</CommandItem>
                <CommandItem icon={<Palette />}>Brand Guidelines</CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Categories">
                <CommandItem icon={<Code />}>Components</CommandItem>
                <CommandItem icon={<Palette />}>Design Tokens</CommandItem>
                <CommandItem icon={<FileText />}>Documentation</CommandItem>
                <CommandItem icon={<Users />}>Research</CommandItem>
              </CommandGroup>
            </>
          ) : (
            <CommandGroup heading={`Results for "${searchTerm}"`}>
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.id}
                  icon={item.icon}
                  description={item.description}
                  badge={
                    <Badge 
                      variant={getTypeColor(item.type) as any} 
                      size="sm"
                    >
                      {item.type}
                    </Badge>
                  }
                >
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    )
  },
}

// Preset Components Example
export const PresetComponentsExample: Story = {
  render: () => {
    const quickActions = [
      { icon: <Plus />, label: 'Create New', shortcut: '⌘N', onSelect: () => console.log('Create') },
      { icon: <Upload />, label: 'Upload File', shortcut: '⌘U', onSelect: () => console.log('Upload') },
      { icon: <Download />, label: 'Download', shortcut: '⌘D', onSelect: () => console.log('Download') },
      { icon: <Share />, label: 'Share', shortcut: '⌘⇧S', onSelect: () => console.log('Share') },
      { icon: <Settings />, label: 'Settings', shortcut: '⌘,', onSelect: () => console.log('Settings') },
    ]

    const searchResults = [
      {
        icon: <FileText />,
        title: 'Project Documentation',
        description: 'Complete project specifications and requirements',
        badge: <Badge variant="outline" size="sm">DOC</Badge>,
        onSelect: () => console.log('Open documentation'),
      },
      {
        icon: <Code />,
        title: 'Component Library',
        description: 'React components and design system elements',
        badge: <Badge variant="soft-primary" size="sm">CODE</Badge>,
        onSelect: () => console.log('Open components'),
      },
      {
        icon: <Image />,
        title: 'Design Assets',
        description: 'Icons, illustrations, and brand materials',
        badge: <Badge variant="soft-success" size="sm">DESIGN</Badge>,
        onSelect: () => console.log('Open assets'),
      },
    ]

    return (
      <Command className="w-[500px] h-80">
        <CommandInput placeholder="Search or select an action..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandQuickActions actions={quickActions} />
          
          <CommandSeparator />
          
          <CommandSearchResults 
            results={searchResults}
            emptyMessage="No search results available"
          />
        </CommandList>
      </Command>
    )
  },
}

// Keyboard Navigation Example
export const KeyboardNavigationExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Keyboard Navigation</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Use arrow keys to navigate, Enter to select, Escape to close
        </p>
        
        <div className="flex justify-center gap-2 text-xs">
          <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded border font-mono">↑↓</kbd>
          <span>Navigate</span>
          <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded border font-mono">Enter</kbd>
          <span>Select</span>
          <kbd className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded border font-mono">Esc</kbd>
          <span>Close</span>
        </div>
      </div>

      <Command className="w-96 h-72">
        <CommandInput placeholder="Try navigating with your keyboard..." />
        <CommandList>
          <CommandEmpty>Type to search...</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            <CommandItem icon={<Home />} shortcut="⌘H">
              Home
            </CommandItem>
            <CommandItem icon={<Users />} shortcut="⌘T">
              Team
            </CommandItem>
            <CommandItem icon={<Settings />} shortcut="⌘,">
              Settings
            </CommandItem>
            <CommandItem icon={<User />} shortcut="⌘P">
              Profile
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem icon={<Plus />} shortcut="⌘N">
              New Item
            </CommandItem>
            <CommandItem icon={<Edit />} shortcut="⌘E">
              Edit
            </CommandItem>
            <CommandItem icon={<Copy />} shortcut="⌘C">
              Copy
            </CommandItem>
            <CommandItem icon={<Trash2 />} shortcut="⌫">
              Delete
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

// Custom Styling Example
export const CustomStylingExample: Story = {
  render: () => (
    <Command className="w-96 h-80 border-2 border-blueberry-200 dark:border-blueberry-700">
      <CommandInput 
        placeholder="Custom styled command palette..." 
        className="border-b-2 border-blueberry-200 dark:border-blueberry-700"
        showSparkles={true}
      />
      <CommandList>
        <CommandEmpty 
          icon={<Sparkles />}
          title="Start typing to search"
          description="Find anything in your workspace instantly"
        />
        
        <CommandGroup heading="✨ Featured">
          <CommandItem 
            icon={<Rocket />}
            badge={<Badge variant="gradient" size="sm">Pro</Badge>}
          >
            Apollo AI Assistant
          </CommandItem>
          <CommandItem 
            icon={<Zap />}
            badge={<Badge variant="soft-success" size="sm">New</Badge>}
          >
            Lightning Generator
          </CommandItem>
          <CommandItem 
            icon={<Target />}
            badge={<Badge variant="soft-warning" size="sm">Beta</Badge>}
          >
            Smart Targeting
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="🎨 Design Tools">
          <CommandItem icon={<Palette />} shortcut="⌘⇧C">
            Color Picker
          </CommandItem>
          <CommandItem icon={<Brush />} shortcut="⌘⇧B">
            Brush Tools
          </CommandItem>
          <CommandItem icon={<Layers />} shortcut="⌘⇧L">
            Layer Manager
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="📱 Devices">
          <CommandItem icon={<Monitor />} shortcut="⌘1">
            Desktop View
          </CommandItem>
          <CommandItem icon={<Tablet />} shortcut="⌘2">
            Tablet View
          </CommandItem>
          <CommandItem icon={<Smartphone />} shortcut="⌘3">
            Mobile View
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// Accessibility Example
export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Accessibility Features</h3>
        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <div>• Full keyboard navigation support</div>
          <div>• Screen reader compatible with proper ARIA labels</div>
          <div>• High contrast mode support</div>
          <div>• Reduced motion respect</div>
          <div>• Focus indicators for all interactive elements</div>
        </div>
      </div>

      <Command className="w-96 h-72" role="dialog" aria-label="Command palette">
        <CommandInput 
          placeholder="Accessible command search..." 
          aria-label="Search commands"
        />
        <CommandList role="listbox" aria-label="Available commands">
          <CommandEmpty>
            <div role="status" aria-live="polite">
              No commands found matching your search
            </div>
          </CommandEmpty>
          
          <CommandGroup heading="Navigation" role="group" aria-label="Navigation commands">
            <CommandItem 
              icon={<Home />} 
              shortcut="⌘H"
              role="option"
              aria-label="Navigate to home page"
            >
              Home
            </CommandItem>
            <CommandItem 
              icon={<Users />} 
              shortcut="⌘T"
              role="option"
              aria-label="Navigate to team page"
            >
              Team
            </CommandItem>
            <CommandItem 
              icon={<Settings />} 
              shortcut="⌘,"
              role="option"
              aria-label="Open settings"
            >
              Settings
            </CommandItem>
          </CommandGroup>

          <CommandSeparator role="separator" />

          <CommandGroup heading="File Operations" role="group" aria-label="File operation commands">
            <CommandItem 
              icon={<Plus />} 
              shortcut="⌘N"
              role="option"
              aria-label="Create new file"
            >
              New File
            </CommandItem>
            <CommandItem 
              icon={<Upload />} 
              shortcut="⌘U"
              role="option"
              aria-label="Upload file"
            >
              Upload
            </CommandItem>
            <CommandItem 
              icon={<Download />} 
              shortcut="⌘D"
              role="option"
              aria-label="Download file"
            >
              Download
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}
