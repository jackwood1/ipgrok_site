# Components

This directory contains the React components for the ipgrok Network & Media Tester application.

## Component Structure

### Core Components

- **Header** (`Header.tsx`) - Application header with logo and dark mode toggle
- **QuickTest** (`QuickTest.tsx`) - Combined network and media test for quick system assessment
- **NetworkTest** (`NetworkTest.tsx`) - Advanced network speed testing with quality scoring
- **NetworkMetrics** (`NetworkMetrics.tsx`) - Enhanced display of network test results with detailed metrics
- **PingTest** (`PingTest.tsx`) - Client-side ping test to measure connectivity and response time
- **TracerouteTest** (`TracerouteTest.tsx`) - Client-side traceroute simulation with IP and FQDN display
- **ConfigInfo** (`ConfigInfo.tsx`) - Comprehensive client-side system information display
- **ExportStats** (`ExportStats.tsx`) - Comprehensive export functionality for all test results
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
- **Purpose**: Advanced network performance analysis with quality scoring
- **Features**:
  - **Enhanced Speed Testing**: Download/upload/latency/jitter with real-time progress
  - **Bandwidth Estimation**: Calculated bandwidth score based on download and upload speeds
  - **Packet Loss Simulation**: Simulates packet loss using multiple HTTP requests
  - **Connection Quality Score**: Overall grade (A-F) with detailed scoring algorithm
  - **Smart Recommendations**: AI-powered suggestions based on test results
  - **Ping Test**: Connectivity and response time testing
  - **Traceroute Simulation**: Network path tracing with IP and FQDN display
  - **Real-time Progress**: Live updates during test execution
  - **Comprehensive Metrics**: Detailed performance analysis with color-coded indicators

### 3. Video Tab
- **Purpose**: Camera and microphone testing
- **Features**:
  - Device selection and configuration
  - Real-time video preview
  - Microphone activity visualization
  - Device compatibility testing

### 4. Config Tab
- **Purpose**: Comprehensive client-side system information
- **Features**:
  - **Network Information**: IP address, online status, connection type, downlink, RTT
  - **Browser Information**: User Agent string, platform, language, cookies, Do Not Track
  - **Display Information**: Screen resolution, color depth, WebGL support and vendor
  - **System Information**: Timezone, current time, CPU cores, device memory, battery status
  - **Storage Information**: Local storage and session storage capabilities
  - **Language Support**: Browser language preferences
  - **Real-time Data**: Live IP address detection and system status
  - **Visual Status Indicators**: Color-coded badges for different states

## Export Functionality

### ExportStats Component
- **Purpose**: Comprehensive data export from all tabs
- **Features**:
  - **JSON Export**: Complete test results in structured JSON format
  - **CSV Export**: Tabular data export for spreadsheet analysis
  - **Cross-Tab Data**: Aggregates data from all tabs (Network, Media, System, Quick Test)
  - **Real-time Updates**: Export data updates as tests are completed
  - **Timestamped Files**: Automatic file naming with timestamps
  - **Comprehensive Coverage**: Includes all test results, system info, and metadata

### Export Data Structure
- **Network Data**: Speed test results, ping test data, traceroute information, quality scores
- **Media Data**: Device information, permissions status, microphone statistics
- **System Data**: IP address, browser info, hardware specs, display details
- **Quick Test Data**: Overall assessment, network status, media status
- **Metadata**: Timestamps, test completion status, error information

### Export Formats
- **JSON Format**: Complete structured data with all test results and metadata
- **CSV Format**: Tabular format with test type, parameter, value, and timestamp columns
- **File Naming**: Automatic naming with format `video_call_test_results_[timestamp].[json|csv]`

## Advanced Network Testing Features

### Bandwidth Estimation
- **Algorithm**: Calculates bandwidth score based on download and upload speeds
- **Scoring**: Download (40% weight) and upload (30% weight) performance
- **Thresholds**: 
  - Download: 50+ Mbps (Excellent), 25+ Mbps (Good), 10+ Mbps (Fair), <10 Mbps (Poor)
  - Upload: 25+ Mbps (Excellent), 10+ Mbps (Good), 5+ Mbps (Fair), <5 Mbps (Poor)
- **Visual Display**: Progress bar with percentage score

### Packet Loss Simulation
- **Method**: Uses 20 HTTP requests to simulate packet loss
- **Algorithm**: Higher latency correlates with higher loss probability
- **Timeout**: 5-second timeout per request
- **Calculation**: Percentage of failed requests
- **Categories**: ≤1% (Excellent), ≤3% (Good), >3% (Poor)

### Connection Quality Score
- **Grading System**: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)
- **Scoring Algorithm**:
  - **Download Speed (40%)**: Critical for video call quality
  - **Upload Speed (30%)**: Important for outgoing video
  - **Latency (20%)**: Affects real-time communication
  - **Jitter (5%)**: Impacts video stability
  - **Packet Loss (5%)**: Critical for connection reliability
- **Smart Recommendations**: Context-aware suggestions based on test results
- **Visual Indicators**: Color-coded badges and progress indicators

### Enhanced Network Metrics
- **Download Speed**: With video call capability assessment
- **Upload Speed**: With transmission quality indicators
- **Latency**: With delay impact analysis
- **Jitter**: With stability assessment
- **Packet Loss Rate**: With reliability indicators
- **Bandwidth Score**: Combined performance metric
- **Quality Recommendations**: Actionable improvement suggestions

## Network Testing Features

### Speed Test
- **Download Speed**: Measures download bandwidth using a 5MB test file
- **Upload Speed**: Measures upload bandwidth using HTTP POST requests
- **Latency**: Simulated latency measurement
- **Jitter**: Simulated jitter measurement
- **Performance Assessment**: Color-coded performance indicators
- **Real-time Progress**: Live updates during test execution

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
- **IP and FQDN Display**: Shows both IP addresses and domain names
- **Hop Analysis**: Individual hop response times and status
- **Route Statistics**: Total hops, successful hops, and total time
- **Visual Status**: Icons for success (✅), timeout (⏱️), and error (❌)
- **HTTP Simulation**: Uses HTTP requests with increasing timeouts to simulate traceroute
- **DNS Resolution**: Forward and reverse DNS lookups for comprehensive information

## Configuration Information Features

### Network Information
- **IP Address Detection**: Uses multiple APIs (ipify.org, httpbin.org) for reliable IP detection
- **Connection Status**: Real-time online/offline status
- **Network Type**: Connection type and effective type detection
- **Performance Metrics**: Downlink speed and RTT when available
- **Public IP Badge**: Visual indicator for successfully detected public IP

### Browser Information
- **User Agent String**: Complete browser identification string in code block
- **Platform Detection**: Operating system and platform information
- **Language Settings**: Primary and secondary language preferences
- **Privacy Settings**: Cookie status and Do Not Track preferences
- **Feature Detection**: Browser capability assessment

### Display Information
- **Screen Resolution**: Current display resolution
- **Color Depth**: Display color depth in bits
- **WebGL Support**: Graphics acceleration capability
- **WebGL Details**: Vendor and renderer information when available
- **Hardware Acceleration**: Graphics card and driver information

### System Information
- **Timezone**: Current timezone setting
- **Current Time**: Local date and time
- **Hardware Specs**: CPU cores and device memory when available
- **Battery Status**: Battery level and charging status (mobile devices)
- **Performance Metrics**: Hardware capability assessment

### Storage Information
- **Local Storage**: Browser local storage capability
- **Session Storage**: Browser session storage capability
- **Storage Testing**: Actual storage availability testing
- **Feature Support**: Storage API compatibility

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
- **Export Section**: Prominent export functionality at the top level
- **Quality Score Display**: Prominent connection quality scoring with visual indicators

### Component Features
- **Loading States**: Buttons show loading spinners during async operations
- **Error Handling**: Consistent error display with colored badges and messages
- **Status Indicators**: Color-coded badges for different states (success, warning, error)
- **Interactive Elements**: Hover states, focus rings, and smooth transitions
- **Real-time Updates**: Results update as tests complete
- **Progressive Disclosure**: Information is revealed as tests progress
- **Information Cards**: Organized sections for different types of system data
- **Export Integration**: Seamless data collection and export from all components
- **Progress Indicators**: Real-time progress updates during test execution
- **Quality Visualizations**: Progress bars, color-coded metrics, and grade displays

## Architecture

The application has been refactored from a single large App.tsx file into modular components:

1. **Separation of Concerns**: Each component handles a specific feature
2. **Reusability**: UI components can be easily reused across the application
3. **Maintainability**: Smaller, focused components are easier to maintain and test
4. **Type Safety**: TypeScript interfaces ensure proper data flow between components
5. **Design Consistency**: Unified design system ensures consistent user experience
6. **Tabbed Organization**: Content is logically organized into tabs for better UX
7. **Comprehensive Information**: Detailed system configuration and capability assessment
8. **Data Export**: Centralized export functionality with cross-tab data aggregation
9. **Advanced Analytics**: Sophisticated network quality scoring and recommendations

## Component Communication

- **Props**: Components communicate through props (e.g., `permissionsStatus`, `onPermissionsChange`)
- **State Management**: Each component manages its own local state
- **Custom Hooks**: Shared logic is extracted into custom hooks (e.g., `useDarkMode`)
- **Tab State**: Tab navigation is managed by the Tabs component
- **API Integration**: External APIs for IP detection and system information
- **Data Export**: Components provide data updates through `onDataUpdate` callbacks
- **Centralized Export**: App-level data management for comprehensive export functionality
- **Real-time Updates**: Live progress updates and result streaming

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
│   ├── ConfigInfo.tsx
│   ├── ExportStats.tsx
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
import { Header, QuickTest, NetworkTest, MediaTest, Footer, PingTest, TracerouteTest, ConfigInfo, ExportStats } from "./components";
import { Card, Button, Badge, Tabs } from "./components/ui";
import { useDarkMode } from "./hooks";
```

## Design Principles

- **Clean & Modern**: Minimalist design with clear visual hierarchy
- **User-Friendly**: Intuitive interface with helpful tooltips and status indicators
- **Performance-Focused**: Optimized for speed and responsiveness
- **Accessible**: WCAG compliant with proper contrast and keyboard navigation
- **Organized**: Tabbed interface for logical content organization
- **Comprehensive**: Multiple testing methods and detailed system information
- **Educational**: Helpful explanations and interpretation guides
- **Informative**: Rich system configuration and capability data
- **Exportable**: Comprehensive data export for analysis and reporting
- **Analytical**: Advanced network quality scoring and intelligent recommendations 