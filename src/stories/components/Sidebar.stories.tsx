// stories/Sidebar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  User,
  Bell,
  Search,
  LogOut,
  Briefcase,
  Book
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
  SidebarGroup,
  SidebarSeparator,
} from '@/components/ui/sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A minimal, responsive sidebar component with collapsible functionality.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Basic Example
export const Default: Story = {
  render: () => (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blueberry-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Apollo
              </h2>
            </div>
          </div>
        </SidebarHeader>

        <SidebarNav>
          <SidebarNavItem icon={<Home />} active>
            Dashboard
          </SidebarNavItem>
          <SidebarNavItem icon={<Users />} badge="12">
            Users
          </SidebarNavItem>
          <SidebarNavItem icon={<FileText />}>
            Documents
          </SidebarNavItem>
          <SidebarNavItem icon={<BarChart3 />}>
            Analytics
          </SidebarNavItem>
          <SidebarNavItem icon={<Settings />}>
            Settings
          </SidebarNavItem>
        </SidebarNav>

        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div className="w-8 h-8 bg-blueberry-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                John Doe
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                john@example.com
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Dashboard
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700"
              >
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  Card {i}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  This is a sample card demonstrating the sidebar layout.
                </p>
              </div>
            ))}
          </div>
        </div>
      </SidebarContent>
    </SidebarProvider>
  ),
};

// Teacher Portal Example
export const TeacherPortal: Story = {
  render: () => (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blueberry-500 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 100 100" className="text-white">
                <rect x="20" y="20" width="50" height="50" rx="10" fill="currentColor" />
                <rect x="40" y="40" width="50" height="50" rx="10" fill="currentColor" opacity="0.7" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Apollo
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Teacher Portal
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarNav>
          <SidebarNavItem icon={<Home />} active>
            Dashboard
          </SidebarNavItem>
          <SidebarNavItem icon={<Users />}>
            Student Mentor
          </SidebarNavItem>
          <SidebarNavItem icon={<Book />}>
            Curriculum Suggestor
          </SidebarNavItem>
          <SidebarNavItem icon={<Briefcase />}>
            Admin Work
          </SidebarNavItem>
        </SidebarNav>

        <SidebarFooter>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <div className="w-8 h-8 bg-blueberry-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">T</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Teacher
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  teacher@apollo.edu
                </p>
              </div>
            </div>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-error-50 hover:text-error-700 dark:hover:bg-error-950 dark:hover:text-error-300 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Teacher Dashboard
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Manage your classes and students
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Total Students', value: '127', color: 'text-blueberry-600' },
              { title: 'Active Classes', value: '8', color: 'text-success-600' },
              { title: 'Assignments', value: '24', color: 'text-warning-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                  {stat.title}
                </h3>
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-br from-blueberry-50 to-blueberry-100 dark:from-blueberry-950 dark:to-blueberry-900 rounded-lg p-6 border border-blueberry-200 dark:border-blueberry-800">
            <h3 className="text-lg font-semibold text-blueberry-900 dark:text-blueberry-100 mb-2">
              Welcome to Apollo Teacher Portal
            </h3>
            <p className="text-blueberry-800 dark:text-blueberry-200">
              Your central hub for managing classes, mentoring students, and accessing curriculum resources.
            </p>
          </div>
        </div>
      </SidebarContent>
    </SidebarProvider>
  ),
};

// With Groups and Separators
export const WithGroups: Story = {
  render: () => (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blueberry-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Apollo
              </h2>
            </div>
          </div>
        </SidebarHeader>

        <SidebarNav>
          <SidebarGroup title="Main">
            <SidebarNavItem icon={<Home />} active>
              Dashboard
            </SidebarNavItem>
            <SidebarNavItem icon={<Users />}>
              Users
            </SidebarNavItem>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup title="Content">
            <SidebarNavItem icon={<FileText />}>
              Documents
            </SidebarNavItem>
            <SidebarNavItem icon={<BarChart3 />}>
              Analytics
            </SidebarNavItem>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup title="System">
            <SidebarNavItem icon={<Settings />}>
              Settings
            </SidebarNavItem>
          </SidebarGroup>
        </SidebarNav>

        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Admin User
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Organized Sidebar
            </h1>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
            <p className="text-neutral-600 dark:text-neutral-400">
              This example shows how to organize sidebar items using groups and separators.
            </p>
          </div>
        </div>
      </SidebarContent>
    </SidebarProvider>
  ),
};

// Collapsed State
export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blueberry-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Apollo
              </h2>
            </div>
          </div>
        </SidebarHeader>

        <SidebarNav>
          <SidebarNavItem icon={<Home />} active>
            Dashboard
          </SidebarNavItem>
          <SidebarNavItem icon={<Users />}>
            Users
          </SidebarNavItem>
          <SidebarNavItem icon={<FileText />}>
            Documents
          </SidebarNavItem>
          <SidebarNavItem icon={<BarChart3 />}>
            Analytics
          </SidebarNavItem>
          <SidebarNavItem icon={<Settings />}>
            Settings
          </SidebarNavItem>
        </SidebarNav>

        <SidebarFooter>
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-8 h-8 bg-blueberry-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">U</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                User
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              Collapsed Sidebar
            </h1>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
            <p className="text-neutral-600 dark:text-neutral-400">
              This shows the sidebar in collapsed state. Hover over the icons to see tooltips!
            </p>
          </div>
        </div>
      </SidebarContent>
    </SidebarProvider>
  ),
};
