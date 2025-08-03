# Components

This directory contains the React components for the ipgrok Video Call Tester application.

## Component Structure

### Core Components

- **Header** (`Header.tsx`) - Application header with logo and dark mode toggle
- **QuickTest** (`QuickTest.tsx`) - Combined network and media test for quick system assessment
- **NetworkTest** (`NetworkTest.tsx`) - Detailed network speed testing functionality
- **NetworkMetrics** (`NetworkMetrics.tsx`) - Displays network test results in a clean, organized format
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
  - Comprehensive speed testing
  - Detailed metrics display
  - Performance recommendations
  - Historical test results

### 3. Video Tab
- **Purpose**: Camera and microphone testing
- **Features**:
  - Device selection and configuration
  - Real-time video preview
  - Microphone activity visualization
  - Device compatibility testing

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
import { Header, QuickTest, NetworkTest, MediaTest, Footer } from "./components";
import { Card, Button, Badge, Tabs } from "./components/ui";
import { useDarkMode } from "./hooks";
```

## Design Principles

- **Clean & Modern**: Minimalist design with clear visual hierarchy
- **User-Friendly**: Intuitive interface with helpful tooltips and status indicators
- **Performance-Focused**: Optimized for speed and responsiveness
- **Accessible**: WCAG compliant with proper contrast and keyboard navigation
- **Organized**: Tabbed interface for logical content organization 