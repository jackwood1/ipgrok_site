# Components

This directory contains the React components for the ipgrok Video Call Tester application.

## Component Structure

### Core Components

- **Header** (`Header.tsx`) - Application header with logo, title, and dark mode toggle
- **NetworkTest** (`NetworkTest.tsx`) - Network speed testing functionality (download/upload/latency)
- **MediaTest** (`MediaTest.tsx`) - Webcam and microphone testing with device selection
- **Footer** (`Footer.tsx`) - Application footer with copyright information

### Types

- **TestResults** (`../types/index.ts`) - TypeScript interface for network test results

### Hooks

- **useDarkMode** (`../hooks/useDarkMode.ts`) - Custom hook for managing dark mode state and localStorage persistence

## Architecture

The application has been refactored from a single large App.tsx file into modular components:

1. **Separation of Concerns**: Each component handles a specific feature
2. **Reusability**: Components can be easily reused or modified independently
3. **Maintainability**: Smaller, focused components are easier to maintain and test
4. **Type Safety**: TypeScript interfaces ensure proper data flow between components

## Component Communication

- **Props**: Components communicate through props (e.g., `permissionsStatus`, `onPermissionsChange`)
- **State Management**: Each component manages its own local state
- **Custom Hooks**: Shared logic is extracted into custom hooks (e.g., `useDarkMode`)

## File Structure

```
src/
├── components/
│   ├── Header.tsx
│   ├── NetworkTest.tsx
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
import { Header, NetworkTest, MediaTest, Footer } from "./components";
import { useDarkMode } from "./hooks";
``` 