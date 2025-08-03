# Components

This directory contains the React components for the ipgrok Video Call Tester application.

## Component Structure

### Core Components

- **Header** (`Header.tsx`) - Application header with logo and dark mode toggle
- **QuickTest** (`QuickTest.tsx`) - Combined network and media test for quick system assessment
- **NetworkTest** (`NetworkTest.tsx`) - Detailed network speed testing functionality
- **NetworkMetrics** (`NetworkMetrics.tsx`) - Displays network test results in a clean, organized format
- **PingTest** (`PingTest.tsx`) - Client-side ping test to measure connectivity and response time
- **TracerouteTest** (`TracerouteTest.tsx`) - Client-side traceroute simulation to trace network path
- **MediaTest** (`MediaTest.tsx`) - Webcam and microphone testing with device selection and visualization
- **Footer** (`Footer.tsx`) - Application footer with copyright information

### UI Components (`ui/`)

- **Card** (`ui/Card.tsx`) - Reusable card container with title and subtitle support
- **Button** (`ui/Button.tsx`) - Button component with multiple variants and loading states
- **Badge** (`ui/Badge.tsx`) - Status indicator badges with different colors
- **Select** (`ui/Select.tsx`) - Styled select dropdown with label and error support
- **Checkbox** (`ui/Checkbox.tsx`) - Styled checkbox with label
- **Tabs** (`ui/Tabs.tsx`) - Tab navigation component for organizing content

### Types

- **TestResults** (`../types/index.ts`) - TypeScript interface for network test results

### Hooks

- **useDarkMode** (`../hooks/useDarkMode.ts`) - Custom hook for managing dark mode state and localStorage persistence

## Tab Structure

The application now uses a tabbed interface to organize content:

### 1. Quick Test Tab
- **Purpose**: Provides a quick overview of system readiness
- **Features**: 
  - Combined network and media testing
  - Simplified status indicators
  - Overall system assessment
  - One-click testing for both network and media

### 2. Network Tab
- **Purpose**: Detailed network performance analysis
- **Features**:
  - Comprehensive speed testing (download/upload/latency/jitter)
  - Ping test to user-defined hosts
  - Traceroute simulation to trace network path
  - Detailed metrics display
  - Performance recommendations
  - Success rate and average response time analysis

### 3. Video Tab
- **Purpose**: Camera and microphone testing
- **Features**:
  - Device selection and configuration
  - Real-time video preview
  - Microphone activity visualization
  - Device compatibility testing

## Network Testing Features

### Speed Test
- **Download Speed**: Measures download bandwidth using a 5MB test file
- **Upload Speed**: Measures upload bandwidth using HTTP POST requests
- **Latency**: Simulated latency measurement
- **Jitter**: Simulated jitter measurement
- **Performance Assessment**: Color-coded performance indicators

### Ping Test
- **Custom Host**: Test connectivity to any user-defined host (default: www.microsoft.com)
- **Configurable Pings**: Choose from 1, 4, 8, or 10 ping attempts
- **Real-time Results**: Shows individual ping results as they complete
- **Statistics**: Success rate, average response time, and overall status
- **Interpretation Guide**: Helpful guidelines for understanding results
- **HTTP-based**: Uses HTTP requests to simulate ping (browser-compatible)

### Traceroute Test
- **Custom Host**: Trace route to any user-defined host (default: www.microsoft.com)
- **Configurable Hops**: Choose from 10, 15, 20, or 30 maximum hops
- **Progressive Results**: Shows route path as it's discovered
- **Hop Analysis**: Individual hop response times and status
- **Route Statistics**: Total hops, successful hops, and total time
- **Visual Status**: Icons for success (✅), timeout (⏱️), and error (❌)
- **HTTP Simulation**: Uses HTTP requests with increasing timeouts to simulate traceroute

## UI Improvements

### Design System
- **Consistent Styling**: All components use a unified design system with Tailwind CSS
- **Dark Mode Support**: Full dark mode support across all components
- **Responsive Design**: Mobile-first responsive design with proper breakpoints
- **Accessibility**: Focus states, proper contrast, and semantic HTML

### Layout Improvements
- **Tabbed Interface**: Content is organized into logical tabs for better user experience
- **Card-based Layout**: Content is organized in clean, bordered cards
- **Better Spacing**: Consistent spacing and padding throughout the application
- **Grid Layouts**: Responsive grid layouts for better content organization
- **Visual Hierarchy**: Clear typography hierarchy with proper heading sizes

### Component Features
- **Loading States**: Buttons show loading spinners during async operations
- **Error Handling**: Consistent error display with colored badges and messages
- **Status Indicators**: Color-coded badges for different states (success, warning, error)
- **Interactive Elements**: Hover states, focus rings, and smooth transitions
- **Real-time Updates**: Results update as tests complete
- **Progressive Disclosure**: Information is revealed as tests progress

## Architecture

The application has been refactored from a single large App.tsx file into modular components:

1. **Separation of Concerns**: Each component handles a specific feature
2. **Reusability**: UI components can be easily reused across the application
3. **Maintainability**: Smaller, focused components are easier to maintain and test
4. **Type Safety**: TypeScript interfaces ensure proper data flow between components
5. **Design Consistency**: Unified design system ensures consistent user experience
6. **Tabbed Organization**: Content is logically organized into tabs for better UX

## Component Communication

- **Props**: Components communicate through props (e.g., `permissionsStatus`, `onPermissionsChange`)
- **State Management**: Each component manages its own local state
- **Custom Hooks**: Shared logic is extracted into custom hooks (e.g., `useDarkMode`)
- **Tab State**: Tab navigation is managed by the Tabs component

## File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Tabs.tsx
│   │   └── index.ts
│   ├── Header.tsx
│   ├── QuickTest.tsx
│   ├── NetworkTest.tsx
│   ├── NetworkMetrics.tsx
│   ├── PingTest.tsx
│   ├── TracerouteTest.tsx
│   ├── MediaTest.tsx
│   ├── Footer.tsx
│   ├── index.ts
│   └── README.md
├── hooks/
│   ├── useDarkMode.ts
│   └── index.ts
├── types/
│   └── index.ts
└── App.tsx
```

## Usage

Import components from the index file:

```typescript
import { Header, QuickTest, NetworkTest, MediaTest, Footer, PingTest, TracerouteTest } from "./components";
import { Card, Button, Badge, Tabs } from "./components/ui";
import { useDarkMode } from "./hooks";
```

## Design Principles

- **Clean & Modern**: Minimalist design with clear visual hierarchy
- **User-Friendly**: Intuitive interface with helpful tooltips and status indicators
- **Performance-Focused**: Optimized for speed and responsiveness
- **Accessible**: WCAG compliant with proper contrast and keyboard navigation
- **Organized**: Tabbed interface for logical content organization
- **Comprehensive**: Multiple testing methods for thorough network analysis
- **Educational**: Helpful explanations and interpretation guides 