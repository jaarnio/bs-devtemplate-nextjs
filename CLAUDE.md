# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js + React reference application designed to run on Node.js 18 with Chromium 120 compatibility. The application demonstrates MQTT integration and modern UI components while maintaining a single JavaScript entry point for deployment.

## Key Constraints

- **Runtime**: Node.js 18.x and Chromium 120
- **Entry Point**: Must generate a single `.js` file (e.g., `server.js`) for deployment
- **Deployment**: Serves on `localhost:{port}`
- **Build Output**: Standalone Next.js build with bundled dependencies

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build            # Standard Next.js build
npm run build:dist       # Creates single entry point in dist/

# Start production server
npm start                # Runs dist/server.js
npm start:next           # Runs Next.js production server

# Linting & Type checking
npm run lint
npm run typecheck
```

## Architecture

### Tech Stack
- **React 18/19** - UI framework
- **Next.js 14/15** - Full-stack React framework with standalone output mode
- **MQTT.js 5.x** - Real-time messaging via WebSocket
- **Tailwind CSS + DaisyUI** - Styling framework and component library
- **TypeScript** - Type safety

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes (health, mqtt endpoints)
│   └── page.tsx        # Main application page
├── components/         # React components
│   ├── HelloWorld.tsx
│   ├── MqttPanel.tsx
│   └── ui/            # UI framework components
├── lib/               # Utilities and clients
│   ├── mqtt-client.ts # MQTT connection logic
│   └── config.ts      # Configuration management
scripts/
└── build-entry.js     # Generates single server.js entry point
```

### Key API Endpoints
- `GET /` - Main application
- `GET /api/health` - Health check endpoint
- `GET /api/mqtt/status` - MQTT connection status
- `WebSocket /api/mqtt/stream` - Real-time MQTT messages

## MQTT Integration

The application connects to a public MQTT broker (default: `test.mosquitto.org`) and demonstrates publish/subscribe functionality. MQTT.js uses WebSocket transport for browser compatibility.

## Build Process

The build process uses Next.js standalone output mode combined with a custom script to generate a single entry point:

1. **Next.js Build**: `npm run build`
   - Builds the application in standalone mode
   - Generates optimized production build in `.next/`
   - Creates self-contained server with bundled dependencies

2. **Distribution Build**: `npm run build:dist`
   - Runs `scripts/build-entry.js`
   - Creates `dist/` folder with single `server.js` entry point
   - Copies standalone build and static assets
   - Includes all runtime dependencies (~2300 files, ~40MB)

### Build Output
- Single entry point: `dist/server.js`
- Complete Next.js functionality (SSR, API routes, static assets)
- Production-ready with all optimizations
- Node.js 18+ compatible

## Critical Implementation Notes

1. **Next.js Configuration**: Use `output: 'standalone'` in `next.config.js`
2. **Webpack Fallbacks**: Configure fallbacks for Node.js modules (fs, net, tls) in client-side code
3. **Environment Variables**: Use `.env.local` for development, ensure `PORT` is configurable
4. **MQTT WebSocket**: Ensure MQTT broker URL uses `ws://` or `wss://` protocol
5. **Chromium 120 Compatibility**: Avoid using JavaScript features newer than ES2023