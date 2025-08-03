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
- **EmailResults** (`EmailResults.tsx`) - Email functionality for sending test results
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
- **Purpose**: Advanced network performance analysis with quality scoring and comprehensive testing
- **Features**:
  - **Enhanced Speed Testing**: Download/upload/latency/jitter with real-time progress
  - **Bandwidth Estimation**: Calculated bandwidth score based on download and upload speeds
  - **Packet Loss Simulation**: Simulates packet loss using multiple HTTP requests
  - **Connection Quality Score**: Overall grade (A-F) with detailed scoring algorithm
  - **Smart Recommendations**: AI-powered suggestions based on test results
  - **Advanced Network Tests**: DNS, HTTP/HTTPS, CDN performance testing
  - **VPN Detection**: Automatic VPN usage detection with confidence scoring
  - **Network Type Detection**: Automatic detection of connection type (fiber, cable, DSL, mobile)
  - **Security Testing**: SSL certificate validation, firewall detection, proxy detection
  - **Ping Test**: Connectivity and response time testing
  - **Traceroute Simulation**: Network path tracing with IP and FQDN display
  - **Real-time Progress**: Live updates during test execution
  - **Comprehensive Metrics**: Detailed performance analysis with color-coded indicators

### 3. Video Tab
- **Purpose**: Advanced camera and microphone testing with comprehensive quality analysis
- **Features**:
  - **Device Configuration**: Camera and microphone selection with permission management
  - **Advanced Video Quality Test**: Comprehensive video analysis with detailed metrics
  - **Video Quality Metrics**: Resolution, frame rate, bitrate, codec, color depth, aspect ratio
  - **Audio Quality Metrics**: Sample rate, bit depth, channels, codec support
  - **Codec Support Testing**: Browser compatibility for various video and audio codecs
  - **Video Recording Test**: Record and analyze video quality with file size and format analysis
  - **Microphone Activity Test**: Real-time volume visualization with peak and average analysis
  - **Quality Assessment**: Color-coded quality indicators (excellent, good, fair, poor)
  - **Real-time Analysis**: Live video and audio quality assessment
  - **Recording Download**: Save test recordings for further analysis

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

### 5. Email Tab
- **Purpose**: Send test results via email with multiple service options
- **Features**:
  - **Multiple Email Services**: EmailJS, Formspree, and Netlify Forms integration
  - **Customizable Content**: Recipient email, subject, and additional message
  - **Comprehensive Data**: All test results formatted for email
  - **Alternative Actions**: Copy to clipboard and download as text file
  - **Setup Instructions**: Detailed guidance for configuring email services
  - **Real-time Feedback**: Success/error states with loading indicators
  - **Service Information**: Links to learn more about each email service

## Export and Email Functionality

### ExportStats Component
- **Purpose**: Comprehensive data export from all tabs
- **Features**:
  - **JSON Export**: Complete test results in structured JSON format
  - **CSV Export**: Tabular data export for spreadsheet analysis
  - **Cross-Tab Data**: Aggregates data from all tabs (Network, Media, System, Quick Test)
  - **Real-time Updates**: Export data updates as tests are completed
  - **Timestamped Files**: Automatic file naming with timestamps
  - **Comprehensive Coverage**: Includes all test results, system info, and metadata

### EmailResults Component
- **Purpose**: Send test results via email with multiple service integrations
- **Features**:
  - **Multiple Email Services**: Support for EmailJS, Formspree, and Netlify Forms
  - **Customizable Email**: Recipient, subject, and additional message fields
  - **Formatted Content**: Comprehensive test results formatted for email readability
  - **Alternative Actions**: Copy to clipboard and download as text file
  - **Service Integration**: Ready-to-use integration with popular email services
  - **Setup Guidance**: Detailed instructions for configuring each service
  - **Error Handling**: Comprehensive error handling and user feedback

### Export Data Structure
- **Network Data**: Speed test results, ping test data, traceroute information, quality scores
- **Media Data**: Device information, permissions status, microphone statistics, video quality metrics, audio quality metrics, codec support, recording test data
- **System Data**: IP address, browser info, hardware specs, display details
- **Quick Test Data**: Overall assessment, network status, media status
- **Metadata**: Timestamps, test completion status, error information

### Export Formats
- **JSON Format**: Complete structured data with all test results and metadata
- **CSV Format**: Tabular format with test type, parameter, value, and timestamp columns
- **File Naming**: Automatic naming with format `video_call_test_results_[timestamp].[json|csv]`

### Email Service Integration
- **EmailJS**: Client-side email service with free tier and template support
- **Formspree**: Form handling service with email forwarding and spam protection
- **Netlify Forms**: Built-in form handling for Netlify deployments with automatic email forwarding
- **Setup Required**: Each service requires initial configuration (service IDs, endpoints, templates)
- **Fallback Options**: Copy to clipboard and download as text file for immediate use

## Advanced Video Testing Features

### Video Quality Assessment
- **Resolution Detection**: Automatic detection of camera resolution capabilities
- **Frame Rate Analysis**: Real-time frame rate measurement and assessment
- **Bitrate Estimation**: Calculated video bitrate based on resolution and frame rate
- **Color Depth Analysis**: Detection of color depth capabilities (typically 24-bit)
- **Aspect Ratio Detection**: Automatic aspect ratio calculation
- **Quality Grading**: A-F grading system based on resolution and frame rate
- **Real-time Analysis**: Live video quality assessment during testing

### Audio Quality Assessment
- **Sample Rate Detection**: Audio sample rate measurement (typically 44.1kHz or 48kHz)
- **Bit Depth Analysis**: Audio bit depth detection (typically 16-bit)
- **Channel Count**: Mono/stereo channel detection
- **Audio Codec Support**: Browser audio codec compatibility testing
- **Quality Grading**: Quality assessment based on sample rate and channels

### Codec Support Testing
- **Video Codecs**: WebM, MP4, OGG, AV1, H.264, H.265, VP8, VP9
- **Audio Codecs**: AAC, Opus, Vorbis
- **Browser Compatibility**: Comprehensive codec support matrix
- **Visual Indicators**: Clear support/unsupported indicators for each codec

### Video Recording Test
- **High-Quality Recording**: WebM format with VP8 video and Opus audio
- **Configurable Quality**: 2.5 Mbps video, 128 kbps audio bitrates
- **Duration Tracking**: Real-time recording duration display
- **File Size Analysis**: Automatic file size calculation and formatting
- **Download Capability**: Save recordings for further analysis
- **Quality Preservation**: Maintains original video/audio quality in recordings

### Microphone Activity Test
- **Real-time Visualization**: Live volume level display with animated bars
- **Volume Analysis**: Peak and average volume calculation
- **Sample Collection**: Continuous volume sampling for accurate analysis
- **Visual Feedback**: Color-coded volume indicators
- **Statistical Analysis**: Comprehensive microphone performance metrics

### Device Configuration
- **Permission Management**: Automatic camera and microphone permission requests
- **Device Selection**: Camera and microphone device selection
- **Permission Status**: Clear indication of permission status
- **Error Handling**: Graceful handling of permission denials

## Advanced Network Tests

### DNS Performance Testing
- **Multi-Domain Testing**: Tests DNS resolution for multiple popular domains
- **Response Time Analysis**: Measures average DNS resolution time
- **Performance Grading**: Excellent (≤50ms), Good (≤100ms), Fair (≤200ms), Poor (>200ms)
- **Real-time Results**: Live DNS performance assessment

### HTTP/HTTPS Performance Testing
- **Protocol Comparison**: Separate testing for HTTP and HTTPS performance
- **Response Time Measurement**: Average response time for multiple endpoints
- **Performance Thresholds**: 
  - HTTP: Excellent (≤100ms), Good (≤200ms), Fair (≤500ms), Poor (>500ms)
  - HTTPS: Excellent (≤150ms), Good (≤300ms), Fair (≤600ms), Poor (>600ms)
- **Timeout Handling**: 5-second timeout with graceful error handling

### CDN Performance Testing
- **Multi-CDN Testing**: Tests performance across different CDN providers
- **Static Asset Testing**: Tests common CDN-hosted resources (CSS, JS, fonts)
- **Performance Assessment**: Excellent (≤200ms), Good (≤400ms), Fair (≤800ms), Poor (>800ms)
- **CDN Providers**: jsDelivr, Cloudflare, unpkg

### VPN Detection
- **IP Analysis**: Geolocation-based VPN detection
- **Provider Detection**: Identifies known VPN service providers
- **Confidence Scoring**: Percentage-based confidence in VPN detection
- **Detection Methods**:
  - Known VPN provider IP ranges
  - Datacenter IP detection
  - Timezone mismatch analysis
- **Detailed Reporting**: Specific reasons for VPN detection

### Network Type Detection
- **Connection Type**: Automatic detection of fiber, cable, DSL, or mobile connections
- **Network Information API**: Uses browser's Network Information API when available
- **Fallback Detection**: Performance-based connection type estimation
- **Detailed Information**: Connection type, effective type, and downlink speed

### Security Testing
- **SSL Certificate Validation**: Tests SSL/TLS certificate validity
- **Firewall Detection**: Identifies potential firewall restrictions
- **Proxy Detection**: Detects proxy usage through HTTP headers
- **Security Assessment**: Comprehensive security posture evaluation

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
- **Shareable**: Email functionality for sharing results with others 